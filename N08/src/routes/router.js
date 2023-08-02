import { Router } from "express";
import Loggers from "../logger/config.js";
import config from "../config/config.js";

//Clase padre
export default class BaseRouter {

    constructor(){
        this.router = Router();
        this.init();
    }

    getRouter() {  //Para poder acceder al router de express desde afuera.
        return this.router;
    }

    init() {}

    get(path, policies, ...callbacks) {
        this.router.get(path, this.attachLogger,this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    post(path, policies, ...callbacks){
        this.router.post(path, this.attachLogger, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    put(path, policies, ...callbacks){
        this.router.put(path, this.attachLogger, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    delete(path, policies, ...callbacks){
        this.router.delete(path, this.attachLogger, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    //POLICIES
    handlePolicies = policies => {
        return (req,res,next) => {
            const user = req.session.user;
            if ((policies[0].toUpperCase() === 'PUBLIC')) return next();
            if (!user) return res.redirect('/login');
            if ((policies[0].toUpperCase() === 'USER') && (user.role.toUpperCase() === 'USER')) return next()
            req.user = user;
            next();
        }
    }

    
    /* A partir del siguiente middleware se coloca en el objeto req el logger. */
    attachLogger = (req,res,next) =>{
        const logger = new Loggers(config.app.ENVIRONMENT)
        req.logger = logger.logger;
        next();
    }

    // HOMOLOGACIÓN DE RESPUESTAS
    generateCustomResponses = (req, res, next)=> {
        res.sendSuccess = (message, value) =>
            res.status(200).json({
            success: 'success',
            message,
            value
        });
        res.sendError = (status, message, value) =>
            res.status(status).json({
            success: 'error',
            message,
            value
        });
        res.sendSuccessMessage = message => res.send({status:'success', message});
        res.sendError = message => res.send({status:'error', message});
        res.RenderInternalError = (message, userStatus) => res.render('../src/views/partials/error.hbs', { message: message, userStatus: userStatus})
        next();
    }


    applyallbacks (callbacks) {
        return callbacks.map(callback=>async(...params)=> {
            try {
                // this = contexto del servidor
                await callback.apply(this,params)
            } catch (error) {
                //params[1] es res
                params[1].status(500).send(error);
            }
        })
    }

}
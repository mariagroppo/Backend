import { Router } from "express";

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
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    post(path, policies, ...callbacks){
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    put(path, policies, ...callbacks){
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    delete(path, policies, ...callbacks){
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    //POLICIES
    handlePolicies = policies => {
        return (req,res,next) => {
            const user = req.session.user;
            if ((policies[0].toUpperCase() === 'PUBLIC')) return next();
            if (!user) return res.redirect('/login');
            if ((policies[0].toUpperCase() === 'USER') && (user.role.toUpperCase() === 'USER')) return next()

            //if ((policies[0].toUpperCase() === 'ADMIN') && user?.role.toUpperCase() === 'ADMIN') return next();
            //if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({status:'error', error:"Forbidden."})
            
            req.user = user;
            next();
        }
    }

    // HOMOLOGACIÓN DE RESPUESTAS
    generateCustomResponses = (req, res, next)=> {
        res.sendSuccess = message => res.send({status:'success', message});
        res.sendError = message => res.send({status:'error', message});
        res.RenderInternalError = message => res.render('../src/views/partials/error.hbs', 
            { message: message, userStatus: false})
        res.sendNotFound = message => res.status(404).send({status:'error', message})
        
        
        
        res.sendSuccessWithPayload = payload => res.send({status:'success', payload})
        //res.sendInternalError = error => res.status(500).send({status:'error', error})
        res.sendUnauthorized = error => res.status(400).send({status:'error', error})

        /* res.sendInternalError = (error, message, status) => res.render('../src/views/partials/error.hbs', 
            { message: message + ": " + error , userStatus: status}) */
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
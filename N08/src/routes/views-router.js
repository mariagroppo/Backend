//import express from 'express';
import passport from 'passport';
import { privacy } from '../auth/auth.js';
import views_register_controllers from '../controllers/views-register-controllers.js';
import views_login_controllers from '../controllers/views-login-controllers..js';
import viewsOtherSessionControllers from '../controllers/views-otherSession-controllers.js';
import viewsProductsControllers from '../controllers/views-products-controllers.js';
import viewsCartsControllers from '../controllers/views-carts-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';

export default class ViewsRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], privacy('NO_AUTHENTICATED'), views_register_controllers.viewProducts);
        this.get('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), views_register_controllers.registerForm);
        this.post('/register', ['PUBLIC'], passport.authenticate('register', {failureRedirect:'/registerFail'}), views_register_controllers.register);
        this.get('/registerFail', ['PUBLIC'], views_register_controllers.registerFailed);
        
        this.get('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), views_login_controllers.loginForm);
        this.post('/login', ['PUBLIC'], passport.authenticate('login', {failureRedirect: '/loginFailed',failureMessage: true}), views_login_controllers.login);
        this.get('/loginFailed', ['PUBLIC'], views_login_controllers.loginFailed);
        this.get('/login/github', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('github'),(req,res)=>{});
        this.get('/login/githubcallback', ['PUBLIC'], passport.authenticate('github'), views_login_controllers.githubCallback)
        
        this.get('/logout', ['USER'], privacy('PRIVATE'), viewsOtherSessionControllers.logout);
        this.get('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsOtherSessionControllers.restorePasswordForm);
        this.post('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsOtherSessionControllers.restorePassword);
        
        this.get('/products', ['USER'], privacy('PRIVATE'), viewsProductsControllers.viewProducts);
        this.get('/products/add', ['USER'], privacy('PRIVATE'), viewsProductsControllers.addProductForm);
        this.post('/products/add', ['USER'], privacy('PRIVATE'), viewsProductsControllers.addProduct);
        this.get('/products/:pid', ['USER'], privacy('PRIVATE'), viewsProductsControllers.productById)
        this.get('/products/update/:pid', ['USER'], privacy('PRIVATE'), viewsProductsControllers.updateProductByIdForm)
        this.post('/products/update/:pid', ['USER'], privacy('PRIVATE'), viewsProductsControllers.updateProductById)
        this.post('/products/delete/:pid', ['USER'], privacy('PRIVATE'), viewsProductsControllers.deleteProductById)
        this.get('/ faker', ['USER'], privacy('PRIVATE'), viewsProductsControllers.faker);
        
        //this.get('/realtimeproducts', ['USER'], privacy('PRIVATE'), getProducts)
        //this.get('/chat', ['USER'], privacy('PRIVATE'), getChat)
        this.get('/carts', ['USER'], privacy('PRIVATE'), viewsCartsControllers.viewCarts);
        this.get('/carts/add', ['USER'], privacy('PRIVATE'), viewsCartsControllers.addNewCart);
        this.get('/carts/:cid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.cartById);
        this.post('/carts/delete/:cid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.deleteCartById);
        this.post('/carts/product/:pid',  ['USER'], privacy('PRIVATE'), viewsCartsControllers.addProductInCart);
        this.post('/carts/delete/:cid/product/:id', ['USER'], privacy('PRIVATE'), viewsCartsControllers.deleteProduct)
        this.post('/carts/update/:cid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.updateCart);
        this.post('/closeCart/:cid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.closeCart)
        
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.views_pageNotFound)
        
    }
}

/* this.param('pid', async(req,res,next,pid)=>{
            const isValidParam = /^[0-9]+$/.test(pid);
            if(!isValidParam) return res.status(404).send({status: 'error', error:'not found'})
            req.pid=pid;
            next();
        }) */
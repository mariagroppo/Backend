//import express from 'express';
import passport from 'passport';
import { privacy } from '../auth/auth.js';
import viewsControllers from '../controllers/controllersViews.js';
import BaseRouter from './router.js';

export default class ViewsRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsControllers.viewProducts);
        this.get('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsControllers.registerForm);
        this.post('/register', ['PUBLIC'], passport.authenticate('register', {failureRedirect:'/registerFail'}), viewsControllers.register);
        this.get('/registerFail', ['PUBLIC'], viewsControllers.registerFailed);
        this.get('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsControllers.loginForm);
        this.post('/login', ['PUBLIC'], passport.authenticate('login', {failureRedirect: '/loginFailed',failureMessage: true}), viewsControllers.login);
        this.get('/loginFailed', ['PUBLIC'], viewsControllers.loginFailed);
        this.get('/login/github', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('github'),(req,res)=>{});
        this.get('/login/githubcallback', ['PUBLIC'], passport.authenticate('github'), viewsControllers.githubCallback)
        this.get('/logout', ['USER'], privacy('PRIVATE'), viewsControllers.logout);
        this.get('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsControllers.restorePasswordForm);
        this.post('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsControllers.restorePassword);
        this.get('/products', ['USER'], privacy('PRIVATE'), viewsControllers.viewProducts);
        this.get('/products/add', ['USER'], privacy('PRIVATE'), viewsControllers.addProductForm);
        this.post('/products/add', ['USER'], privacy('PRIVATE'), viewsControllers.addProduct);
        this.get('/products/:pid', ['USER'], privacy('PRIVATE'), viewsControllers.productById)
        this.get('/products/update/:pid', ['USER'], privacy('PRIVATE'), viewsControllers.updateProductByIdForm)
        this.post('/products/update/:pid', ['USER'], privacy('PRIVATE'), viewsControllers.updateProductById)
        this.post('/products/delete/:pid', ['USER'], privacy('PRIVATE'), viewsControllers.deleteProductById)
        //this.get('/realtimeproducts', ['USER'], privacy('PRIVATE'), getProducts)
        //this.get('/chat', ['USER'], privacy('PRIVATE'), getChat)
        this.get('/carts', ['USER'], privacy('PRIVATE'), viewsControllers.viewCarts);
        this.get('/carts/add', ['USER'], privacy('PRIVATE'), viewsControllers.addNewCart);
        this.get('/carts/:cid', ['USER'], privacy('PRIVATE'), viewsControllers.cartById);
        this.post('/carts/delete/:cid', ['USER'], privacy('PRIVATE'), viewsControllers.deleteCartById);
        this.post('/carts/product/:pid',  ['USER'], privacy('PRIVATE'), viewsControllers.addProductInCart);
        this.post('/carts/delete/:cid/product/:id', ['USER'], privacy('PRIVATE'), viewsControllers.deleteProduct)
        this.post('/carts/update/:cid', ['USER'], privacy('PRIVATE'), viewsControllers.updateCart);
        this.post('/closeCart/:cid', ['USER'], privacy('PRIVATE'), viewsControllers.closeCart)
        this.get('/faker-js', ['USER'], privacy('PRIVATE'), viewsControllers.faker);
        this.get('*', ['USER'], privacy('PRIVATE'), viewsControllers.pageNotFound)
        //this.get
        
    }
}

/* this.param('pid', async(req,res,next,pid)=>{
            const isValidParam = /^[0-9]+$/.test(pid);
            if(!isValidParam) return res.status(404).send({status: 'error', error:'not found'})
            req.pid=pid;
            next();
        }) */
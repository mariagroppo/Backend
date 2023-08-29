
import passport from 'passport';
import { privacy } from '../auth/auth.js';
import views_register_controllers from '../controllers/views-register-controllers.js';
import views_login_controllers from '../controllers/views-login-controllers..js';
import viewsOtherSessionControllers from '../controllers/views-otherSession-controllers.js';
import productControllers from '../controllers/product-controllers.js';
import userRegisterControllers from '../controllers/user-register-controller.js';
import userLoginControllers from '../controllers/user-login-controllers.js';
import viewsProductsControllers from '../controllers/views-products-controllers.js';
import viewsCartsControllers from '../controllers/views-carts-controllers.js';
import cartsControllers from '../controllers/carts-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';

export default class ViewsRouter extends BaseRouter {
    init() {
        this.get('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.registerForm, views_register_controllers.registerForm);
        this.post('/register', ['PUBLIC'], passport.authenticate('register', {failureRedirect:'/registerFail'}), userRegisterControllers.register, views_register_controllers.register);
        this.get('/registerFail', ['PUBLIC'], userRegisterControllers.registerFail, views_register_controllers.registerFailed);
        
        this.get('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userLoginControllers.loginForm, views_login_controllers.loginForm);
        this.post('/login', ['PUBLIC'], passport.authenticate('login', {failureRedirect: '/loginFailed',failureMessage: true}), userLoginControllers.login, views_login_controllers.login);
        this.get('/loginFailed', ['PUBLIC'], userLoginControllers.loginFail, views_login_controllers.loginFailed);
        this.get('/login/github', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('github'),(req,res)=>{});
        this.get('/login/githubcallback', ['PUBLIC'], passport.authenticate('github'), views_login_controllers.githubCallback)
        
        this.get('/logout', ['USER'], privacy('PRIVATE'), viewsOtherSessionControllers.logout);
        this.get('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsOtherSessionControllers.restorePasswordForm);
        this.post('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsOtherSessionControllers.restorePassword);
        

        /* PRODUCTOS  ------------------------------------------------------------ */
        this.get('/products/mine',['USER'], privacy('PRIVATE'), productControllers.getProducts, viewsProductsControllers.viewProducts);
        this.get('/products', ['USER'], privacy('PRIVATE'), productControllers.getProducts, viewsProductsControllers.viewProducts);
        this.get('/products/mine/add', ['USER'], privacy('PRIVATE'), productControllers.addProductForm, viewsProductsControllers.addProductForm);
        this.post('/products/mine/add',  ['USER'], privacy('PRIVATE'), productControllers.addProduct, viewsProductsControllers.addProduct);
        this.get('/products/:pid',  ['USER'], privacy('PRIVATE'), productControllers.getProductById, viewsProductsControllers.productById)

        this.get('/products/mine/update/:pid', ['USER'], privacy('PRIVATE'), viewsProductsControllers.updateProductByIdForm)
        this.post('/products/mine/update/:pid', ['USER'], privacy('PRIVATE'), productControllers.updateProductById, viewsProductsControllers.updateProductById)
        this.post('/products/mine/delete/:pid', ['USER'], privacy('PRIVATE'), productControllers.deleteProductById, viewsProductsControllers.deleteProductById)
        
        this.get('/faker', ['USER'], privacy('PRIVATE'), viewsProductsControllers.faker);
        
        //this.get('/realtimeproducts', ['USER'], privacy('PRIVATE'), getProducts)
        //this.get('/chat', ['USER'], privacy('PRIVATE'), getChat)
        

        /* CARTS ------------------------------------------------------------------ */
        this.get('/carts', ['USER'], privacy('PRIVATE'), cartsControllers.getCarts, viewsCartsControllers.viewCarts);
        this.get('/carts/add', ['USER'], privacy('PRIVATE'), cartsControllers.addNewCart, viewsCartsControllers.addNewCart);
        this.get('/carts/:cid', ['USER'], privacy('PRIVATE'),  cartsControllers.getCartById, viewsCartsControllers.cartById);
        this.post('/carts/delete/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.deleteCartById, viewsCartsControllers.deleteCartById);
        this.post('/carts/product/:pid',  ['USER'], privacy('PRIVATE'), cartsControllers.addProductInCart, viewsCartsControllers.addProductInCart);
        this.post('/carts/delete/:cid/product/:id', ['USER'], privacy('PRIVATE'), cartsControllers.deleteProduct, viewsCartsControllers.deleteProduct)
        this.post('/carts/update/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.updateCart, viewsCartsControllers.updateCart);
        this.post('/closeCart/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.closeCart, viewsCartsControllers.closeCart)
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.views_pageNotFound)
        
    }
}

/* this.param('pid', async(req,res,next,pid)=>{
            const isValidParam = /^[0-9]+$/.test(pid);
            if(!isValidParam) return res.status(404).send({status: 'error', error:'not found'})
            req.pid=pid;
            next();
        }) */
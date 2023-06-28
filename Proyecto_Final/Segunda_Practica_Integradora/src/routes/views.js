import express from 'express';
import passport from 'passport';
import { getProducts
} from '../controllers/controllersRealTime.js';
import { auth3, auth4 } from '../auth/auth.js';

import { viewProducts,
    viewAddProduct,
    viewAddProductForm,
    viewUpdateProductByIdForm,
    viewProductById,
    viewUpdateProductById,
    viewDeleteProductById,
    viewCarts,
    viewsAddNewCart,
    viewCartById,
    viewDeleteCartById,
    viewAddProductInCart,
    viewDeleteProduct,
    viewUpdateCart,
    signInForm,
    signIn,
    signInFailed,
    loginForm,
    loginFailed,
    login,
    githubCallback,
    logout,
    restorePasswordForm,
    restorePassword
 } from '../controllers/controllersViews.js';
const routerViews = express.Router();

routerViews.get('/', viewProducts);

/* REGISTER ----------------------- */
routerViews.get('/signin', signInForm);
routerViews.post('/signin', passport.authenticate('signin', {failureRedirect:'/views/signin/registerFail'}), signIn);
routerViews.get('/signin/registerFail', signInFailed);

/* LOGIN -------------------------------- */
routerViews.get('/login', auth4, loginForm);
routerViews.post('/login', passport.authenticate('login', {failureRedirect: '/views/login/loginFailed',failureMessage: true}), login);
routerViews.get('/login/loginFailed', loginFailed);
routerViews.get('/login/github', auth4, passport.authenticate('github'),(req,res)=>{});
routerViews.get('/login/githubcallback', passport.authenticate('github'), githubCallback)

/* LOGOUT ------------------------------------ */
routerViews.get('/logout', logout);

/* RESTORE PASSWORD -------------------------- */
routerViews.get('/restorePassword', restorePasswordForm);
routerViews.post('/restorePassword', restorePassword);

/* REAL TIME PRODUCTS ------------------- */
routerViews.get('/realtimeproducts', auth3, getProducts)

/* Devuelve todos los productos -------------------------------- */
routerViews.get('/products', auth3, viewProducts);

/* Agrega un producto -------------------------------- */
routerViews.get('/products/add', auth3, viewAddProductForm);
routerViews.post('/products/add', auth3, viewAddProduct);

/* Devuelve un producto segùn su id ----------------------------*/
routerViews.get('/products/:pid', auth3, viewProductById)

/* Actualiza un producto segùn su id --------------------------*/
routerViews.get('/products/update/:pid', auth3, viewUpdateProductByIdForm)
routerViews.post('/products/update/:pid', auth3, viewUpdateProductById)

/* Borra producto segun su id */
routerViews.post('/products/delete/:pid', auth3, viewDeleteProductById)

/* Devuelve todos los carts -------------------------------- */
routerViews.get('/carts', auth3, viewCarts);

/* Crea un nuevo carrito ------------------------------------------- */
routerViews.get('/carts/add', auth3, viewsAddNewCart);

/* Devuelve un carrito segùn su id */
routerViews.get('/carts/:cid', auth3, viewCartById)

/* Borra carrito segun su id */
routerViews.post('/carts/delete/:cid', auth3, viewDeleteCartById)

/* Agregar producto a carrito abierto */
routerViews.post('/carts/product/:pid', auth3, viewAddProductInCart);

/* Borra producto de carrito */
routerViews.post('/carts/delete/:cid/product/:id', auth3, viewDeleteProduct)

/* Actualiza la cantidad de un producto del carrito */
routerViews.post('/carts/update/:cid', auth3, viewUpdateCart)

export default routerViews;
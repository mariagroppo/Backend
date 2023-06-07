import express from 'express';

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
    viewUpdateCart
 } from '../controllers/controllersViews.js';
const routerViews = express.Router();

/* Devuelve todos los productos -------------------------------- */
routerViews.get('/products', viewProducts);

/* Agrega un producto -------------------------------- */
routerViews.get('/products/add', viewAddProductForm);
routerViews.post('/products/add', viewAddProduct);

/* Devuelve un producto segùn su id ----------------------------*/
routerViews.get('/products/:pid', viewProductById)

/* Actualiza un producto segùn su id --------------------------*/
routerViews.get('/products/update/:pid', viewUpdateProductByIdForm)
routerViews.post('/products/update/:pid', viewUpdateProductById)

/* Borra producto segun su id */
routerViews.post('/products/delete/:pid', viewDeleteProductById)

/* Devuelve todos los carts -------------------------------- */
routerViews.get('/carts', viewCarts);

/* Crea un nuevo carrito ------------------------------------------- */
routerViews.get('/carts/add', viewsAddNewCart);

/* Devuelve un carrito segùn su id */
routerViews.get('/carts/:cid', viewCartById)

/* Borra carrito segun su id */
routerViews.post('/carts/delete/:cid', viewDeleteCartById)

/* Agregar producto a carrito abierto */
routerViews.post('/carts/product/:pid', viewAddProductInCart);

/* Borra producto de carrito */
routerViews.post('/carts/delete/:cid/product/:id', viewDeleteProduct)

/* Actualiza la cantidad de un producto del carrito */
routerViews.post('/carts/update/:cid', viewUpdateCart)

export default routerViews;
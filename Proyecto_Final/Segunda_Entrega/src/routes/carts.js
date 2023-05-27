import express from 'express';

import { addNewCart,
    getCarts,
    getCartById,
    deleteCartById,
    addProductInCart,
    updateCart,
    deleteProduct
} from '../controllers/controllersCarts.js';
const routerCarts = express.Router();

/* GET Vista de todos los productos -------------------------------- */
routerCarts.get('/', getCarts);

/* creacion de un carrito ------------------------------------------- */
routerCarts.get('/addNewCart', addNewCart);

/* devuelve un producto segùn su id */
routerCarts.get('/:cid', getCartById)

/* Borra carrito entero segun su id */
routerCarts.post('/delete/:cid', deleteCartById)

routerCarts.post('/deleteProduct/:id', deleteProduct)

routerCarts.post('/:id', addProductInCart);

routerCarts.post('/updateCart/:cid', updateCart)

export default routerCarts;
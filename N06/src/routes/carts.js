import express from 'express';
import auth from '../auth/auth.js';

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
routerCarts.get('/', auth, getCarts);

/* creacion de un carrito ------------------------------------------- */
routerCarts.get('/addNewCart', auth, addNewCart);

/* devuelve un producto segùn su id */
routerCarts.get('/:cid', auth, getCartById)

/* Borra carrito entero segun su id */
routerCarts.post('/delete/:cid', auth, deleteCartById)

routerCarts.post('/deleteProduct/:id', auth, deleteProduct)

routerCarts.post('/:id', auth, addProductInCart);

routerCarts.post('/updateCart/:cid', auth, updateCart)

export default routerCarts;
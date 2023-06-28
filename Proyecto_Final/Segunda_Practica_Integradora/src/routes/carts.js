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

/* Devuelve todos los carts -------------------------------- */
routerCarts.get('/', auth, getCarts);

/* Crea un nuevo carrito ------------------------------------------- */
routerCarts.post('/', auth, addNewCart);

/* Devuelve un carrito segùn su id */
routerCarts.get('/:cid', auth, getCartById)

/* Borra carrito segun su id */
routerCarts.delete('/:cid', auth, deleteCartById)

/* Agregar producto a carrito abierto */
routerCarts.post('/:cid/product/:pid', auth, addProductInCart);

/* Borra producto de carrito */
routerCarts.delete('/:cid/product/:id', auth, deleteProduct)

/* Actualiza la cantidad de un producto del carrito */
routerCarts.put('/:cid/product/:id', auth, updateCart)

export default routerCarts;
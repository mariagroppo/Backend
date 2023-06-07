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

/* Devuelve todos los carts -------------------------------- */
routerCarts.get('/', getCarts);

/* Crea un nuevo carrito ------------------------------------------- */
routerCarts.post('/', addNewCart);

/* Devuelve un carrito segùn su id */
routerCarts.get('/:cid', getCartById)

/* Borra carrito segun su id */
routerCarts.delete('/:cid', deleteCartById)

/* Agregar producto a carrito abierto */
routerCarts.post('/:cid/product/:pid', addProductInCart);

/* Borra producto de carrito */
routerCarts.delete('/:cid/product/:id', deleteProduct)

/* Actualiza la cantidad de un producto del carrito */
routerCarts.put('/:cid/product/:id', updateCart)

export default routerCarts;
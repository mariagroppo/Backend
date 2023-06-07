import express from 'express';

import { getProducts,
        getProductById,
        //updateProductByIdForm,
        updateProductById,
        deleteProductById
 } from '../controllers/controllers.js';
const router = express.Router();

/* Devuelve todos los productos -------------------------------- */
router.get('/', getProducts);

/* Devuelve un producto segùn su id ----------------------------*/
router.get('/:pid', getProductById)

/* Actualiza un producto segùn su id --------------------------*/
router.put('/:id', updateProductById)

/* Borra producto segun su id */
router.delete('/:id', deleteProductById)

export default router;
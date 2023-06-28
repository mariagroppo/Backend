import express from 'express';
import auth from '../auth/auth.js';

import { getProducts,
        getProductById,
        updateProductById,
        deleteProductById
 } from '../controllers/controllers.js';
const router = express.Router();

/* Devuelve todos los productos -------------------------------- */
router.get('/', auth, getProducts);

/* Devuelve un producto segùn su id ----------------------------*/
router.get('/:pid', auth, getProductById);

/* Actualiza un producto segùn su id --------------------------*/
router.put('/:id', auth, updateProductById);

/* Borra producto segun su id */
router.delete('/:id', auth, deleteProductById);

export default router;
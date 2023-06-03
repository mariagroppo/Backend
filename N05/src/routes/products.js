import express from 'express';
import auth from '../auth/auth.js';

import { getProducts,
        getProductById,
        updateProductByIdForm,
        updateProductById,
        deleteProductById
 } from '../controllers/controllers.js';
const router = express.Router();

/* GET Vista de todos los productos -------------------------------- */
router.get('/', auth, getProducts);

/* devuelve un producto segùn su id */
router.get('/:pid', auth, getProductById)

/* Actualiza un producto segùn su id */
router.get('/update/:id', auth, updateProductByIdForm)
router.post('/update/:id', auth, updateProductById)

/* Borra producto segun su id */
router.post('/delete/:id', auth, deleteProductById)

export default router;
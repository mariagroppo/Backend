import express from 'express';

import { getProducts,
        getProductById,
        updateProductByIdForm,
        updateProductById,
        deleteProductById
 } from '../controllers/controllers.js';
const router = express.Router();

/* GET Vista de todos los productos -------------------------------- */
router.get('/', getProducts);

/* devuelve un producto segùn su id */
router.get('/:pid', getProductById)

/* Actualiza un producto segùn su id */
router.get('/update/:id', updateProductByIdForm)
router.post('/update/:id', updateProductById)

/* Borra producto segun su id */
router.post('/delete/:id', deleteProductById)

export default router;
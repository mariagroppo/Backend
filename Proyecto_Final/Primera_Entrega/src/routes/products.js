import express from 'express';

import { getProducts, 
    getProductById,
    addNewProduct,
    updateProductById,
    deleteProductById
} from '../controllers/productsControllers.js';
const router = express.Router();

/* GET Vista de todos los productos -------------------------------- */
router.get('/', getProducts);

/* devuelve un producto segùn su id */
router.get('/:id', getProductById)

/* Agrega un producto --------------------------------------------------------  */
/* router.get('/addNewProduct', addNewProductForm); */
router.post('/', addNewProduct);

/* Actualiza un producto segùn su id */
/* router.get('/update/:id', updateProductByIdForm)
router.post('/update/:id', updateProductById) */
router.put('/:id', updateProductById)

/* Borra producto segun su id */
/* router.post('/delete/:id', deleteProductById) */
router.delete('/:id', deleteProductById)

export default router;
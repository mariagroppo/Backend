import express from 'express';

import { getProducts
} from '../controllers/controllersRealTime.js';
const routerRealTime = express.Router();

/* GET Vista de todos los productos -------------------------------- */
routerRealTime.get('/', getProducts);

/* Agrega un producto --------------------------------------------------------  */
/* routerRealTime.get('/addNewProduct', addNewProductForm); */

/* Borra producto segun su id */
/* routerRealTime.post('/delete/:id', deleteProductById) */

export default routerRealTime;
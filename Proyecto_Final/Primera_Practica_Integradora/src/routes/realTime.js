import express from 'express';

import { getProducts
} from '../controllers/controllersRealTime.js';
const routerRealTime = express.Router();

/* GET Vista de todos los productos -------------------------------- */
routerRealTime.get('/', getProducts);

export default routerRealTime;
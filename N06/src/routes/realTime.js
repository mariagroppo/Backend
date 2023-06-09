import express from 'express';
import auth from '../auth/auth.js';

import { getProducts
} from '../controllers/controllersRealTime.js';
const routerRealTime = express.Router();

/* GET Vista de todos los productos -------------------------------- */
routerRealTime.get('/', auth, getProducts);

export default routerRealTime;
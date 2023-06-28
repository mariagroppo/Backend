import { restorePassword} from "../controllers/restore.js";
import express from 'express';

const routerRestore = express.Router();

routerRestore.post('/', restorePassword);

export default routerRestore;
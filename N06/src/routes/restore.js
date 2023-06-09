import { restorePassword, restorePasswordForm } from "../controllers/restore.js";
import express from 'express';

const routerRestore = express.Router();

routerRestore.get('/', restorePasswordForm);
routerRestore.post('/', restorePassword);

export default routerRestore;
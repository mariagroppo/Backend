import { loginForm, login } from "../controllers/session.js";
import express from 'express';

const routerlogin = express.Router();

routerlogin.get('/', loginForm);
routerlogin.post('/', login);

export default routerlogin;
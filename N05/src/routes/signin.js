import { signInForm, signIn } from "../controllers/session.js";
import express from 'express';

const routerSignin = express.Router();

routerSignin.get('/', signInForm);
routerSignin.post('/', signIn);

export default routerSignin;
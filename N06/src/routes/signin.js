import { signInForm, signIn, signInFailed } from "../controllers/session.js";
import express from 'express';
import passport from "passport";

const routerSignin = express.Router();

routerSignin.get('/', signInForm);
routerSignin.post('/', passport.authenticate('signin', {failureRedirect:'/api/signin/registerFail'}), signIn);
routerSignin.get('/registerFail', signInFailed);

export default routerSignin;
import { loginForm, login, loginFailed } from "../controllers/session.js";
import express from 'express';
import passport from "passport";
import { auth2 } from "../auth/auth.js";

const routerlogin = express.Router();

routerlogin.get('/', auth2, loginForm);
routerlogin.post('/', passport.authenticate('login', {failureRedirect: '/api/login/loginFailed',failureMessage: true}), login);
routerlogin.get('/loginFailed', loginFailed);

export default routerlogin;
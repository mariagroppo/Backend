import { loginForm, login, loginFailed, githubCallback } from "../controllers/session.js";
import express from 'express';
import passport from "passport";

const routerlogin = express.Router();

routerlogin.get('/', loginForm);
routerlogin.post('/', passport.authenticate('login', {failureRedirect: '/api/login/loginFailed',failureMessage: true}), login);
routerlogin.get('/loginFailed', loginFailed);
routerlogin.get('/github', passport.authenticate('github'),(req,res)=>{});
routerlogin.get('/githubcallback', passport.authenticate('github'), githubCallback)

export default routerlogin;
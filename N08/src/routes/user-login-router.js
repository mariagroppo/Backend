import userLoginControllers from '../controllers/user-login-controllers.js';
import generalControllers from '../controllers/general.js';
import passport from "passport";
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class LoginRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userLoginControllers.loginForm);
        this.post('/', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('login', {failureRedirect:'/api/login/loginFail'}), userLoginControllers.login);
        this.get('/loginFail', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userLoginControllers.loginFail);
        this.get('*', ['PUBLIC'], privacy('NO_AUTHENTICATED'), generalControllers.pageNotFound)
    }
}
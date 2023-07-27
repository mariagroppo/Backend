import userRegisterControllers from '../controllers/user-register-controller.js'
import passport from "passport";
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class RegisterRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.registerForm);
        this.post('/', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('register', {failureRedirect:'/api/register/registerFail'}), userRegisterControllers.register);
        this.get('/registerFail', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.registerFail);
        this.get('*', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.pageNotFound)
    }
}
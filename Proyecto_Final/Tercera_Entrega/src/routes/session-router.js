import userRegisterControllers from '../controllers/user-register-controller.js';
import userLoginControllers from '../controllers/user-login-controllers.js';
import otherSessionControllers from '../controllers/user-others-controllers.js';
import generalControllers from '../controllers/general.js';
import backAnswers from '../controllers/backAnswers.js';
import passport from "passport";
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class SessionRouter extends BaseRouter {
    init() {
        /* REGISTER ------------------------------------------------------------------------------------ */
        this.get('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.registerForm, backAnswers.getAnswers);
        this.post('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('register', {failureRedirect:'/api/sessions/register/registerFail'}), userRegisterControllers.register, backAnswers.getAnswers);
        this.get('/register/registerFail', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.registerFail, backAnswers.getAnswers);
        
        /* LOGIN ----------------------------------------------------------------------------------------- */
        this.get('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userLoginControllers.loginForm, backAnswers.getAnswers);
        this.post('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('login', {failureRedirect:'/api/sessions/login/loginFail'}), userLoginControllers.login, backAnswers.getAnswers);
        this.get('/login/loginFail', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userLoginControllers.loginFail);
        
        /* OTHERS ------------------------------------------------------------------------------------------ */
        this.get('/logout', ['USER'], privacy('PRIVATE'), otherSessionControllers.logout, backAnswers.getAnswers);
        this.get('/current', ['USER'], privacy('PRIVATE'), otherSessionControllers.current, backAnswers.getAnswers)
        this.get('/current/changePwd', ['USER'], privacy('PRIVATE'), otherSessionControllers.changePwdForm, backAnswers.getAnswers)
        this.post('/current/changePwd', ['USER'], privacy('PRIVATE'), otherSessionControllers.changePwd, backAnswers.getAnswers)
        this.get('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), otherSessionControllers.restorePwdForm, backAnswers.getAnswers)
        
        //this.post('/restore', ['PUBLIC'], privacy('NO_AUTHENTICATED'), otherSessionControllers.restorePassword);
        this.get('*', ['PUBLIC'], privacy('NO_AUTHENTICATED'), generalControllers.pageNotFound)
    }
}
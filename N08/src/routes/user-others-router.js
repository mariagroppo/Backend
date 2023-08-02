import otherSessionControllers from '../controllers/user-others-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class OthersSessionRouter extends BaseRouter {
    init() {
        this.get('/logout', ['USER'], privacy('PRIVATE'), otherSessionControllers.logout);
        this.post('/restore', ['PUBLIC'], privacy('NO_AUTHENTICATED'), otherSessionControllers.restorePassword);
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound);
    }
}
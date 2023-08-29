import cartsControllers from '../controllers/carts-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';
import backAnswers from '../controllers/backAnswers.js';

export default class CartsRouter extends BaseRouter {
    init() {
        this.get('/', ['USER'], privacy('PRIVATE'), cartsControllers.getCarts, backAnswers.getAnswers);
        this.post('/', ['USER'], privacy('PRIVATE'), cartsControllers.addNewCart, backAnswers.getAnswers);
        this.get('/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.getCartById, backAnswers.getAnswers)
        this.delete('/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.deleteCartById, backAnswers.getAnswers)
        this.post('/:cid/product/:pid', ['USER'], privacy('PRIVATE'), cartsControllers.addProductInCart, backAnswers.getAnswers);
        
        //ERROR this.delete('/:cid/product/:id', ['PUBLIC'], cartsControllers.deleteProduct, backAnswers.getAnswers)
        //ERROR   this.put('/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.updateCart, backAnswers.getAnswers)
        
        this.post('/closeCart/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.closeCart, backAnswers.getAnswers)
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound)
    }
}
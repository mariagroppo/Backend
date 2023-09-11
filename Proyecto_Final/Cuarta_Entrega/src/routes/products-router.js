import productControllers from '../controllers/product-controllers.js';
import generalControllers from '../controllers/general.js';
import backAnswer from '../controllers/backAnswers.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class ProductsRouter extends BaseRouter {
    init() {
        this.get('/', ['USER'], privacy('PRIVATE'), productControllers.getProducts, backAnswer.getAnswers);
        this.get('/mine', ['PREMIUM'], privacy('PRIVATE'), productControllers.getProducts, backAnswer.getAnswers);
        this.get('/add', ['PREMIUM'], privacy('PRIVATE'), productControllers.addProductForm, backAnswer.getAnswers);
        this.post('/add', ['PREMIUM'], privacy('PRIVATE'), productControllers.addProduct, backAnswer.getAnswers);
        this.get('/:pid', ['USER'], privacy('PRIVATE'), productControllers.getProductById, backAnswer.getAnswers);
        this.put('/update/:pid', ['PREMIUM'], privacy('PRIVATE'), productControllers.updateProductById, backAnswer.getAnswers);
        this.delete('/delete/:pid', ['PREMIUM'], privacy('PRIVATE'), productControllers.deleteProductById, backAnswer.getAnswers);
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound);
    }
}


/* Actualiza un producto segùn su id --------------------------*/
//router.put('/:id', auth, updateProductById);

/* Borra producto segun su id */
//router.delete('/:id', auth, deleteProductById);

import productControllers from '../controllers/product-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class ProductsRouter extends BaseRouter {
    init() {
        this.get('/', ['USER'], privacy('PRIVATE'), productControllers.getProducts);
        this.get('/add', ['USER'], privacy('PRIVATE'), productControllers.addProductForm);
        this.post('/add', ['USER'], privacy('PRIVATE'), productControllers.addProduct);
        this.get('/:pid', ['USER'], privacy('PRIVATE'), productControllers.getProductById)

        /* 
        this.get('/products/update/:pid', ['USER'], privacy('PRIVATE'), productControllers.updateProductByIdForm)
        this.post('/products/update/:pid', ['USER'], privacy('PRIVATE'), productControllers.updateProductById)
        this.post('/products/delete/:pid', ['USER'], privacy('PRIVATE'), productControllers.deleteProductById) */
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound)
    }
}
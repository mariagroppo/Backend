
import { productService } from '../services/repository.js';
import { validateLimit, validatePage } from '../../utils.js';

const getProducts = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    let enabled = true;
    if ((req.url === '/products') || (req.url === '/')) {
        enabled = false;
    }
    if (userName === 'admin') {
        enabled = true;
    }
    try {
        let { limit, page, sort, category } = req.query;
        let validPage = await validatePage(page); //devuelve 1 si no está definida o mal definida.
        let validLimit = await validateLimit(limit); //devuelve 10 si está mal definido o el valor inicial si esta OK.
        if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
            sort=1; 
        }
        let listado = await productService.getAll(validLimit,validPage,sort,category,userId,enabled);
        let hasPrevPage = listado.value.hasPrevPage;
        let hasNextPage = listado.value.hasNextPage;
        let prevPage = listado.value.prevPage;
        let nextPage = listado.value.nextPage;
        if (listado.value.docs.length>0){
            req.info = {
                status: 'success',
                message: "Products list ok",
                prods: listado.value.docs,
                productsExists: true,
                realTime: false,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                validPage,
                validLimit,
                sort,
                category,
                enabled
            };
            next();
        } else {
            req.info = {
                status: 'success',
                message: "No products available.",
                prods: [],
                productsExists: false,
                realTime: false,
                enabled
            };
            next();
        }
        
    } catch (error) {
        req.info = {
            status: 'error',
            message: "getProducts Controller error: " + error
        };
        next();
    }
}

const addProductForm = async (req, res, next) => {
    try {
        req.info = {
            status: 'success',
            message: "Please, complete the following information about your new product: name, description, code, url, price, stock category."
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "BACK addProductForm Controller error: " + error
        };
        next();
    }
}

const addProduct = async (req, res, next) => {
    let userId = req.session.user.id;
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields= await productService.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnail, price, stock, category, userId};
            const newProd = await productService.save(prod);
            //res.sendSuccessMessage(newProd.message);
            req.info = {
                status: newProd.status,
                message: newProd.message
            };
        } else {
            req.info = {
                status: 'error',
                message: validateFields.message
            };
            //res.sendError(validateFields.message)    
        }
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "BACK addProduct Controller error: " + error
        };
        next();
        //res.sendError("addProduct controller error");
    }
}

const getProductById = async (req, res, next) => {
    try {
        let product = await productService.getById(req.params.pid);
        req.info = {
            status: product.status,
            message: product.message,
            value: product.value
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "BACK getProductById Controller error: " + error,
            value: prod
        };
        next();
    }
}

const updateProductById = async (req, res, next) => {
    let userId = req.session.user.id;
    try {
        const {title, description, thumbnail, price, stock, category} = req.body;
        let id = req.params.pid;
        const newProd = {
            id: parseInt(id),
            title: title,
            description: description,
            thumbnail: thumbnail,
            price: price,
            stock: stock,
            category: category
        }
        if (isNaN(id)){
            req.info = {
                status: 'error',
                message: "The ID must be a number.",
            };
            next();       
        } else {
            const answer = await productService.updateById(newProd,userId);
            req.info = {
                status: answer.status,
                message: answer.message
            };
            next(); 
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "updateProductById Controller error: " + error,
        };
        next();        
    }
}

const deleteProductById = async(req,res,next)=> {
    let userId = req.session.user.id;
    try {
        let id = parseInt(req.params.pid);
        if (!isNaN(id)) {
            let answer = await productService.deleteById(id,userId);
            req.info = {
                status: answer.status,
                message: answer.message,
            };
            next(); 
        } else {
            req.info = {
                status: 'error',
                message: "The ID must be a number.",
            };
            next(); 
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "deleteProductById Controller error: " + error,
        };
        next(); 
    }
}



export default {
    getProducts,
    getProductById,
    addProductForm,
    addProduct,
    updateProductById,
    deleteProductById
}
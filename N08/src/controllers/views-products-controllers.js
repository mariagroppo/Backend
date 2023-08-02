import { productService } from '../services/repository.js';
import { validateLimit, validatePage } from '../../utils.js';

const viewProducts = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let { limit, page, sort, category } = req.query;
        let validPage = await validatePage(page); 
        let validLimit = await validateLimit(limit);
        if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
            sort=1;
        }
        let listado = await productService.getAll(validLimit,validPage,sort,category);
        let hasPrevPage = listado.value.hasPrevPage;
        let hasNextPage = listado.value.hasNextPage;
        let prevPage = listado.value.prevPage;
        let nextPage = listado.value.nextPage;
        if ((listado.value.docs.length>0)) {
            req.logger.log("info",`Main page render, with products.`);
            res.render('../src/views/main.hbs', {prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName })
        } else {
            req.logger.log("info",`Main page render, without products.`);
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName })
        }
    
    } catch (error) {
        req.logger.log("error","getProducts controller error: " + error)
        res.render('../src/views/partials/error.hbs', { message:"getProducts controller error: " + error, userStatus: true, userName});
    }
}

const productById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let product = await productService.getById(req.params.pid);
        if (product.value) {
            req.logger.log("info", product.message);
            res.render('../src/views/partials/prod-id.hbs', { prod: product.value, productsExists: true, userStatus: true, userName })
        } else {
            req.logger.log("warning", product.message);
            res.render('../src/views/partials/error.hbs', { message: product.message, productsExists: false, userStatus: true, userName })
        }
    } catch (error) {
        req.logger.log("error","getProductById controller error: " + error)
        res.render('../src/views/partials/error.hbs', { message: "getProductById Controller error: " + error, userStatus: true, userName})
    }
}

const addProductForm = async (req, res) => {
    let userName = req.session.user.name;
    try {
        req.logger.log("http",`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
        res.render('../src/views/partials/prod-addNew.hbs', { userStatus: true, userName})
    } catch (error) {
        req.logger.log("error","addProductForm controller error: " + error)
        res.render('../src/views/partials/error.hbs', { message: "addProductForm controller error", userStatus: true, userName});
    }
}

const addProduct = async (req, res) => {
    let userName = req.session.user.name;
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields= await productService.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnail, price, stock, category};
            const newProd = await productService.save(prod);
            req.logger.log("info", newProd.message);
            res.render('../src/views/partials/error.hbs', { message: newProd.message, userStatus: true, userName })
        } else {
            req.logger.log("warning", validateFields.message);
            res.render('../src/views/partials/error.hbs', { message: validateFields.message, userStatus: true, userName})    
        }
        req.body.reset;
    } catch (error) {
        req.logger.log("error","addProduct controller error: " + error)
        res.render('../src/views/partials/error.hbs', { message: "addProduct controller error", userStatus: true, userName});
    }
}

const updateProductByIdForm = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let id = req.params.pid;
        let prod = await productService.getById(id);
        if (!prod) {
            req.logger.log("warning", prod.message);
            res.render('../src/views/partials/error.hbs', { message: prod.message, userStatus: true, userName})
        } else {
            req.logger.log("info", prod.value);
            res.render('../src/views/partials/prod-update.hbs', { prod: prod.value, userStatus: true, userName })
        }
    } catch (error) {
        req.logger.log("error","updateProductByIdForm controller error: " + error)
        res.render('../src/views/partials/error.hbs', { message: "updateProductByIdForm Controller error: " + error, userStatus: true, userName})
    }
 }

const updateProductById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let id = req.params.pid;
        const newProd = {
            id: parseInt(id),
            title: title,
            description: description,
            code: code,
            thumbnail: thumbnail,
            price: price,
            stock: stock,
            category: category
        }
        if (isNaN(id)){
            req.logger.log("warning", "The ID must be a number.");
            res.render('../src/views/partials/error.hbs', { message: "The ID must be a number.", userStatus: true, userName})        
        } else {
            await productService.updateById(newProd)
            req.logger.log("info", `Product ${newProd.id} updated.`);
            res.render('../src/views/partials/error.hbs', { message: `Product ${newProd.id} updated.`, userStatus: true, userName})
        }
        
    } catch (error) {
        req.logger.log("error","updateProductById controller error: " + error)
        res.render('../src/views/partials/error.hbs', {message: "updateProductById Controller error: " + error, userStatus: true, userName})        
    }
}

const deleteProductById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let id = parseInt(req.params.pid);
        let deleteProduct = await productService.deleteById(id);
        req.logger.log("info", deleteProduct.message);
        res.render('../src/views/partials/error.hbs', { message: deleteProduct.message, userStatus: true, userName})
    } catch (error) {
        req.logger.log("error","deleteProductById controller error: " + error)
        res.render('../src/views/partials/error.hbs', { message: "deleteProductById Controller error: " + error, userStatus: true, userName}) 
    }
}

const faker = async (req, res) => {
    let userName = req.session.user.name;
    try{
        let listado = await productService.fakerProducts();
        let hasPrevPage = true;
        let hasNextPage = true;
        let prevPage = true;
        let nextPage = true;
        let validPage=1;
        let validLimit=100;
        let sort = 1;
        let category=true;
        if ((listado.status === 'success')) {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName })
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName })
        }
        /* let limit = 1;
        let page = 10;
        let sort = 1;
        let listado = await prodsMongo.fakerProducts(limit,page,sort);
        console.log(listado)
        let hasPrevPage = listado.value.hasPrevPage;
        let hasNextPage = listado.value.hasNextPage;
        let prevPage = listado.value.prevPage;
        let nextPage = listado.value.nextPage;
        if ((listado.value.docs.length>0) && (req.session?.user)) {
            res.render('../src/views/main.hbs', {prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName })
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName })
        } */


    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "faker Controller error: " + error, userStatus: true, userName}) 

    }
}

export default {
    viewProducts,
    addProductForm,
    addProduct,
    productById,
    updateProductByIdForm,
    updateProductById,
    deleteProductById,
    faker
}
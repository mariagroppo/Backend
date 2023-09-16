import { productService } from '../services/repository.js';
import { validateLimit, validatePage } from '../../utils.js';
import { mailDeleteProduct } from '../mail/nodemailer.js';

const viewProducts = async (req, res) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    let enabled = true;
    if ((req.url === '/products') || (req.url === '/') || (req.url === '/products/mine')) {
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
            res.render('../src/views/main.hbs', {prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName, enabled })            
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName, enabled})

        }
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProducts controller error: " + error, userStatus: true, userName: ""})
    }
}

const productById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let product = await productService.getById(req.params.pid);
        if (product.value) {
            res.render('../src/views/partials/prod-id.hbs', { prod: product.value, productsExists: true, userStatus: true, userName })
        } else {
            res.render('../src/views/partials/error.hbs', { message: product.message, productsExists: false, userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProductById Controller error: " + error, userStatus: true, userName})
    }
}

const addProductForm = async (req, res) => {
    let userName = req.session.user.name;
    try {
        res.render('../src/views/partials/prod-addNew.hbs', { userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "viewAddProductForm controller error: " + error, userStatus: true, userName})
    }
}

const addProduct = async (req, res) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields= await productService.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnail, price, stock, category, userId};
            const newProd = await productService.save(prod);
            res.render('../src/views/partials/error.hbs', { message: newProd.message, userStatus: true, userName })

        } else {
            res.render('../src/views/partials/error.hbs', { message: validateFields.message, userStatus: true, userName})    
        }
        req.body.reset;
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "viewAddProduct controller error: " + error, userStatus: true, userName})   
    }
}

const updateProductByIdForm = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let id = req.params.pid;
        let prod = await productService.getById(id);
        if (!prod) {
            res.render('../src/views/partials/error.hbs', { message: prod.message, userStatus: true, userName})
        } else {
            res.render('../src/views/partials/prod-update.hbs', { prod: prod.value, userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateProductByIdForm Controller error: " + error, userStatus: true, userName})
    }
 }

const updateProductById = async (req, res) => {
    let userName = req.session.user.name;
    let userId = req.session.passport.user;
    let message;
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
            message = "The ID must be a number.";        
        } else {
            const answer = await productService.updateById(newProd,userId);
            message = `Product ${newProd.id} updated.`;
        }
        res.render('../src/views/partials/error.hbs', { message: message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {message: "updateProductById Controller error: " + error, userStatus: true, userName})        
    }
}

const deleteProductById = async (req, res) => {
    let userId = req.session.user.id;
    let user = req.session.user;
    let userName = req.session.user.name;
    try {
        let id = parseInt(req.params.pid);
        if (!isNaN(id)) {
            let product = await productService.getById(id);
            let answer = await productService.deleteById(id,userId);
            //console.log("Respuesta de deleteById: " + answer)
            if (answer.status === 'success') {
                await mailDeleteProduct(user, product.value)
            }
            res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})
        } else {
            res.render('../src/views/partials/error.hbs', {message: "The ID must be a number.", userStatus: true, userName})        
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {message: "deleteProductById Controller error: " + error, userStatus: true, userName})        
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
        let enabled = false;
        if ((listado.status === 'success')) {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName, enabled })
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName, enabled })
        }
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
import { productService } from '../services/repository.js';

const viewProducts = async (req, res) => {
   //let userName = req.session.user.name;
   let userName="mey";
   const {info } = req;
   const { prods, status, message, hasNextPage, hasPrevPage, prevPage, nextPage, validPage, validLimit, sort, category, enabled } = info;
   try {
        if (status === 'success') {
            if ((prods.length>0)) {
                res.render('../src/views/main.hbs', {
                    prods, 
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
                    userStatus: true,
                    userName,
                    enabled })

            } else {
                res.render('../src/views/main.hbs', {
                    prods,
                    productsExists: false,
                    realTime: false,
                    userStatus: true,
                    userName,
                    enabled })
            }
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message,
                userStatus: true,
                userName});
        }
    
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message:"VIEWS viewProducts controller error: " + error,
            userStatus: true,
            userName});
    }
}

const productById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        if (req.info.value) {
            res.render('../src/views/partials/prod-id.hbs', { 
                prod: req.info.value,
                productsExists: true,
                userStatus: true,
                userName
            })
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message: req.info.message,
                productsExists: false,
                userStatus: true,
                userName
            })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "getProductById Controller error: " + error,
            userStatus: true,
            userName
        })
    }
}

const addProductForm = async (req, res) => {
    let userName = req.session.user.name;
    try {
        res.status(200).render('../src/views/partials/prod-addNew.hbs', { userStatus: true, userName})
    } catch (error) {
        res.status(500).render('../src/views/partials/error.hbs', { message: "VIEWS addProductForm controller error", userStatus: true, userName});
    }
}

const addProduct = async (req, res) => {
    let userName = req.session.user.name;
    try {
        res.render('../src/views/partials/error.hbs', { 
            message: req.info.message,
            userStatus: true,
            userName })
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "BACK addProduct controller error: " + error,
            userStatus: true,
            userName })
    }
}

const updateProductByIdForm = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let id = req.params.pid;
        let prod = await productService.getById(id);
        if (!prod) {
            res.render('../src/views/partials/error.hbs', { 
                message: prod.message,
                userStatus: true,
                userName})
        } else {
            res.render('../src/views/partials/prod-update.hbs', { 
                prod: prod.value,
                userStatus: true,
                userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "updateProductByIdForm Controller error: " + error,
            userStatus: true,
            userName})
    }
 }

const updateProductById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        res.render('../src/views/partials/error.hbs', { 
            message: req.info.message,
            userStatus: true,
            userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {
            message: "updateProductById Controller error: " + error,
            userStatus: true,
            userName
        })        
    }
}

const deleteProductById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        res.render('../src/views/partials/error.hbs', { 
            message: req.info.message,
            userStatus: true,
            userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "deleteProductById Controller error: " + error,
            userStatus: true,
            userName}) 
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
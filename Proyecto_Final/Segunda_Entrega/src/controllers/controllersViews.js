import { prodsMongo } from "./controllers.js";
import { cartsMongo } from "./controllersCarts.js";

import { validateLimit, validatePage } from '../../utils.js';

export const viewProducts = async (req, res) => {
    try {
        let { limit, page, sort, category } = req.query;
        let validPage = await validatePage(page); 
        let validLimit = await validateLimit(limit);
        if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
            sort=1;
        }
        let listado = await prodsMongo.getAll(validLimit,validPage,sort,category);
        let hasPrevPage = listado.value.hasPrevPage;
        let hasNextPage = listado.value.hasNextPage;
        let prevPage = listado.value.prevPage;
        let nextPage = listado.value.nextPage;
        if (listado.value.docs.length>0){
            res.render('../src/views/main.hbs', {prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category })
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false })
        }
        
    } catch (error) {
        res.send({status:'error', message: "getProducts Controller error: " + error})
    }
}

export const viewAddProductForm = async (req, res) => {
    try {
        res.render('../src/views/partials/newProduct.hbs')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "viewAddProductForm controller error: " + error })
    }
}

export const viewAddProduct = async (req, res) => {
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields= await prodsMongo.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnail, price, stock, category};
            const newProd = await prodsMongo.save(prod);
            res.render('../src/views/partials/error.hbs', { message: newProd.message })

        } else {
            res.render('../src/views/partials/error.hbs', { message: validateFields.message})    
        }
        req.body.reset;
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "viewAddProduct controller error: " + error })   
    }
}

export const viewProductById = async (req, res) => {
    try {
        let product = await prodsMongo.getById(req.params.pid);
        if (product.value) {
            res.render('../src/views/partials/lookForId.hbs', { prod: product.value, productsExists: true })
        } else {
            res.render('../src/views/partials/error.hbs', { message: product.message, productsExists: false })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProductById Controller error: " + error})
    }
}

export const viewUpdateProductByIdForm = async (req, res) => {
    try {
        let id = req.params.pid;
        let prod = await prodsMongo.getById(id);
        if (!prod) {
            res.render('../src/views/partials/error.hbs', { message: prod.message})
        } else {
            res.render('../src/views/partials/updateProduct.hbs', { prod: prod.value })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateProductByIdForm Controller error: " + error})
    }
 }

export const viewUpdateProductById = async (req, res) => {
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
            res.render('../src/views/partials/error.hbs', { message: "The ID must be a number."})        
        } else {
            await prodsMongo.updateById(newProd)
            res.render('../src/views/partials/error.hbs', { message: `Product ${newProd.id} updated.`})
        }
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {message: "updateProductById Controller error: " + error})        
    }
}

export const viewDeleteProductById = async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        let deleteProduct = await prodsMongo.deleteById(id);
        res.render('../src/views/partials/error.hbs', { message: deleteProduct.message})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteProductById Controller error: " + error}) 
    }
}

export const viewCarts = async (req, res) => {
    try {
        let listado = await cartsMongo.getAll();   
        if (listado.value.length>0) {
            res.render('../src/views/partials/cartsList.hbs', { carts: listado.value, cartsExists: true })

        } else {
            res.render('../src/views/partials/error.hbs', { message: "No carts to list." })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getCarts controller error: " + error})
    }
}

export const viewsAddNewCart = async (req, res) => {
    try {
        let cart = await cartsMongo.save();
        res.render('../src/views/partials/error.hbs', { message: cart.message})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addNewCart controller error: " + error })
    }
}

export const viewCartById = async (req, res) => {
    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.render('../src/views/partials/error.hbs', { message: "The ID must be an integer."})
        } else {
            let cart = await cartsMongo.getById(cid);        
            if (cart.status === 'success') {
                res.render('../src/views/partials/cartContainer.hbs', { cart: cart.value, pExist: cart.pExist})
            } else {
                res.render('../src/views/partials/error.hbs', { message: cart.message})
            }
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getCartById controller error: " + error})
    }
}

export const viewDeleteCartById = async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid);
        let answer;
        if (!isNaN(idCart)) {
            answer = await cartsMongo.deleteById(idCart);
            res.render('../src/views/partials/error.hbs', {message: answer.message})
        } else {
            res.render('../src/views/partials/error.hbs', {message: "The ID must be a number."})
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteCartById controller error: " + error})
    }
}

export const viewAddProductInCart = async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        let qty = parseInt(req.body.productQtyInput);
        let carts = await cartsMongo.getAll();
        let cid;
        if (carts.value) {
            if (carts.value[carts.value.length-1].cartStatus === true) {
                cid = carts.value[carts.value.length-1].idCart;
            } else {
                res.render('../src/views/partials/error.hbs', {message: "No cart opened."})
            }    
        } else {
            res.render('../src/views/partials/error.hbs', {message: "No cart opened."})
        }
        let answer = await cartsMongo.addProductInCart(cid, id, qty);
        res.render('../src/views/partials/error.hbs', { message: answer.message})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addProductInCart controller error: " + error})
    }
}

export const viewDeleteProduct = async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        let answer = await cartsMongo.deleteProduct(cid, id);
        res.render('../src/views/partials/error.hbs', { message: answer.message})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {message: "deleteProduct controller error: " + error}) 
    }
}

export const viewUpdateCart = async (req, res) => {
    try {
        let cid = parseInt(req.params.cid);
        let newData = req.body;
        let answer = await cartsMongo.updateCartGlobal(cid, newData);
        res.render('../src/views/partials/error.hbs', {message: answer.message})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateCart controller error: " + error})
    }
}
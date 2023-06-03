import ProductManager from '../dao/fs/productManager.js';
const productsList = new ProductManager("./src/data/productos.txt")

import ProductMongoDB from "../dao/mongodb/prodsMongoDB.js";
export const prodsMongo = new ProductMongoDB();

import db from '../dao/database.js';
import { validateLimit, validatePage } from '../../utils.js';

export const getProducts = async (req, res) => {
    let userName = "";
    let userStatus=false;
    if(req.session.user){
        userName = req.session.user.name;
        userStatus = true;
    }
    try {
        let { limit, page, sort, category } = req.query;
        let validPage=await validatePage(page); //devuelve 1 si no está definida o mal definida.
        let validLimit = await validateLimit(limit); //devuelve 10 si está mal definido o el valor inicial si esta OK.
        if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
            sort=1; // de menor a mayor
        }
        
        if (db === 'fs') {
            //listado = await productsList.getProducts();
            res.render('../src/views/partials/error.hbs', { message: "No es posible trabajar con fs.", userName, userStatus})
        } else {
            let listado = await prodsMongo.getAll(validLimit,validPage,sort,category);
            let hasPrevPage = listado.value.hasPrevPage;
            let hasNextPage = listado.value.hasNextPage;
            let prevPage = listado.value.prevPage;
            let nextPage = listado.value.nextPage;
            //console.log(listado.value.docs.length)
            if (listado.value.docs.length>0){
                //console.log("page: " + page);
                res.render('../src/views/main.hbs', { prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userName, userStatus})
            } else {
                res.render('../src/views/main.hbs', { prods: listado.value, productsExists: false, realTime: false, userName, userStatus })
            }
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProducts Controller error: " + error, userName, userStatus})
    }
}

export const getProductById = async (req, res) => {
    try {
        let userName = "";
        let userStatus=false;
        if(req.session){
            userName = req.session.user.name;
            userStatus = true;
        }
        let product;
        if (db === 'fs') {
            product = await productsList.getProductById(req.params.pid);
        }else {
            product = await prodsMongo.getById(req.params.pid);
        }
        if (!product) {
            /* console.log(`El producto con id ${req.params.pid} no existe.`); */
            res.render('../src/views/partials/error.hbs', { message: product.message, userName, userStatus})
        } else {
            res.render('../src/views/partials/lookForId.hbs', { prod: product.value, productsExists: true, userName, userStatus })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProductById Controller error: " + error, userName, userStatus})
    }
}

export const updateProductByIdForm = async (req, res) => {
    try {
        let userName = "";
        let userStatus=false;
        if(req.session){
            userName = req.session.user.name;
            userStatus = true;
        }
        let id = req.params.id;
        if (isNaN(id)){
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número.", userName, userStatus})    
        } else {
            let prod;
            if (db === 'fs') {
                prod = await productsList.getProductById(id);
            } else {
                prod = await prodsMongo.getById(id);
            }
            if (!prod) {
                res.render('../src/views/partials/error.hbs', { message: "Producto no encontrado.", userName, userStatus})
            } else {
                res.render('../src/views/partials/updateProduct.hbs', { prod: prod.value, userName, userStatus })
            }
        }

    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateProductByIdForm Controller error: " + error, userName, userStatus})
    }
 }

export const updateProductById = async (req, res) => {
    try {
        let userName = "";
        let userStatus=false;
        if(req.session){
            userName = req.session.user.name;
            userStatus = true;
        }
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let id = req.params.id;
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
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número.", userName, userStatus})        
        } else {
            if (db==='fs') {
                await productsList.updateProductById(id, newProd);
            } else {
                await prodsMongo.updateById(newProd)
            }
            res.redirect('/api/products');
            /* res.send("Producto " + newProd.id + " actualizado. ") */
        }
        
    } catch (error) {
        /* console.log("Error en updateProductById: " + error); */
        res.render('../src/views/partials/error.hbs', { message: "updateProductById Controller error: " + error, userName, userStatus})        
    }
}

export const deleteProductById = async(req,res)=> {
    try {
        let userName = "";
        let userStatus=false;
        if(req.session){
            userName = req.session.user.name;
            userStatus = true;
        }
        let id = parseInt(req.params.id);
        if (!isNaN(id)) {
            if (db==='fs') {
                await productsList.deleteById(id);
            } else {
                await prodsMongo.deleteById(id);
            }
            res.redirect('/api/products');
        } else {
            /* res.status(400).send({ error: 'El parámetro no es un número.'})  */
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número.", userName, userStatus})
        }
    } catch (error) {
        /* console.log("Error en deleProductById: " + error) */
        res.render('../src/views/partials/error.hbs', { message: "deleteProductById Controller error: " + error, userName, userStatus})
    }
}


/* export const aggregateByCategory = async(req,res)=> {
    try {
        let category = "Categoria 1";
        let sort=1;
        //let limit=undefined;
        let answer = await prodsMongo.aggregateByCategory(category,sort)
        //console.log(answer);
        res.render('../src/views/main.hbs', { prods: answer, productsExists: true, realTime: false })
    } catch (error) {
        console.log(error)
    }
} */
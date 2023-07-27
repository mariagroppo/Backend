import ProductManager from '../dao/fs/productManager.js';
const productsList = new ProductManager("./src/data/productos.txt")

import ProductMongoDB from "../dao/mongodb/managers/prodsMongoDB.js";
export const prodsMongo = new ProductMongoDB();

import db from '../dao/database.js';
import { validateLimit, validatePage } from '../../utils.js';

export const getProducts = async (req, res) => {
    try {
        let { limit, page, sort, category } = req.query;
        let validPage=await validatePage(page); //devuelve 1 si no está definida o mal definida.
        let validLimit = await validateLimit(limit); //devuelve 10 si está mal definido o el valor inicial si esta OK.
        if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
            sort=1; // de menor a mayor
        }
        
        if (db === 'fs') {
            res.send({status: "error", message: "fs is no longer available."})
        } else {
            let listado = await prodsMongo.getAll(validLimit,validPage,sort,category);
            let hasPrevPage = listado.value.hasPrevPage;
            let hasNextPage = listado.value.hasNextPage;
            let prevPage = listado.value.prevPage;
            let nextPage = listado.value.nextPage;
            if (listado.value.docs.length>0){
                res.send({status: 'success', message: "Products list ok", prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category })
            } else {
                res.send({status: 'success', message: "No products added.", prods: listado.value, productsExists: false, realTime: false })
            }
        }
    } catch (error) {
        res.send({status:'error', message: "getProducts Controller error: " + error})
    }
}

export const getProductById = async (req, res) => {
    try {
        let product;
        if (db === 'fs') {
            res.send({status: "error", message: "fs is no longer available."});
        }else {
            product = await prodsMongo.getById(req.params.pid);
            res.send({ status: product.status, message: product.message, prod: product.value })
        }
    } catch (error) {
        res.send({status:'error', message: "getProductById Controller error: " + error})
    }
}

export const updateProductById = async (req, res) => {
    try {
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
            res.send({status: 'error', message: "The ID must be a number."})        
        } else {
            if (db==='fs') {
                res.send({status: "error", message: "fs is no longer available."})
            } else {
                await prodsMongo.updateById(newProd)
                res.send({status:"success", message: `Product ${newProd.id} updated.`})
            }
        }
        
    } catch (error) {
        res.send({status:'error', message: "updateProductById Controller error: " + error})        
    }
}

export const deleteProductById = async(req,res)=> {
    try {
        let id = parseInt(req.params.id);
        let deleteProduct;
        if (!isNaN(id)) {
            if (db==='fs') {
                res.send({status: "error", message: "fs is no longer available."})
            } else {
                deleteProduct = await prodsMongo.deleteById(id);
                res.send({status: deleteProduct.status, message: deleteProduct.message})
            }
        } else {
            res.status(400).send({ status: 'error', message: 'El parámetro no es un número.'}) 
        }
    } catch (error) {
        res.status(400).send({ status: 'error', message: "deleteProductById Controller error: " + error}) 
    }
}

import ProductManager from '../classes/fs/productManager.js';
const productsList = new ProductManager("./src/data/productos.txt")

import ProductMongoDB from "../classes/mongodb/prodsMongoDB.js";
export const prodsMongo = new ProductMongoDB();

import db from '../classes/database.js';

export const getProducts = async (req, res) => {
    try {
        let { limit } = req.query;
        let listado;
        if (db === 'fs') {
            listado = await productsList.getProducts();
        } else {
            listado = await prodsMongo.getAll();
        }
        if (!limit) {
            if (listado.value.length>0){
                /* res.send(listado.value); */
                res.render('../src/views/main.hbs', { prods: listado.value, productsExists: true, realTime: false })
            } else {
                /* res.status(400).send("No hay productos."); */
                res.render('../src/views/main.hbs', { prods: listado.value, productsExists: false, realTime: false })
            }
        } else {
            if (isNaN(parseInt(limit)) || parseInt(limit)<0 ) {
                /* res.status(400).send("El limite debe ser un numero entero positivo."); */
                res.render('../src/views/partials/error.hbs', { message: "El limite debe ser un numero entero positivo."})
            } else {
                let newArray = [];
                if (parseInt(limit) < listado.value.length) {
                    for (let i=0; i<parseInt(limit); i++) {
                        newArray.push(listado.value[i]);
                    }
                } else {
                    newArray = listado.value;
                }
                /* res.send(newArray); */
                res.render('../src/views/main.hbs', { prods: newArray, productsExists: true, realTime: false })
            }
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProducts Controller error: " + error})
    }
}

export const getProductById = async (req, res) => {
    try {
        let product;
        if (db === 'fs') {
            product = await productsList.getProductById(req.params.pid);
        }else {
            product = await prodsMongo.getById(req.params.pid);
        }
        if (!product) {
            /* console.log(`El producto con id ${req.params.pid} no existe.`); */
            res.render('../src/views/partials/error.hbs', { message: product.message})
        } else {
            res.render('../src/views/partials/lookForId.hbs', { prod: product.value, productsExists: true })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProductById Controller error: " + error})
    }
}

export const updateProductByIdForm = async (req, res) => {
    try {
        let id = req.params.id;
        if (isNaN(id)){
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número."})    
        } else {
            let prod;
            if (db === 'fs') {
                prod = await productsList.getProductById(id);
            } else {
                prod = await prodsMongo.getById(id);
            }
            if (!prod) {
                res.render('../src/views/partials/error.hbs', { message: "Producto no encontrado."})
            } else {
                res.render('../src/views/partials/updateProduct.hbs', { prod: prod.value })
            }
        }

    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateProductByIdForm Controller error: " + error})
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
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número."})        
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
        res.render('../src/views/partials/error.hbs', { message: "updateProductById Controller error: " + error})        
    }
}

export const deleteProductById = async(req,res)=> {
    try {
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
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número."})
        }
    } catch (error) {
        /* console.log("Error en deleProductById: " + error) */
        res.render('../src/views/partials/error.hbs', { message: "deleteProductById Controller error: " + error})
    }
}

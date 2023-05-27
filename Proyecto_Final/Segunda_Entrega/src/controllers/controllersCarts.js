/* CLASSES ---------------------------------------------------------------------------- */
import CartsFile from '../dao/fs/cartsManager.js';
const cartList = new CartsFile('../Primera_Practica_Integradora/src/data/listCarts.txt')

import CartsMongoDB from "../dao/mongodb/cartsMongoDB.js";
export const cartsMongo = new CartsMongoDB();

import db from '../dao/database.js';

export const getCarts = async (req, res) => {
    try {
        let listado;
        if (db==='fs') {
            listado = await cartList.getAllCarts(); 
        } else {
            listado = await cartsMongo.getAll();   
        }
        if (listado.value.length>0) {
            res.render('../src/views/partials/cartsList.hbs', { carts: listado.value, cartsExists: true});
            /* res.send(listado); */
        } else {
            /* res.send("No hay carritos.") */
            res.render('../src/views/partials/cartsList.hbs', { carts: null, cartsExists: false})
        }
    } catch (error) {
        /* console.log("ERROR getCarts: " + error); */
        res.render('../src/views/partials/error.hbs', { message: "getCarts controller error: " + error})
    }
}

export const addNewCart = async (req, res) => {
    try {
        if (db==='fs') {
            await cartList.createCart(); 
        } else {
            await cartsMongo.save()    
        }
        res.redirect('/api/carts');
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addNewCart controller error: " + error})
    }
}

export const getCartById = async (req,res) => {
    try {
        let cid = req.params.cid;
        //console.log(req.params.cid)
        if (isNaN(cid)){
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número."})   
        } else {
            let cart;
            if (db==='fs') {
                cart = await cartList.getCartById(cid);
            } else {
                cart = await cartsMongo.getById(cid);        
            }
            if (!cart.value) {
                res.render('../src/views/partials/error.hbs', { message: cart.message})
            } else {
                /* res.send(cart.value); */
                res.render('../src/views/partials/cartContainer.hbs', { cart: cart.value, pExist: cart.pExist})
            }
        }
    } catch (error) {
        /* console.log("Error controller getCartById: " + error); */
        res.render('../src/views/partials/error.hbs', { message: "Error controller getCartById: " + error})   
    }
}

export const deleteCartById = async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid);
        if (!isNaN(idCart)) {
            if (db==='fs') {
                await cartList.deleteById(idCart);
            } else {
                await cartsMongo.deleteById(idCart);
            }
            res.redirect('/api/carts');
            /* res.send("Carrito eliminado.") */
        } else {
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número entero."})   
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "Error en deleteCartById: " + error})   
    }
}

export const addProductInCart = async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let qty = parseInt(req.body.productQtyInput);
        let cid = parseInt(req.body.cartInput);
        let answer;
        if (db==='fs') {
            answer = await cartList.addProductInCart(cid, id, qty);
        } else {
            answer = await cartsMongo.addProductInCart(cid, id, qty);
        }
        if (answer.status === 'success') {
            res.redirect('/api/carts');
        } else {
            res.render('../src/views/partials/error.hbs', { message: answer.message}) 
        }
        //res.send(await cartList.getCartById(cid))
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addProductInCart error: " + error}) 
    }
}

export const updateCart = async (req, res) => {
    try {
        let body = Object.values(req.body);
        let answer = await cartsMongo.updateCart(body);
        let listado = await cartsMongo.getAll();
        //console.log(answer.message)
        res.render('../src/views/partials/cartContainer.hbs', { cart: cart.value, pExist: cart.pExist})
    } catch (error) {
        //console.log(error)
        res.render('../src/views/partials/error.hbs', { message: "updateCart controller error: " + error}) 
    }
}

export const deleteProduct = async (req,res) => {
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.body.idCart);
        let answer = await cartsMongo.deleteProduct(id, cid);
        let listado = await cartsMongo.getAll();
        res.render('../src/views/partials/cartsList.hbs', { carts: listado.value, cartsExists: true});
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteProduct controller error: " + error}) 
    }
}
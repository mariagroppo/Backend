/* CLASSES ---------------------------------------------------------------------------- */
import CartsFile from '../dao/fs/cartsManager.js';
const cartList = new CartsFile('../Primera_Practica_Integradora/src/data/listCarts.txt')

import CartsMongoDB from "../dao/mongodb/cartsMongoDB.js";
export const cartsMongo = new CartsMongoDB();

import db from '../dao/database.js';

export const getCarts = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
        let listado;
        if (db==='fs') {
            listado = await cartList.getAllCarts(); 
        } else {
            listado = await cartsMongo.getAll();   
        }
        if (listado.value.length>0) {
            res.render('../src/views/partials/cartsList.hbs', { carts: listado.value, cartsExists: true, userName, userStatus});
            /* res.send(listado); */
        } else {
            /* res.send("No hay carritos.") */
            res.render('../src/views/partials/cartsList.hbs', { carts: null, cartsExists: false, userName, userStatus})
        }
    } catch (error) {
        /* console.log("ERROR getCarts: " + error); */
        res.render('../src/views/partials/error.hbs', { message: "getCarts controller error: " + error, userName, userStatus})
    }
}

export const addNewCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
        if (db==='fs') {
            await cartList.createCart(); 
        } else {
            await cartsMongo.save()    
        }
        res.redirect('/api/carts');
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addNewCart controller error: " + error, userName, userStatus})
    }
}

export const getCartById = async (req,res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
        let cid = req.params.cid;
        //console.log(req.params.cid)
        if (isNaN(cid)){
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número.", userName, userStatus})   
        } else {
            let cart;
            if (db==='fs') {
                cart = await cartList.getCartById(cid);
            } else {
                cart = await cartsMongo.getById(cid);        
            }
            if (!cart.value) {
                res.render('../src/views/partials/error.hbs', { message: cart.message, userName, userStatus})
            } else {
                /* res.send(cart.value); */
                res.render('../src/views/partials/cartContainer.hbs', { cart: cart.value, pExist: cart.pExist, userName, userStatus})
            }
        }
    } catch (error) {
        /* console.log("Error controller getCartById: " + error); */
        res.render('../src/views/partials/error.hbs', { message: "Error controller getCartById: " + error, userName, userStatus})   
    }
}

export const deleteCartById = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
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
            res.render('../src/views/partials/error.hbs', { message: "El parámetro no es un número entero.", userName, userStatus})   
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "Error en deleteCartById: " + error, userName, userStatus})   
    }
}

export const addProductInCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
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
            res.render('../src/views/partials/error.hbs', { message: answer.message, userName, userStatus}) 
        }
        //res.send(await cartList.getCartById(cid))
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addProductInCart error: " + error, userName, userStatus}) 
    }
}

export const updateCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
        let body = Object.values(req.body);
        let answer = await cartsMongo.updateCart(body);
        let listado = await cartsMongo.getAll();
        //console.log(answer.message)
        res.render('../src/views/partials/cartContainer.hbs', { cart: cart.value, pExist: cart.pExist, userName, userStatus})
    } catch (error) {
        //console.log(error)
        res.render('../src/views/partials/error.hbs', { message: "updateCart controller error: " + error, userName, userStatus}) 
    }
}

export const deleteProduct = async (req,res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
        let id = parseInt(req.params.id);
        let cid = parseInt(req.body.idCart);
        let answer = await cartsMongo.deleteProduct(id, cid);
        let listado = await cartsMongo.getAll();
        res.render('../src/views/partials/cartsList.hbs', { carts: listado.value, cartsExists: true, userName, userStatus});
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteProduct controller error: " + error, userName, userStatus}) 
    }
}
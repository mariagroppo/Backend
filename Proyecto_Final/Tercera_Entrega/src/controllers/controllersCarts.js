/* CLASSES ---------------------------------------------------------------------------- */
import CartsFile from '../dao/fs/cartsManager.js';
const cartList = new CartsFile('../Primera_Practica_Integradora/src/data/listCarts.txt')

import CartsMongoDB from "../dao/mongodb/managers/cartsMongoDB.js";
export const cartsMongo = new CartsMongoDB();

import db from '../dao/database.js';

export const getCarts = async (req, res) => {
    try {
        let listado;
        if (db==='fs') {
            res.send({status: "error", message: "fs is no longer available."})
        } else {
            listado = await cartsMongo.getAll();   
            //console.log(listado.value)
        }
        if (listado.value.length>0) {
            res.send({status: "success", message: "List of carts ok.", value:listado.value, cartsExists: true })
        } else {
            res.send({status: "success", message: "No carts to list.", value:null, cartsExists: false })
        }
    } catch (error) {
        res.send({status: "error", message: "getCarts controller error: " + error})
    }
}

export const addNewCart = async (req, res) => {
    try {
        let cart;
        if (db==='fs') {
            res.send({status: "error", message: "fs is no longer available."})
        } else {
            cart = await cartsMongo.save();
            res.send({status: cart.status, message: cart.message, value: cart.value})
        }
    } catch (error) {
        res.send({status: 'error', message: "addNewCart controller error: " + error, value: null})
    }
}

export const getCartById = async (req,res) => {
    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.send({status: "error", message: "The ID must be an integer."})
        } else {
            let cart;
            if (db==='fs') {
                res.send({status: "error", message: "fs is no longer available."})
            } else {
                cart = await cartsMongo.getById(cid);        
                res.send({status: cart.status, message: cart.message, value: cart.value, pExist: cart.pExist})
            }
        }
    } catch (error) {
        res.send({status: "error", message: "getCartById controller error: " + error})
    }
}

export const deleteCartById = async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid);
        let answer;
        if (!isNaN(idCart)) {
            if (db ==='fs') {
                res.send({status: "error", message: "fs is no longer available."})
            } else {
                answer = await cartsMongo.deleteById(idCart);
                res.send({status: answer.status, message: answer.message})
            }
        } else {
            res.send({status: "error", message: "The ID must be a number."})
        }
    } catch (error) {
        res.send({status: "error", message: "deleteCartById controller error: " + error})
    }
}

export const addProductInCart = async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        let qty = parseInt(req.body.productQtyInput);
        let answer;
        if (db==='fs') {
            res.send({status: "error", message: "fs is no longer available."})
        } else {
            answer = await cartsMongo.addProductInCart(cid, id, qty);
            res.send({status: answer.status, message: answer.message})
        }
        
    } catch (error) {
        res.send({status: 'error', message: "addProductInCart controller error: " + error})
    }
}

export const updateCart = async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        /* let body = Object.values(req.body); */
        const { qty } = req.body;
        let quantity = parseInt(qty);
        let answer = await cartsMongo.updateCart(cid, id, quantity);
        res.send({status: answer.status, message: answer.message})
    } catch (error) {
        res.send({status: 'error', message: "updateCart controller error: " + error})
    }
}

export const deleteProduct = async (req,res) => {
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        let answer = await cartsMongo.deleteProduct(cid, id);
        res.send({status:answer.status, message: answer.message})
    } catch (error) {
        res.send({status: 'error', message: "deleteProduct controller error: " + error}) 
    }
}
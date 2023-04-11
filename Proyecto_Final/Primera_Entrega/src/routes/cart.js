import express from 'express';
const routerCart = express.Router();
import fs from 'fs';
import { userName, adminLicence } from '../server.js';

/* El cliente puede acceder a la sección "Carrito" y:
 1. Crear un nuevo carrito.
 2. Borrar carrito (siempre y cuando le pertenezca).
 3. Ver el contenido de un carrito (siempre y cuando le pertenezca).
 4. Incluir productos a un carrito (siempre y cuando le pertenezca).
NO puede acceder a la sección "Listado de carritos".
 El admin puede hacer todo. */

/* CLASSES ---------------------------------------------------------------------------- */
import CartsFile from '../classes/cartList.js';
const cartList = new CartsFile('./data/listCarts.txt')


/* GET Vista de todos los formularios -------------------------------- */
routerCart.get('/', (req, res) => {
    res.render('../views/partials/carts.hbs', {user: userName, licence: adminLicence})
})

/* Listado de carritos creados ---------------------------------------- */
routerCart.get('/listado', (req, res) => {
    let listado = JSON.parse(fs.readFileSync('../Proyecto_Final/data/listCarts.txt', 'utf-8'));
    if (adminLicence) {
        if (listado.length>0) {
            res.render('../views/partials/listadoCarts.hbs', { carts: listado, cartsExists: true, user: userName, licence: adminLicence})
        } else {
            res.render('../views/partials/listadoCarts.hbs', { carts: listado, cartsExists: false, user: userName, licence: adminLicence})
        }
    } else {
        let answerError = { error: -1, description: "Ruta no autorizada"};
        console.log("Error: " + answerError.error + ". " + answerError.description)   
        res.render('../views/partials/listadoCarts.hbs', { carts: listado, cartsExists: false, user: userName, licence: adminLicence})
    }
})

/* Para crear un carrito --------------------------------------------------------  */
routerCart.post('/', (req, res) => {
    cartList.createCart(userName); 
    res.redirect('/api/cart');
 })

 /* Elimina un carrito segùn su id -------------------------------- */
 routerCart.post('/delete', (req, res) => {
     let id = parseInt(req.body.idCart);
     if (isNaN(id)){
         res.status(400).send({ error: 'El parámetro no es un número.'})    
     } else {
        cartList.deleteById(id, userName);
        res.redirect('/api/cart');
     }
 })

/* Contenido de carrito por ID. */
routerCart.post('/list', (req, res) => {
    let id = parseInt(req.body.idCart);
    let cart = [];
     if (isNaN(id)){
         res.status(400).send({ error: 'El parámetro no es un número.'})    
     } else {
        /* devuelve el carrito completo CART, si tiene productos PRODSCART y si el carrito existe EXISTS*/
        cart = cartList.getById(id, userName).obj;
        let prodsCart=cartList.getById(id, userName).prodsCart;
        let exists=cartList.getById(id, userName).exists;
        /* Si el carrito existe, lo muestro */
        let access=true;
        if (exists) {
            if (cart.user === userName || userName === "admin") {
                res.render('../views/partials/cartContainer.hbs', { carts: cart, cartsExists: true, pExist: prodsCart, user: userName, licence: access})
            } else {
                access=false;
                res.render('../views/partials/cartContainer.hbs', { carts: [], cartsExists: false, pExist:false, user: userName, licence: adminLicence})
            }
        } else {
            console.log("El carrito no existe.");
            res.redirect('/api/cart');
        }
             
        
     }
})

/* Incluir productos por ID */
routerCart.post('/include', (req, res) => {
    /* FALTA INCLUIR CANTIDAD Y QUE AL AGREGAR MISMO ID SUME LA CANTIDAD. */
    const {idCart, id } = req.body;
    if (isNaN(idCart)){
        res.status(400).send({ error: 'El Id del carrito no es un número.'})    
    } else {
        if (isNaN(id)){
            res.status(400).send({ error: 'El Id del producto no es un número.'})    
        } else {
            cartList.includeProductById(idCart, id, userName);
            res.redirect('/api/cart');
        }    
    }
})

export default routerCart;
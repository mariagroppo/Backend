import express from 'express';
import { addNewCart,
    getCarts,
    getCartById,
    deleteCartById,
    addProductInCart
} from '../controllers/cartsControllers.js';

const routerCart = express.Router();

/* GET Vista de todos los formularios -------------------------------- */
routerCart.get('/', getCarts);

/* Para crear un carrito --------------------------------------------------------  */
/* routerCart.get('/addNewCart', addNewCart) */
routerCart.post('/', addNewCart)

/* Para ver contenido del carrito -------------------------------------------------- */
routerCart.get('/:cid', getCartById)

/* Para agregar producto al carrito -------------------------------------------------- */
/* routerCart.post('/addProductInCart/:id', addProductInCart) */
routerCart.post('/:cid/product/:id', addProductInCart)

/* Elimina un carrito segùn su id -------------------------------- */
/* routerCart.post('/delete/:id', deleteCartById); */
routerCart.delete('/:cid', deleteCartById);


/* routerCart.get('/:cid/product/:id', addProductInCart) */

/* Contenido de carrito por ID. */
/* routerCart.post('/list', (req, res) => {
    let id = parseInt(req.body.idCart);
    let cart = [];
     if (isNaN(id)){
         res.status(400).send({ error: 'El parámetro no es un número.'})    
     } else { */
        /* devuelve el carrito completo CART, si tiene productos PRODSCART y si el carrito existe EXISTS*/
/*         cart = cartList.getById(id, userName).obj;
        let prodsCart=cartList.getById(id, userName).prodsCart;
        let exists=cartList.getById(id, userName).exists; */
        /* Si el carrito existe, lo muestro */
        /* let access=true;
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
}) */

/* Incluir productos por ID */
/* FALTA INCLUIR CANTIDAD Y QUE AL AGREGAR MISMO ID SUME LA CANTIDAD. */
/* routerCart.post('/include', (req, res) => {
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
}) */

export default routerCart;

/* CLASSES ---------------------------------------------------------------------------- */
import CartsFile from '../classes/cartsManager.js';
const cartList = new CartsFile('../Primera_Entrega/src/data/listCarts.txt')

export const getCarts = async (req, res) => {
    try {
        let listado = await cartList.getAllCarts(); 
        if (listado.length>0) {
            /* res.render('../src/views/partials/listadoCarts.hbs', { carts: listado, cartsExists: true}) */
            res.send(listado);
        } else {
            res.send("No hay carritos.")
            /* res.render('../src/views/partials/listadoCarts.hbs', { carts: listado, cartsExists: false}) */
        }
    } catch (error) {
        console.log("ERROR getCarts: " + error);
    }
}

export const addNewCart = async (req, res) => {
    try {
        await cartList.createCart(); 
        /* res.redirect('/api/carts'); */
        res.send("Carrito creado.")
    } catch (error) {
        console.log("Error en addNewCart: " + error);
    }
}

export const getCartById = async (req,res) => {
    try {
        let cid = parseInt(req.params.cid);
        if (isNaN(cid)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            let cart = await cartList.getCartById(cid);
            if (!cart) {
                res.send("Carrito no encontrado")
            } else {
                res.send(cart);
            }
        }
    } catch (error) {
        console.log("Error controller getCartById: " + error);
    }
}

export const deleteCartById = async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid);
        if (!isNaN(idCart)) {
            await cartList.deleteById(idCart);
            /* res.redirect('/api/carts'); */
            res.send("Carrito eliminado.")
        } else {
            res.status(400).send({ error: 'El parámetro no es un número.'}) 
        }
    } catch (error) {
        console.log("Error en deleteCartById: " + error)
    }
}

export const addProductInCart = async (req, res) => {
    try {
        let {cid, id } = req.params;
        let qty = req.body.qty;
        await cartList.addProductInCart(cid, id, qty);
        res.send(await cartList.getCartById(cid))
        
    } catch (error) {
        console.log("Error en addProductInCart: " + error)
    }
}
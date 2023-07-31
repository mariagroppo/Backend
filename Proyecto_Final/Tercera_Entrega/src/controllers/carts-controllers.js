import { cartService, productService, ticketsService } from "../../../Tercera_Entrega/src/services/repository.js";
import { mailProducts } from '../mail/nodemailer.js'

const getCarts = async (req, res) => {
    try {
        let listado = await cartService.getAll();   
        if (listado.value.length>0) {
            res.send({status: "success", message: "List of carts ok.", value:listado.value, cartsExists: true })
        } else {
            res.send({status: "success", message: "No carts to list.", value:null, cartsExists: false })
        }
    } catch (error) {
        res.sendError("getCarts controller error: " + error)
    }
}
const addNewCart = async (req, res) => {
    try {
        let cart = await cartService.save();
        res.send({status: cart.status, message: cart.message, value: cart.value})
    } catch (error) {
        res.send({status: 'error', message: "addNewCart controller error: " + error, value: null})
    }
}

const getCartById = async (req,res) => {
    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.sendError("The ID must be an integer.")
        } else {
            let cart = await cartService.getById(cid);        
            res.send({status: cart.status, message: cart.message, value: cart.value, pExist: cart.pExist})
        }
    } catch (error) {
        res.sendError("getCartById controller error: " + error)
    }
}

const deleteCartById = async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid);
        let answer;
        if (!isNaN(idCart)) {
            answer = await cartService.deleteById(idCart);
            res.send({status: answer.status, message: answer.message})
        } else {
            res.sendError("The ID must be a number.")
        }
    } catch (error) {
        res.sendError("deleteCartById controller error: " + error)
    }
}

const addProductInCart = async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        let cid = parseInt(req.params.cid);
        let qty = parseInt(req.body.productQtyInput);
        let answer = await cartService.addProductInCart(cid, id, qty);
        res.send({status: answer.status, message: answer.message})
    } catch (error) {
        res.sendError("addProductInCart controller error: " + error)
    }
}

const updateCart = async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        /* let body = Object.values(req.body); */
        const { qty } = req.body;
        let quantity = parseInt(qty);
        let prod = await productService.getById(id);
        if (prod.status === "success") {
            let answer = await cartService.updateCart(cid, id, quantity);
            res.send({status: answer.status, message: answer.message})
        } else {
            res.send({ status: 'error', message: `Product ID ${id} not founded in cart ID ${cid}.`})
        } 
    } catch (error) {
        res.sendError("updateCart controller error: " + error)
    }
}


const deleteProduct = async (req,res) => {
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        let answer = await cartService.deleteProduct(cid, id);
        res.send({status:answer.status, message: answer.message})
    } catch (error) {
        res.sendError("deleteProduct controller error: " + error) 
    }
}

const closeCart = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let cid = parseInt(req.params.cid);
        let cart = await cartService.getById(cid);
        if (cart.value.products.length > 0) {
            if (cart.status === "success"){
                //Verifico el stock de cada producto.
                let okStock = true;
                let a = [];
                cart.value.products.forEach(product => {
                    let wantedQty = product.quantity;
                    let actualQty = 10;
                    if (wantedQty > actualQty) {
                        let b = {
                            id: product.id,
                            name: product.title,
                            wantedQty: product.quantity,
                            actualQty: 10,
                        };
                        console.log(b)
                        a.push(b);
                        okStock = false;
                    }
                });
                if (okStock === true) {
                    //Cerrar carrito.
                    let answer = await cartService.closeCart(cid);
                    if (answer.status === 'success') {
                        //Crear ticket
                        let ticketCreate = await ticketsService.save(cart.value, req.session.user);
                        if (ticketCreate.status === 'success') {
                            //Enviar correo y wsp con info.
                            await mailProducts(cart.value, req.session.user)
                            res.send({status:'success', message: "Correos enviados."})
                        } else {
                            // Abro de nuevo el carrito
                            let answerTicket = await cartService.reopenCart(cid);
                            res.send({status: 'error', message: ticketCreate.message, userStatus: true, userName})                
                        }

                    } else {
                        res.send({ status: 'error', message: answer.message, userStatus: true, userName})                
                    }
    
    
                } else {
                    res.send({ status: 'error', message: "No hay suficiente stock.", userStatus: true, userName})                
                }
            }

        } else {
            res.send({status: 'error', message: "No hay productos en el carrito.", userStatus: true, userName})            
        }
        //res.render('../src/views/partials/pageNotFound.hbs', {userStatus: true, userName})
    } catch (error) {
        res.send({status:'error', message: "pageNotFound controller error: " + error, userStatus: true, userName:""})
    }
}

export default {
    getCarts,
    addNewCart,
    getCartById,
    deleteCartById,
    addProductInCart,
    updateCart,
    deleteProduct,
    closeCart
}
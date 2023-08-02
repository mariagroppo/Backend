import { mailProducts } from "../mail/nodemailer.js";
import { cartService, productService, ticketsService } from "../services/repository.js";

const viewCarts = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let listado = await cartService.getAll();   
        if (listado.value.length>0) {
            req.logger.log("info",`There are no carts.`);           
            res.render('../src/views/partials/cart-list.hbs', { carts: listado.value, cartsExists: true, userStatus: true, userName})
        } else {
            req.logger.log("info",`List of carts rendering.`);           
            res.render('../src/views/partials/cart-list.hbs', { carts: listado.value, cartsExists: false, userStatus: true, userName})
        }
    } catch (error) {
        req.logger.log("error","getCarts controller error: " + error);           
        res.render('../src/views/partials/error.hbs', { message: "getCarts controller error: " + error, userStatus: true, userName})
    }
}

const addNewCart = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let cart = await cartService.save();
        req.logger.log("info",cart.message);           
        res.render('../src/views/partials/error.hbs', { message: cart.message, userStatus: true, userName})
    } catch (error) {
        req.logger.log("error","addNewCart controller error: " + error);           
        res.render('../src/views/partials/error.hbs', { message: "addNewCart controller error: " + error, userStatus: true, userName})
    }
}

const cartById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            req.logger.log("warning","The ID must be an integer.");           
            res.render('../src/views/partials/error.hbs', { message: "The ID must be an integer."})
        } else {
            let cart = await cartService.getById(cid);    
            if (cart.status === 'success') {
                req.logger.log("info",`Cart ID ${cid} detail is shown.`);           
                res.render('../src/views/partials/cart-container.hbs', { cart: cart.value, pExist: cart.pExist, userStatus: true, userName})
            } else {
                req.logger.log("warning",cart.message);           
                res.render('../src/views/partials/error.hbs', { message: cart.message, userStatus: true, userName})
            }
        }
    } catch (error) {
        req.logger.log("error","getCartById controller error: " + error);           
        res.render('../src/views/partials/error.hbs', { message: "getCartById controller error: " + error, userStatus: true, userName})
    }
}

const deleteCartById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let idCart = parseInt(req.params.cid);
        let answer;
        if (!isNaN(idCart)) {
            answer = await cartService.deleteById(idCart);
            req.logger.log("info",answer.message);           
            res.render('../src/views/partials/error.hbs', {message: answer.message, userStatus: true, userName})
        } else {
            req.logger.log("warning","The ID must be a number.");           
            res.render('../src/views/partials/error.hbs', {message: "The ID must be a number.", userStatus: true, userName})
        }
    } catch (error) {
        req.logger.log("error","deleteCartById controller error: " + error);           
        res.render('../src/views/partials/error.hbs', { message: "deleteCartById controller error: " + error, userStatus: true, userName})
    }
}

const addProductInCart = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let id = parseInt(req.params.pid);
        let qty = parseInt(req.body.productQtyInput);
        let carts = await cartService.getAll();
        let cid;
        let product = await productService.getById(id);
        if (carts.value) {
            if (carts.value[carts.value.length-1].cartStatus === true) {
                if (product.value) {
                    cid = carts.value[carts.value.length-1].idCart;
                    let answer = await cartService.addProductInCart(cid, id, qty);
                    req.logger.log("info",answer.message);           
                    res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})
                }
                else {
                    req.logger.log("warning",product.message);           
                    res.render('../src/views/partials/error.hbs', {message: product.message, userStatus: true, userName})
                }
            } else {
                req.logger.log("warning","No cart opened.");           
                res.render('../src/views/partials/error.hbs', {message: "No cart opened.", userStatus: true, userName})
            }    
        } else {
            req.logger.log("warning",`No cart with ID ${cid} opened.`);           
            res.render('../src/views/partials/error.hbs', {message: `No cart with ID ${cid} opened.`, userStatus: true, userName})
        }
    } catch (error) {
        req.logger.log("error","addProductInCart controller error: " + error);           
        res.render('../src/views/partials/error.hbs', { message: "addProductInCart controller error: " + error, userStatus: true, userName})
    }
}

const deleteProduct = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        let answer = await cartService.deleteProduct(cid, id);
        req.logger.log("info",answer.message);           
        res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})
    } catch (error) {
        req.logger.log("error","deleteProduct controller error: " + error);           
        res.render('../src/views/partials/error.hbs', {message: "deleteProduct controller error: " + error, userStatus: true, userName}) 
    }
}

const updateCart = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let cid = parseInt(req.params.cid);
        let newData = req.body;
        let answer = await cartService.updateCartGlobal(cid, newData);
        req.logger.log("info",answer.message);           
        res.render('../src/views/partials/error.hbs', {message: answer.message, userStatus: true, userName})
    } catch (error) {
        req.logger.log("error","updateCart controller error: " + error);           
        res.render('../src/views/partials/error.hbs', { message: "updateCart controller error: " + error, userStatus: true, userName})
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
                            req.logger.log("info","The emails were sent correctly.");           
                            res.redirect('/products')
                        } else {
                            // Abro de nuevo el carrito
                            let answerTicket = await cartService.reopenCart(cid);
                            req.logger.log("warning","The cart could not be closed. Try again.");           
                            res.render('../src/views/partials/error.hbs', { message: ticketCreate.message, userStatus: true, userName})                
                        }

                    } else {
                        req.logger.log("warning",answer.message);           
                        res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})                
                    }
    
    
                } else {
                    req.logger.log("warning",cart.message);           
                    res.render('../src/views/partials/cart-container.hbs', { cart: cart.value, pExist: cart.pExist, messageStock:true, prodsWithoutStock:a, userStatus: true, userName})
                }
            }

        } else {
            req.logger.log("warning","There are no products in the cart.");           
            res.render('../src/views/partials/error.hbs', { message: "There are no products in the cart.", userStatus: true, userName:""})            
        }
    } catch (error) {
        req.logger.log("error","closeCart controller error: " + error);           
        res.render('../src/views/partials/error.hbs', { message: "closeCart controller error: " + error, userStatus: true, userName:""})
    }
}

export default {
    viewCarts,
    addNewCart,
    cartById,
    deleteCartById,
    addProductInCart,
    deleteProduct,
    updateCart,
    closeCart
}
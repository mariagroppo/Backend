import { mailProducts } from "../mail/nodemailer.js";
import { cartService, productService, ticketsService } from "../services/repository.js";

const viewCarts = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let listado = await cartService.getAll();   
        if (listado.value.length>0) {
            res.render('../src/views/partials/cart-list.hbs', { carts: listado.value, cartsExists: true, userStatus: true, userName})

        } else {
            res.render('../src/views/partials/cart-list.hbs', { carts: listado.value, cartsExists: false, userStatus: true, userName})
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getCarts controller error: " + error, userStatus: true, userName})
    }
}

const addNewCart = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let cart = await cartService.save();
        res.render('../src/views/partials/error.hbs', { message: cart.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addNewCart controller error: " + error, userStatus: true, userName:"" })
    }
}

const cartById = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.render('../src/views/partials/error.hbs', { message: "The ID must be an integer."})
        } else {
            let cart = await cartService.getById(cid);    
            console.log(cart.value.products[0])    
            if (cart.status === 'success') {
                res.render('../src/views/partials/cart-container.hbs', { cart: cart.value, pExist: cart.pExist, userStatus: true, userName})
            } else {
                res.render('../src/views/partials/error.hbs', { message: cart.message, userStatus: true, userName})
            }
        }
    } catch (error) {
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
            res.render('../src/views/partials/error.hbs', {message: answer.message, userStatus: true, userName})
        } else {
            res.render('../src/views/partials/error.hbs', {message: "The ID must be a number.", userStatus: true, userName})
        }
    } catch (error) {
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
                }
                else {
                    res.render('../src/views/partials/error.hbs', {message: product.message, userStatus: true, userName})
                }
            } else {
                res.render('../src/views/partials/error.hbs', {message: "No cart opened.", userStatus: true, userName})
            }    
        } else {
            res.render('../src/views/partials/error.hbs', {message: "No cart opened.", userStatus: true, userName})
        }
        let answer = await cartService.addProductInCart(cid, id, qty);
        res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addProductInCart controller error: " + error, userStatus: true, userName})
    }
}

const deleteProduct = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        let answer = await cartService.deleteProduct(cid, id);
        res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {message: "deleteProduct controller error: " + error, userStatus: true, userName}) 
    }
}

const updateCart = async (req, res) => {
    let userName = req.session.user.name;
    try {
        let cid = parseInt(req.params.cid);
        let newData = req.body;
        let answer = await cartService.updateCartGlobal(cid, newData);
        res.render('../src/views/partials/error.hbs', {message: answer.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateCart controller error: " + error, userStatus: true, userName})
    }
}

const closeCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
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
                            res.redirect('/products')
                        } else {
                            // Abro de nuevo el carrito
                            let answerTicket = await cartService.reopenCart(cid);
                            res.render('../src/views/partials/error.hbs', { message: ticketCreate.message, userStatus: true, userName})                
                        }

                    } else {
                        res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})                
                    }
    
    
                } else {
                    res.render('../src/views/partials/cart-container.hbs', { cart: cart.value, pExist: cart.pExist, messageStock:true, prodsWithoutStock:a, userStatus: true, userName})
                }
            }

        } else {
            res.render('../src/views/partials/error.hbs', { message: "No hay productos en el carrito.", userStatus: true, userName:""})            
        }
        //res.render('../src/views/partials/pageNotFound.hbs', {userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "pageNotFound controller error: " + error, userStatus: true, userName:""})
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
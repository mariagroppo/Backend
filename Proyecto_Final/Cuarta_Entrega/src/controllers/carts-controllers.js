import { cartService, productService, ticketsService } from "../../../Tercera_Entrega/src/services/repository.js";
import { mailProducts } from '../mail/nodemailer.js'

const getCarts = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        let listado = await cartService.getAll(userId);  
        if (listado.value.length>0) {
            req.info = {
                status: 'success',
                message: "List of carts ok.",
                value: listado.value,
                cartsExists: true,
                userName,
            };
            next();
        } else {
            req.info = {
                status: 'success',
                message: "No carts to list.",
                value: null,
                cartsExists: false,
                userName,
            };
            next();
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "getCarts controller error: " + error
        };
        next();
    }
}
const addNewCart = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        let cart = await cartService.save(userId);
        req.info = {
            status: cart.status,
            message: cart.message,
            value: cart.value,
            userName,
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "addNewCart controller error: " + error,
            value: null,
            userName,
        };
        next();
    }
}

const getCartById = async (req,res,next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;

    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.sendError("The ID must be an integer.")
        } else {
            let cart = await cartService.getById(cid, userId);    
            req.info = {
                status: cart.status,
                message: cart.message,
                value: cart.value,
                pExist: cart.pExist,
                userName,
            };
            next();
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "getCartById controller error: " + error,
            value: null,
            userName,
        };
        next();
    }
}

const deleteCartById = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        let idCart = parseInt(req.params.cid);
        let answer;
        if (!isNaN(idCart)) {
            answer = await cartService.deleteById(idCart,userId);
            req.info = {
                status: answer.status,
                message: answer.message,
                value: answer.value,
                pExist: answer.pExist,
                userName,
            };
            next();
        } else {
            req.info = {
                status: 'error',
                message: "The ID must be a number.",
                userName,
            };
            next();
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "deleteCartById controller error: " + error,
            userName,
        };
        next();
    }
}

const addProductInCart = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        let id = parseInt(req.params.pid);
        let qty = parseInt(req.body.productQtyInput);
        let product = await productService.getById(id,userId);
        if (product.status === 'success') {
            let answer = await cartService.addProductInCart(product.value, qty, userId);
            req.info = {
                status: answer.status,
                message: answer.message,
                userName,
            };
            next();
        } else {
            req.info = {
                status: product.status,
                message: product.message,
                userName,
            };
            next();
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "addProductInCart controller error: " + error,
            userName,
        };
        next();
    }
}

const updateCart = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        let cid = parseInt(req.params.cid);
        let data = req.body;
        let answer = await cartService.updateCartGlobal(cid, data, userId);
        console.log(answer)
        req.info = {
            status: answer.status,
            message: answer.message,
            userName,
        };
        next();
        
    } catch (error) {
        req.info = {
            status: 'error',
            message: "updateCart controller error: " + error,
            userName,
        };
        next();
    }
}


const deleteProduct = async (req,res,next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        console.los(id + "-" + cid);
        let answer = await cartService.deleteProduct(cid, id, userId);
        req.info = {
            status: answer.status,
            message: answer.message,
            userName,
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "deleteProduct controller error: " + error,
            userName,
        };
        next();
    }
}

const closeCart = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;

    try {
        let cid = parseInt(req.params.cid);
        let cart = await cartService.getById(cid,userId);
        if (cart.value.products.length > 0) {
            if (cart.status === "success"){
                //Verifico el stock de cada producto.
                let okStock = true;
                let productsWithoutStock = [];
                cart.value.products.forEach(product => {
                    let wantedQty = product.quantity;
                    let actualQty = product._id.stock;
                    if (wantedQty > actualQty) {
                        let b = {
                            id: product._id._id,
                            name: product._id.title,
                            wantedQty: product.quantity,
                            actualQty: product._id.stock,
                        };
                        productsWithoutStock.push(b);
                        okStock = false;
                    }
                });
                if (okStock === true) {
                    //Cerrar carrito.
                    let answer = await cartService.closeCart(cid, userId);
                    if (answer.status === 'success') {
                        //Crear ticket
                        let user = {
                            email: "mariagroppo86@gmail.com",
                            name: "mey",
                            id: userId
                        }
                        //let ticketCreate = await ticketsService.save(cart.value, req.session.user);
                        let ticketCreate = await ticketsService.save(cart.value, user);
                        if (ticketCreate.status === 'success') {
                            //Enviar correo con info.
                            await mailProducts(cart.value, user)
                            req.info = {
                                status: 'success',
                                message: "Emails sent.",
                                value: ticketCreate.value,
                                userName,
                            };
                            next();
                        } else {
                            // Abro de nuevo el carrito
                            await cartService.reopenCart(cid);
                            req.info = {
                                status: 'error',
                                message: ticketCreate.message,
                                userName,
                            };
                            next();
                        }

                    } else {
                        req.info = {
                            status: 'error',
                            message: answer.message,
                            userStatus: true,
                            userName,
                        };
                        next();
                    }
    
    
                } else {
                    req.info = {
                        status: 'error',
                        message: "There is no stock for some products. Please review the wanted quantity. " + JSON.stringify(productsWithoutStock),
                        userName,
                    };
                    next();
                }
            }

        } else {
            req.info = {
                status: 'error',
                message: "There are no products in the cart.",
                userStatus: true, 
                userName,
            };
            next();            
        }
        //res.render('../src/views/partials/pageNotFound.hbs', {userStatus: true, userName})
    } catch (error) {
        req.info = {
            status: 'error',
            message: "closeCart controller error: " + error,
            userStatus: true, 
            userName,
        };
        next(); 
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
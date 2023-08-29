import { mailProducts } from "../mail/nodemailer.js";
import { cartService, productService, ticketsService } from "../services/repository.js";

const viewCarts = async (req, res) => {
    try {
        if (req.info.value?.length > 0) {
            res.render('../src/views/partials/cart-list.hbs', { 
                carts: req.info.value,
                cartsExists: true,
                userStatus: true,
                userName: req.info.userName
            });
        } else {
            res.render('../src/views/partials/cart-list.hbs', { 
                carts: req.info.value,
                cartsExists: false,
                userStatus: true,
                userName: req.info.userName
            });
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "getCarts controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })
    }
}

const addNewCart = async (req, res) => {
    try {
        res.render('../src/views/partials/error.hbs', { 
            message: req.info.message,
            userStatus: true,
            userName: req.info.userName
        })
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "addNewCart controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })
    }
}

const cartById = async (req, res) => {
    try {
        if (req.info.status === 'success') {
            res.render('../src/views/partials/cart-container.hbs', { 
                cart: req.info.value,
                pExist: req.info.pExist,
                userStatus: true,
                userName: req.info.userName
            })
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message:  req.info.message,
                userStatus: true,
                userName: req.info.userName
            })
        }
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "getCartById controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })
    }
}

const deleteCartById = async (req, res) => {
    try {
        res.render('../src/views/partials/error.hbs', { 
            message:  req.info.message,
            userStatus: true,
            userName: req.info.userName
        })
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message:  "deleteCartById controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })
    }
}

const addProductInCart = async (req, res) => {
    try {
        res.render('../src/views/partials/error.hbs', { 
            message: req.info.message,
            userStatus: true,
            userName: req.info.userName
        })           
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "addProductInCart controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        res.render('../src/views/partials/error.hbs', { 
            message: req.info.message, 
            userStatus: true, 
            userName: req.info.userName
        })
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {
            message: "deleteProduct controller error: " + error,
            userStatus: true,
            userName
        }) 
    }
}

const updateCart = async (req, res) => {
    try {
        res.render('../src/views/partials/error.hbs', {
            message: req.info.message,
            userStatus: true,
            userName
        })
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "updateCart controller error: " + error,
            userStatus: true,
            userName
        })
    }
}

const closeCart = async (req, res) => {
    try {
        if (req.info.status === 'success') {
            res.render('../src/views/partials/ticket.hbs', { 
                message: "closeCart controller error:",
                value: req.info.value,
                userStatus: true,
                userName: req.info.userName
            })
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message: req.info.message,
                userStatus: true,
                userName: req.info.userName
            })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "closeCart controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })
    }
}

const ticket = async (req, res) => {
    try {
        res.render('../src/views/partials/ticket.hbs', { 
            message: "closeCart controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })


    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "closeCart controller error: " + error,
            userStatus: true,
            userName: req.info.userName
        })
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
    closeCart,
    ticket
}
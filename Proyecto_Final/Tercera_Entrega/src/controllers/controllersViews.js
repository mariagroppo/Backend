
//import { cartsMongo } from "./carts-controllers.js";
/* import TicketMongoDB from "../dao/mongodb/managers/ticketsMger.js";
export const ticketsMongo = new TicketMongoDB(); */
//import { users } from "./user-others-controllers.js";
/* import { createHash, validatePassword } from "../../utils.js";
import { validateLimit, validatePage } from '../../utils.js';
import { mailProducts } from "../mail/nodemailer.js"; */

/* PRODUCTS ---------------------------------------------------------- */
const viewProducts = async (req, res) => {
    try {
        let userName;
        if (req.session?.user) {
            userName = req.session.user.name;
            let { limit, page, sort, category } = req.query;
            let validPage = await validatePage(page); 
            let validLimit = await validateLimit(limit);
            if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
                sort=1;
            }
            let listado = await prodsMongo.getAll(validLimit,validPage,sort,category);
            let hasPrevPage = listado.value.hasPrevPage;
            let hasNextPage = listado.value.hasNextPage;
            let prevPage = listado.value.prevPage;
            let nextPage = listado.value.nextPage;
            if ((listado.value.docs.length>0) && (req.session?.user)) {
                res.render('../src/views/main.hbs', {prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName })
            } else {
                res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName })
            }
        } else {
            res.render('../src/views/main.hbs', {userStatus: false })
        }
    } catch (error) {
        res.sendInternalError("getProducts controller error");
    }
}

const productById = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let product = await prodsMongo.getById(req.params.pid);
        if (product.value) {
            res.render('../src/views/partials/prod-id.hbs', { prod: product.value, productsExists: true, userStatus: true, userName })
        } else {
            res.render('../src/views/partials/error.hbs', { message: product.message, productsExists: false, userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProductById Controller error: " + error, userStatus: true, userName: ""})
    }
}

const addProductForm = async (req, res) => {
    try {
        let userName = req.session.user.name;
        res.render('../src/views/partials/prod-addNew.hbs', { userStatus: true, userName})
    } catch (error) {
        res.sendInternalError("addProductForm controller error");
    }
}

const addProduct = async (req, res) => {
    try {
        let userName = req.session.user.name;
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields= await prodsMongo.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnail, price, stock, category};
            const newProd = await prodsMongo.save(prod);
            res.render('../src/views/partials/error.hbs', { message: newProd.message, userStatus: true, userName })

        } else {
            res.render('../src/views/partials/error.hbs', { message: validateFields.message, userStatus: true, userName})    
        }
        req.body.reset;
    } catch (error) {
        res.sendInternalError("addProduct controller error");
    }
}


const updateProductByIdForm = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let id = req.params.pid;
        let prod = await prodsMongo.getById(id);
        if (!prod) {
            res.render('../src/views/partials/error.hbs', { message: prod.message, userStatus: true, userName})
        } else {
            res.render('../src/views/partials/prod-update.hbs', { prod: prod.value, userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateProductByIdForm Controller error: " + error, userStatus: true, userName:""})
    }
 }

const updateProductById = async (req, res) => {
    try {
        let userName = req.session.user.name;
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let id = req.params.pid;
        const newProd = {
            id: parseInt(id),
            title: title,
            description: description,
            code: code,
            thumbnail: thumbnail,
            price: price,
            stock: stock,
            category: category
        }
        if (isNaN(id)){
            res.render('../src/views/partials/error.hbs', { message: "The ID must be a number.", userStatus: true, userName})        
        } else {
            await prodsMongo.updateById(newProd)
            res.render('../src/views/partials/error.hbs', { message: `Product ${newProd.id} updated.`, userStatus: true, userName})
        }
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {message: "updateProductById Controller error: " + error, userStatus: true, userName:""})        
    }
}

const deleteProductById = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let id = parseInt(req.params.pid);
        let deleteProduct = await prodsMongo.deleteById(id);
        res.render('../src/views/partials/error.hbs', { message: deleteProduct.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteProductById Controller error: " + error, userStatus: true, userName}) 
    }
}

const viewCarts = async (req, res) => {
    try {
        let userName = req.session?.user.name;
        let listado = await cartsMongo.getAll();   
        if (listado.value.length>0) {
            res.render('../src/views/partials/cart-list.hbs', { carts: listado.value, cartsExists: true, userStatus: true, userName})

        } else {
            res.render('../src/views/partials/cart-list.hbs', { carts: listado.value, cartsExists: false, userStatus: true, userName})
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getCarts controller error: " + error, userStatus: true, userName:""})
    }
}

const addNewCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let cart = await cartsMongo.save();
        res.render('../src/views/partials/error.hbs', { message: cart.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addNewCart controller error: " + error, userStatus: true, userName:"" })
    }
}

const cartById = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.render('../src/views/partials/error.hbs', { message: "The ID must be an integer."})
        } else {
            let cart = await cartsMongo.getById(cid);    
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
    try {
        let userName = req.session.user.name;
        let idCart = parseInt(req.params.cid);
        let answer;
        if (!isNaN(idCart)) {
            answer = await cartsMongo.deleteById(idCart);
            res.render('../src/views/partials/error.hbs', {message: answer.message, userStatus: true, userName})
        } else {
            res.render('../src/views/partials/error.hbs', {message: "The ID must be a number.", userStatus: true, userName})
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteCartById controller error: " + error, userStatus: true, userName:""})
    }
}

const addProductInCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let id = parseInt(req.params.pid);
        let qty = parseInt(req.body.productQtyInput);
        let carts = await cartsMongo.getAll();
        let cid;
        if (carts.value) {
            if (carts.value[carts.value.length-1].cartStatus === true) {
                cid = carts.value[carts.value.length-1].idCart;
            } else {
                res.render('../src/views/partials/error.hbs', {message: "No cart opened.", userStatus: true, userName})
            }    
        } else {
            res.render('../src/views/partials/error.hbs', {message: "No cart opened.", userStatus: true, userName})
        }
        let answer = await cartsMongo.addProductInCart(cid, id, qty);
        res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addProductInCart controller error: " + error, userStatus: true, userName:""})
    }
}

const deleteProduct = async (req, res) => {
    try {
        let userName = req.session?.user.name;
        let id = parseInt(req.params.id);
        let cid = parseInt(req.params.cid);
        let answer = await cartsMongo.deleteProduct(cid, id);
        res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', {message: "deleteProduct controller error: " + error, userStatus: true, userName:""}) 
    }
}

const updateCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let cid = parseInt(req.params.cid);
        let newData = req.body;
        let answer = await cartsMongo.updateCartGlobal(cid, newData);
        res.render('../src/views/partials/error.hbs', {message: answer.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateCart controller error: " + error, userStatus: true, userName:""})
    }
}

const pageNotFound = async (req, res) => {
    try {
        let userName = req.session.user.name;
        res.render('../src/views/partials/pageNotFound.hbs', {userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "pageNotFound controller error: " + error, userStatus: true, userName:""})
    }
}


const closeCart = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let cid = parseInt(req.params.cid);
        let cart = await cartsMongo.getById(cid);
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
                    let answer = await cartsMongo.closeCart(cid);
                    if (answer.status === 'success') {
                        //Crear ticket
                        let ticketCreate = await ticketsMongo.save(cart.value, req.session.user);
                        if (ticketCreate.status === 'success') {
                            //Enviar correo y wsp con info.
                            await mailProducts(cart.value, req.session.user)
                        } else {
                            // Abro de nuevo el carrito
                            let answerTicket = await cartsMongo.reopenCart(cid);
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

const faker = async (req, res) => {
    let userName = req.session.user.name;
    try{
        userName = req.session.user.name;
        let listado = await prodsMongo.fakerProducts();

        let hasPrevPage = true;
        let hasNextPage = true;
        let prevPage = true;
        let nextPage = true;
        let validPage=1;
        let validLimit=100;
        let sort = 1;
        let category=true;
        if ((listado.status === 'success')) {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName })
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName })
        }
        /* let limit = 1;
        let page = 10;
        let sort = 1;
        let listado = await prodsMongo.fakerProducts(limit,page,sort);
        console.log(listado)
        let hasPrevPage = listado.value.hasPrevPage;
        let hasNextPage = listado.value.hasNextPage;
        let prevPage = listado.value.prevPage;
        let nextPage = listado.value.nextPage;
        if ((listado.value.docs.length>0) && (req.session?.user)) {
            res.render('../src/views/main.hbs', {prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName })
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName })
        } */


    } catch (error) {
        res.sendInternalError("getProducts controller error" + error);
    }
}

export default {
    viewProducts,
    addProductForm,
    addProduct,
    productById,
    updateProductByIdForm,
    updateProductById,
    deleteProductById,
    viewCarts,
    addNewCart,
    cartById,
    deleteCartById,
    addProductInCart,
    deleteProduct,
    updateCart,
    pageNotFound,
    closeCart,
    faker
}
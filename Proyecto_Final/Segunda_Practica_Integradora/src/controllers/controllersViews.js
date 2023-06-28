import { prodsMongo } from "./controllers.js";
import { cartsMongo } from "./controllersCarts.js";
import { users } from "./session.js";
import { createHash, validatePassword } from "../../utils.js";

import { validateLimit, validatePage } from '../../utils.js';

/* REGISTER -------------------------------------------------------- */
export const signInForm = async (req, res) => {
    try {
        res.render('../src/views/partials/signin.hbs', { userStatus: false})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getSignInForm controller error: " + error , userStatus: false})
    } 
}

export const signIn = async (req, res) => {
    if (req.user) {
        res.render('../src/views/partials/login.hbs', { message: req.session.message , userStatus: false})
    }
}

export const signInFailed = async (req, res) => {
    res.render('../src/views/partials/error.hbs', { message: req.session.message , userStatus: false}) 
}

/* LOGIN -------------------------------------------------------------- */
export const loginForm = async (req, res) => {
    try {
        res.render('../src/views/partials/login.hbs', { userStatus: false})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getLoginForm controller error: " + error , userStatus: false})
    }
}

export const login = async (req, res) => {
    try {
        req.session.user = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
        res.redirect('/views/products')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "login controller error: " + error , userStatus: false})
    }
}

export const loginFailed = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    res.render('../src/views/partials/error.hbs', { message: req.session.messages[c-1] , userStatus: false}) 
}

export const githubCallback = async (req, res) => {
    try {
        const user = req.user;
        req.session.user = {
            name: user.first_name,
            email: user.userEmail,
            role: req.user.role
        }
        console.log("logueado con github")
        res.redirect('/views/products')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "githubCallback error", userStatus: false})
    }
}

export const logout = async (req, res) => {
    try {
        let userStatus=false;
        if (req.session) {
            req.session.destroy();
        }
        res.render('../src/views/main.hbs', {userStatus});
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "logout session error: " + error , userStatus: false})
    }
}


export const restorePasswordForm = async (req, res) => {
    try {
        res.render('../src/views/partials/restorePassword.hbs')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "restorePasswordForm controller error: " + error })
    }
}

export const restorePassword = async (req, res) => {
    try {
        let { userEmail, newPassword } = req.body;
        //1° Verifico si el correo esta registrado.
        const user = (await users.getUserByEmail(userEmail)).value;
        if (!user) {
            res.status(400).render('../src/views/partials/error.hbs', { message: "Email not registered."})
        } else {
            //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
            const isSamePassword = await validatePassword(newPassword, user.hashedPassword);
            if(isSamePassword) {
                res.status(400).render('../src/views/partials/error.hbs', { message: "Cannot replace password. Please define a different one."})
            } else {
                const newHashedPassword = await createHash(newPassword);
                let a = await users.updateUserPassword(userEmail, newHashedPassword);
                res.status(400).render('../src/views/partials/error.hbs', { message: a.message})
            }

        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "restorePassword controller error: " + error })
    }
}

/* PRODUCTS ---------------------------------------------------------- */
export const viewProducts = async (req, res) => {
    try {
        let userName = req.session.user.name;
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
        if (listado.value.docs.length>0){
            res.render('../src/views/main.hbs', {prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category, userStatus: true, userName })
        } else {
            res.render('../src/views/main.hbs', {prods: listado.value, productsExists: false, realTime: false, userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProducts controller error: " + error, userStatus: true, userName: ""})
    }
}

export const viewProductById = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let product = await prodsMongo.getById(req.params.pid);
        if (product.value) {
            res.render('../src/views/partials/lookForId.hbs', { prod: product.value, productsExists: true, userStatus: true, userName })
        } else {
            res.render('../src/views/partials/error.hbs', { message: product.message, productsExists: false, userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProductById Controller error: " + error, userStatus: true, userName: ""})
    }
}

export const viewAddProductForm = async (req, res) => {
    try {
        let userName = req.session.user.name;
        res.render('../src/views/partials/newProduct.hbs', { userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "viewAddProductForm controller error: " + error, userStatus: true, userName:"" })
    }
}

export const viewAddProduct = async (req, res) => {
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
        res.render('../src/views/partials/error.hbs', { message: "viewAddProduct controller error: " + error, userStatus: true, userName:"" })   
    }
}


export const viewUpdateProductByIdForm = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let id = req.params.pid;
        let prod = await prodsMongo.getById(id);
        if (!prod) {
            res.render('../src/views/partials/error.hbs', { message: prod.message, userStatus: true, userName})
        } else {
            res.render('../src/views/partials/updateProduct.hbs', { prod: prod.value, userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateProductByIdForm Controller error: " + error, userStatus: true, userName:""})
    }
 }

export const viewUpdateProductById = async (req, res) => {
    try {
        let userName = req.session?.user.name;
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

export const viewDeleteProductById = async (req, res) => {
    try {
        let userName = req.session?.user.name;
        let id = parseInt(req.params.pid);
        let deleteProduct = await prodsMongo.deleteById(id);
        res.render('../src/views/partials/error.hbs', { message: deleteProduct.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteProductById Controller error: " + error, userStatus: true, userName}) 
    }
}

export const viewCarts = async (req, res) => {
    try {
        let userName = req.session?.user.name;
        let listado = await cartsMongo.getAll();   
        if (listado.value.length>0) {
            res.render('../src/views/partials/cartsList.hbs', { carts: listado.value, cartsExists: true, userStatus: true, userName})

        } else {
            res.render('../src/views/partials/error.hbs', { message: "No carts to list.", userStatus: true, userName })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getCarts controller error: " + error, userStatus: true, userName:""})
    }
}

export const viewsAddNewCart = async (req, res) => {
    try {
        let userName = req.session?.user.name;
        let cart = await cartsMongo.save();
        res.render('../src/views/partials/error.hbs', { message: cart.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "addNewCart controller error: " + error, userStatus: true, userName:"" })
    }
}

export const viewCartById = async (req, res) => {
    try {
        let userName = req.session?.user.name;
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.render('../src/views/partials/error.hbs', { message: "The ID must be an integer."})
        } else {
            let cart = await cartsMongo.getById(cid);    
            //console.log(cart.value)    
            if (cart.status === 'success') {
                res.render('../src/views/partials/cartContainer.hbs', { cart: cart.value, pExist: cart.pExist, userStatus: true, userName})
            } else {
                res.render('../src/views/partials/error.hbs', { message: cart.message, userStatus: true, userName})
            }
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getCartById controller error: " + error, userStatus: true, userName})
    }
}

export const viewDeleteCartById = async (req, res) => {
    try {
        let userName = req.session?.user.name;
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

export const viewAddProductInCart = async (req, res) => {
    try {
        let userName = req.session?.user.name;
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

export const viewDeleteProduct = async (req, res) => {
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

export const viewUpdateCart = async (req, res) => {
    try {
        let userName = req.session?.user.name;
        let cid = parseInt(req.params.cid);
        let newData = req.body;
        let answer = await cartsMongo.updateCartGlobal(cid, newData);
        res.render('../src/views/partials/error.hbs', {message: answer.message, userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateCart controller error: " + error, userStatus: true, userName:""})
    }
}
import { Cart } from "./models/cartModel.js";
import { prodsMongo } from "../../controllers/controllers.js";

class CartsMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        try {
            const contenido = await Cart.find().lean().populate('products.product');
            let contenido2=contenido;
            for (let i = 0; i < contenido.length; i++) {
                contenido2[i]._id = contenido[i]._id.toString();
            }
            return { status: 'success', message: "Carts ok.", value: contenido2}
            
        } catch (error) {
            return { status: 'error', message: "Error en getAll MongoDB: " + error, value: null}
        }
    } 

    getById = async (number) => {
        try {
            let cart = await Cart.findOne({idCart: Number(number)}).lean().populate('products.product');;
            if (!cart) {
                return { status: 'error', message: `cart ID ${number} do not exists.`, value: null}
            } else {
                if (cart.products.length === 0){
                    return { status: 'success', message: "Cart founded. It has no products.", value: cart, pExist: false}
                } else {
                    //let a = await prodsMongo.infoProducts(cart);
                    return { status: 'success', message: "Cart founded. It has products.", value: cart, pExist: true}
                }
            }
        } catch (error) {
            return { status: 'error', message: "Error en getById MongoDB: " + error, value: null}
        }
        
    } 

    asignId = async () => {
        try {
            const list = await this.getAll();
            let maxId=0;
            if (list.value.length === 0) {
                maxId=1;
            } else {
                list.value.forEach(value => {
                    if (value.idCart > maxId) {
                        maxId=value.idCart
                    }
                })
                maxId=maxId+1;
            }
            //console.log("asigna " + maxId)
            return maxId;
        } catch (error) {
            console.log("Error en asignId: " + error);
            return null;    
        }
    }

    save = async () => {
        try {
            const list = await this.getAll();
            let a = list.value.length;
            if (a > 0) {
                let cart = list.value[a-1];
                if (cart.cartStatus === true) {
                    return { status: 'error', message: "No se puede crear un nuevo carrito ya que posee uno abierto.", value: null}
                } else {
                    const newId = await this.asignId();
                    const timestamp = Date.now();
                    const obj = ({
                        idCart:parseInt(newId),
                        timestamp: timestamp,
                        products: [],
                        cartStatus: true
                    });
                    const newCart = new Cart(obj);
                    await newCart.save();
                    return { status: 'success', message: `Cart created.`, value: newCart}
                }
            } else {
                const newId = 1;
                const timestamp = Date.now();
                const obj = ({
                    idCart:parseInt(newId),
                    timestamp: timestamp,
                    products: [],
                    cartStatus: true
                });
                const newCart = new Cart(obj);
                await newCart.save();
                return { status: 'success', message: `Cart created.`, value: newCart}
            } 
            
        } catch (error) {
            return { status: 'error', message: error, value: null}
        }
        
    } 

    deleteById = async (id) => {
        try {
            if (parseInt(id)>0) {
                let answer = await this.getById(id);
                if (answer.status === 'success') {
                    await Cart.deleteOne({
                        idCart: id
                    })
                    return { status: 'success', message: `Cart ${id} deleted.`, value: true}
                } else {
                    return { status: 'error', message: `Cart ${id} do not exists.`, value: false}
                }
            } else {
                return { status: 'errr', message: "The ID must be an integer.", value: false}
            }
        } catch (error) {
            return { status: 'error', message: "Error en deleteById MongoDB: " + error, value: false}
        }
    }

    verifyProductIsCharged = async (idCart, id) => {
        try {
            const cart = await this.getById(idCart);
            if (cart.value.products.length === 0) {
                return { status: 'success', message: "No products in the cart selected.", value: false}
            } else {
                for (let index = 0; index < cart.value.products.length; index++) {
                    if (parseInt(id) === parseInt(cart.value.products[index].id)) {
                        return { status: 'success', message: "The product is already selected.", value: true}
                    }
                }
                return { status: 'success', message: "Product not selected.", value: false}
            }
        } catch (error) {
            return { status: 'error', message: "verifyProductIsCharged manager error: " + error, value: false}
        }
    }

    addProductInCart = async (cid, id, quantity) => {
        try {
            /* 1. Busco el carrito abierto */
            let cart = await this.getAll();
            let idCart;
            if ((cart.value.length > 0) && (cart.value[cart.value.length-1].cartStatus===true)) {
                idCart = cart.value[cart.value.length-1].idCart;
                if (idCart === cid) {
                    /* 2. verifico que el id del producto exista */
                    let product = await prodsMongo.getById(id);
                    if (product.value) {
                        /* 3. Verifio si el producto esta cargado en el carrito */
                        const charged = await this.verifyProductIsCharged(idCart, id);
                        if (charged.status === 'success') {
                            if (charged.value === true) {
                                for (let index = 0; index < cart.value[cart.value.length-1].products.length; index++) {
                                    if (parseInt(cart.value[cart.value.length-1].products[index].id) === parseInt(id)) {
                                        cart.value[cart.value.length-1].products[index].quantity= parseInt(cart.value[cart.value.length-1].products[index].quantity)+parseInt(quantity);
                                    }
                                }
                                await Cart.updateOne({idCart: idCart}, cart.value[cart.value.length-1])
                            } else {
                                const product = {
                                    id: id,
                                    quantity: quantity
                                };
                                let productsList = cart.value[cart.value.length-1].products;
                                productsList.push(product);
                                await Cart.updateOne({idCart: idCart}, cart.value[cart.value.length-1])
                                //console.log("agrego prod nuevo")
                                
                                /* await Cart.updateOne(
                                    {idCart: idCart},
                                    {
                                        $push: {
                                            products:
                                                {
                                                    _id: id,
                                                    quantity: quantity
                                                }
                                        }
                                    }
                                ) */
                            }
                            return { status: charged.status, message: `Product ID ${id} added to cart ID ${idCart}.`}
                        } else {
                            return { status: charged.status, message: charged.message}
                        }
                    } else {
                        return { status: product.status, message: product.message}
                    }

                } else {
                    return { status: 'error', message: `The cart ID ${cid} does not matches with the opened cart ID.`}
                }
            } else {
                return ({status:'error', message: "You need to open a new cart."})
            }
        } catch (error) {
            return { status: 'error', message: "addProductInCart manager error: " + error}
        }
    } 
    
    updateCart = async (cid, id, qty) => {
        try {
            let cart = await this.getAll();
            let idCart;
            if ((cart.value.length > 0) && (cart.value[cart.value.length-1].cartStatus===true)) {
                idCart = cart.value[cart.value.length-1].idCart;
                if (idCart === cid) {
                    /* verificar que el producto id este */
                    let prod = await prodsMongo.getById(id);
                    if (prod.status === "success") {
                        await Cart.findOneAndUpdate(
                            {idCart: idCart},
                            {$set: {"products.$[el].quantity": qty } },
                            { 
                              arrayFilters: [{ "el.id": id }],
                              new: true
                            }
                          )
                        return { status: 'success', message: `Product ID ${id} updated.`}
                    }
                    return { status: 'error', message: `Product ID ${id} not founded in cart ID ${cid}.`}
                }else {
                    return { status: 'error', message: `The cart ID ${cid} does not matches with the opened cart ID.`}
                }
            } else {
                return ({status:'error', message: "No cart opened."})
            }
        } catch (error) {
            return { status: 'error', message: "updateCart Manager error: " + error}
        }
    }
    
    deleteProduct = async (cid, id) => {
        try {
            let cart = await this.getAll();
            let idCart;
            if ((cart.value.length > 0) && (cart.value[cart.value.length-1].cartStatus===true)) {
                idCart = cart.value[cart.value.length-1].idCart;
                if (idCart === cid) {
                    if ((!isNaN(id)) && (id > 0)) {
                        for (let index = 0; index < cart.value[cart.value.length-1].products.length; index++) {
                            if (cart.value[cart.value.length-1].products[index].id === parseInt(id)) {
                                await Cart.updateOne(
                                    {idCart: idCart},
                                    {$pull: {products: {id: id}}});
                                return { status: 'success', message: `Product ID ${id} deleted.`}
                            }
                        }
                        return { status: 'error', message: "Product not found."}
                    }
                    return { status: 'error', message: "ID must be an integer."}
                } else {
                    return { status: 'error', message: `The cart ID ${cid} does not matches with the opened cart ID.`}
                }
            } else {
                return ({status:'error', message: "No cart opened."})
            }
        } catch (error) {
            return { status: 'error', message: "deleteProduct Manager error: " + error}
        }
    }
    
    updateCartGlobal = async (cid, newData) => {
        try {
            let b = Object.values(newData)
            let cart = await this.getAll();
            let idCart;
            if ((cart.value.length > 0) && (cart.value[cart.value.length-1].cartStatus===true)) {
                idCart = cart.value[cart.value.length-1].idCart;
                if (idCart === cid) {
                    for (let index = 0; index < b.length -1 ; index++) {
                        let a = {pid: parseInt(b[index][0]), qty: parseInt(b[index][1])}
                        await Cart.updateOne(
                            {idCart: idCart},
                            {$set: {"products.$[el].quantity": a.qty } },
                            { 
                                arrayFilters: [{ "el.id": a.pid }],
                                new: true
                            }
                            )
                    }
                    //console.log("Finalizo")
                    return { status: 'success', message: `Cart ID ${cid} updated.`}
                }
            } else {
                return ({status:'error', message: "No cart opened."})
            }
        } catch (error) {
            return { status: 'error', message: "updateCart Manager error: " + error}
        }
    }

}

export default CartsMongoDB;
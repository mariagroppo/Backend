import { Cart } from "./models/cartModel.js";
import { prodsMongo } from "../../controllers/controllers.js";

class CartsMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        try {
            const contenido = await Cart.find().lean()
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
            let cart = await Cart.findOne({idCart: Number(number)}).lean();
            /* let cart = await Cart.findOne({idCart: Number(number)}).lean().populate('products.product'); */
            //console.log(cart)
            if (!cart) {
                return { status: 'error', message: `cart ID ${number} do not exists.`, value: null}
            } else {
                if (cart.products.length === 0){
                    return { status: 'success', message: "Cart founded.", value: cart, pExist: false}
                } else {
                    let a = await prodsMongo.infoProducts(cart);
                    //console.log(a);
                    return { status: 'success', message: "Cart founded.", value: a, pExist: true}
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
            return maxId;
        } catch (error) {
            console.log("Error en asignId: " + error);
            return null;    
        }
    }

    save = async () => {
        try {
            const newId = await this.asignId();
            const timestamp = Date.now();
            const obj = ({
                idCart:parseInt(newId),
                timestamp: timestamp,
                products: []
            });
            const newCart = new Cart(obj);
            await newCart.save();
            return { status: 'success', message: `Cart cargado.`, value: newCart}
        } catch (error) {
            console.log("Error en createCart: " + error);
            return { status: 'error', message: `${repeatCode.message}`, value: null}
        }
        
    } 

    deleteById = async (id) => {
        try {
            await Cart.deleteOne({
                idCart: id
            })
            return { status: 'success', message: "Cart deleted.", value: true}
        } catch (error) {
            return { status: 'error', message: "Error en deleteById MongoDB: " + error, value: false}
        }
    }

    verifyProductIsCharged = async (idCart, id) => {
        try {
            let locate=-1;
            const cart = await this.getById(idCart);
            if (cart.value.products.length === 0) {
                return { status: 'success', message: "No hay productos cargados.", value: null}
            } else {
                for (let index = 0; index < cart.value.products.length; index++) {
                    if (parseInt(id) === parseInt(cart.value.products[index].id)) {
                        locate=index;
                        /* console.log("el producto ya esta cargado."); */
                    }
                }
                if (locate>=0) {
                    return { status: 'success', message: "El producto ya está cargado.", value: locate}
                } else {
                    return { status: 'success', message: "Producto no cargado.", value: null}
                }
            }

        } catch (error) {
            return { status: 'error', message: "verifyProductIsCharged manager error: " + error}
        }
    }

    addProductInCart = async (idCart, id, quantity) => {
        try {
            /* 1. verifica que que ID del carrito exista */
            let cart = await this.getById(idCart);
            if (cart.value) {
                /* 2. verifico que el id del producto exista */
                let product = await prodsMongo.getById(id);
                if (product.value) {
                    /* 3. Verifio si el producto esta cargado en el carrito */
                    const charged = await this.verifyProductIsCharged(idCart, id);
                    if (charged.status === 'success') {
                        if (charged.value !== null) {
                            for (let index = 0; index < cart.value.products.length; index++) {
                                if (parseInt(cart.value.products[index].id) === parseInt(id)) {
                                    cart.value.products[index].quantity= parseInt(cart.value.products[index].quantity)+parseInt(quantity);
                                }
                            }
                            await Cart.updateOne({idCart: idCart}, cart.value)
                        } else {
                            const product = ({
                                id: id,
                                quantity: quantity
                            });
                            cart.value.products.push(product);
                            await Cart.updateOne({idCart: idCart}, cart.value)
                            
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
                        return { status: 'success', message: "Producto/s agregado/s."}
                    } else {
                        return { status: 'error', message: charged.message}
                    }
                } else {
                    return { status: 'error', message: "El producto no existe."}
                }
            } else {
                return { status: 'error', message: "El carrito no existe."}
            }
        } catch (error) {
            return { status: 'error', message: "addProductInCart manager error: " + error}
        }
    } 
    
    updateCart = async (body) => {
        try {
            let idCart=parseInt(body[body.length-1][0]);
            //console.log("idCart: " + idCart);
            for (let index = 0; index < body.length-1; index++) {
                let idProduct=parseInt(body[index][0]);
                let newQty=parseInt(body[index][1]);
                await Cart.findOneAndUpdate(
                    {idCart: idCart},
                    {$set: {"products.$[el].quantity": newQty } },
                    { 
                      arrayFilters: [{ "el.id": idProduct }],
                      new: true
                    }
                  )
                
            }    
            return { status: 'success', message: "Producto/s actualizado/s."}
        } catch (error) {
            console.log("Error en manager mongo: " + error)
            return { status: 'error', message: "updateCart Manager error: " + error}
        }
    }
    
    deleteProduct = async (id, cid) => {
        try {
            await Cart.updateOne(
                {idCart: cid},
                {$pull: {products: {id: id}}});
            return { status: 'success', message: "Producto eliminado."} 
        } catch (error) {
            return { status: 'error', message: "deleteProduct Manager error: " + error}
        }
    }
    

}

export default CartsMongoDB;
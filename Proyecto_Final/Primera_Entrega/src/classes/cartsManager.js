/* Copia del desafio N01 */
import fs from 'fs';

import ProductManager from '../classes/ProductManager.js';
const productsList = new ProductManager("../Primera_Entrega/src/data/listProducts.txt")

/* Declaración de clase Archivo */
class CartsFile {
    /* Atributos */
    constructor (path) {
        this.path = path;
    }

    /* Devuelve el array con los carritos presentes en el archivo ---------------------------------------- */
    getAllCarts = async () => {
        try {
            const contenido = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(contenido);
            
        } catch (error) {
            console.log('Error de lectura!', error);
        }
    } 

    /* * Asigna un id incremental considerando el ultimo id asignado. */
    asignId = async () => {
        try {
            const list = await this.getAllCarts();
            let maxId=0;
            if (list.length === 0) {
                maxId=1;
            } else {
                list.forEach(value => {
                    if (value.idCart > maxId) {
                        maxId=value.idCart
                    }
                })
                maxId=maxId+1;
            }
            return maxId;
        } catch (error) {
            console.log("Error en asignId: " + error);    
        }
    }

    /* Crea un carrito, asigna ID y actualiza el archivo txt. ------------------------- */
    createCart= async () => {
        try {
            const newId = await this.asignId();
            const timestamp = Date.now();
            const listOfCarts = await this.getAllCarts();
            const obj = ({
                idCart:newId,
                timestamp: timestamp,
                products: []
            });
            listOfCarts.push(obj);
            await fs.promises.writeFile(this.path, JSON.stringify(listOfCarts, null,2));
        } catch (error) {
            console.log("Error en createCart: " + error);
        }
    }
   
   /* Elimina del archivo el objeto con el id buscado */
    deleteById = async (number) => {
        try {
            const listOfCarts = await this.getAllCarts();
            let founded = false;
            for (let i = 0; i < listOfCarts.length; i++) {
                if (listOfCarts[i].idCart === number) {
                    listOfCarts.splice(i,1);
                    founded = true;
                }
            }
            if (founded) {
                await fs.promises.writeFile(this.path, JSON.stringify(listOfCarts, null,2));
            } else {
                console.log("Cart ID " + number + " no encontrado.")
            }
        } catch (error) {
            console.log("Error en deleteById: " + error);
        }
    }   
    
    /* Busca del archivo el carrito con el id indicado */
    getCartById = async (number) => {
        try {
            const listOfCarts = await this.getAllCarts();
            let cart = listOfCarts.find(cart => cart.idCart === parseInt(number));
            if (!cart) {
                return null
            } else {
                return cart
            }
        } catch (error) {
            console.log("Error en getCartById: " + error);
            return null;
        }
    } 

    verifyProductIsCharged = async (idCart, id) => {
        try {
            let locate;
            const cart = await this.getCartById(idCart);
            if (cart.products.length === 0) {
                console.log("No hay productos cargados.")
                return null;
            } else {
                for (let index = 0; index < cart.products.length; index++) {
                    if (parseInt(id) === parseInt(cart.products[index].id)) {
                        locate=index;
                        console.log("el producto ya esta cargado.");
                    }
                }
                
                return locate;
            }

        } catch (error) {
            console.log("error en verifyProductIsCharged: " + error);
        }
    }

    updateCarts = async (cart) => {
        try {
            let listadoCarts=await this.getAllCarts();
            for (let i = 0; i < listadoCarts.length; i++) {
                if (listadoCarts[i].idCart === parseInt(cart.idCart)) {
                    listadoCarts[i] = cart;
                    await fs.promises.writeFile(this.path, JSON.stringify(listadoCarts, null,2));
                }
            }
        } catch (error) {
            console.log("error en updateCart: " + error);
        }
    }

    /* Agrega productos nuevos por Id */
    addProductInCart = async (idCart, id, quantity) => {
        try {
            /* 1. verifica que que ID del carrito exista */
            let cart = await this.getCartById(idCart);
            if (cart) {
                /* 2. verifico que el id del producto exista */
                let product = await productsList.getProductById(id);
                if (product) {
                    /* 3. Verifio si el producto esta cargado en el carrito */
                    const charged = await this.verifyProductIsCharged(idCart, id);
                    if (charged >=0 ) {
                        for (let index = 0; index < cart.products.length; index++) {
                            if (parseInt(cart.products[index].id) === parseInt(id)) {
                                cart.products[index].quantity= parseInt(cart.products[index].quantity)+parseInt(quantity);
                            }
                        }
                        await this.updateCarts(cart);
                    } else {
                        const product = ({
                            id: id,
                            quantity: quantity
                        });
                        cart.products.push(product);
                        await this.updateCarts(cart);
                    }
                    /* console.log(cart); */
                } else {
                    console.log("El producto no existe.")
                }
            } else {
                console.log("El carrito no existe")
            }
        } catch (error) {
            console.log("Error en addProductInCart: " + error);
        }
    } 
    }

export default CartsFile;
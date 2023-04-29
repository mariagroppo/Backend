/* Desafio N02 */
import fs from 'fs';

/* Declaración de clase Archivo */
class ProductManager {
    /* Atributos */
    constructor (path) {
        this.path = path;
    }
    
    /* Devuelve el arreglo con todos los productos creados hasta ese momento */
    getProducts = async () => {
        let contenido;
        try {
            contenido = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(contenido);
        } catch (error) {
            contenido=[];
            console.log('Error en getProducts: ', error);
            return contenido;
        }
    } 

    /* Asigna un id incremental considerando el ultimo id asignado. */
    asignId = async () => {
        try {
            const list = await this.getProducts();
            let maxId=0;
            if (list.length === 0) {
                maxId=1;
            } else {
                list.forEach(value => {
                    if (value.id > maxId) {
                        maxId=value.id
                    }
                })
                maxId=maxId+1;
            }
            return maxId;
        } catch (error) {
            console.log("Error en asignId: " + error);    
        }
    }

    /* Con la informacion de un producto, crea el array newProd */
    getFullProduct = async (product) => {
        try {
            const newProd = {
                id: await this.asignId(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock}
            return newProd;
        } catch (error) {
            console.log("Error en getFullProduct: " + error);  
        }
    }

    /* Verifica que el codigo del producto a agregar no este repetido */
    verifyCode = async (code) => {
        try {
            const list = await this.getProducts();
            for (let i=0; i<list.length; i++){
                if (list[i].code===code) {
                    return false
                }
            }
            return true
        } catch (error) {
            console.log("Error en verifyCode: " + error);    
        }
    }

    /* Agrega un producto, validando que no se repita el campo “code” y que todos los campos sean 
    obligatorios. Al agregarlo, debe crearse con un id autoincrementable */
    addProduct = async (product) => {
        try {
            const newProd = await this.getFullProduct(product)
            const repeatCode = await this.verifyCode(newProd.code);
            const listOfProducts = await this.getProducts();
            if (repeatCode){
                listOfProducts.push(newProd);
                await fs.promises.writeFile(this.path, JSON.stringify(listOfProducts, null,2));
                console.log("Producto ", newProd.id, " agregado");
                /* return { status: 'success', message: `Product added successfully!`}; */
            } else if (!repeatCode) {
                console.log("El producto ", newProd.id, " no puede agregar por codigo repetido.")
                /* return { status: 'error', message: `Product not added. Code already exists.` }; */
            }
        } catch (error) {
            console.log("Error en addProduct: " + error);  
            return { status: 'error', message: err.message };  
        }
    } 

/*  Busca en el arreglo el producto que coincida con el id. En caso de no coincidir ningún id, 
Muestra en consola un error “Not found” */
    getProductById = async (number) => {
        try {
            const listOfProducts = await this.getProducts();
            let a = [];
            let product = listOfProducts.find(prod => prod.id === parseInt(number));
            if (!product) {
                console.log("Producto con id " + number + " no encontrado.")
                return null
            } else {
                console.log("Producto con id " + number + " encontrado.");
                return product
            }
        } catch (error) {
            console.log("Error en getProductById: " + error);    
        }
    } 
    
    /* Elimina del archivo el objeto con el id buscado */
    deleteById = async (number) => {
        try {
            const listOfProducts = await this.getProducts();
            let founded = false;
            for (let i = 0; i < listOfProducts.length; i++) {
                if (listOfProducts[i].id === number) {
                    listOfProducts.splice(i,1);
                    founded = true;
                }
            }
            if (founded) {
                await fs.promises.writeFile(this.path, JSON.stringify(listOfProducts, null,2));
                console.log("Producto ID " + number + " eliminado.")
            } else {
                console.log("Producto ID " + number + " no encontrado.")
            }
        } catch (error) {
            console.log("Error en deleteById: " + error);
        }
    }    
    
    /* Elimina todos los objetos presentes en el archivo */
    deleteAll = async function borrarTodo() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
        } catch (error) {
            console.log('Error al intentar borrar toda la información.');
        }
    }

    updateProductById = async (number, product) => {
        try {
            const listOfProducts = await this.getProducts();
            let founded = false;
            for (let i = 0; i < listOfProducts.length; i++) {
                if (listOfProducts[i].id === parseInt(number)) {
                    listOfProducts[i].title = product.title,
                    listOfProducts[i].description = product.description,
                    listOfProducts[i].price = product.price,
                    listOfProducts[i].thumbnail = product.thumbnail,
                    listOfProducts[i].code = product.code,
                    listOfProducts[i].stock = product.stock,
                    listOfProducts[i].category = product.category
                    founded = true;
                }
            }
            if (founded) {
                await fs.promises.writeFile(this.path, JSON.stringify(listOfProducts, null,2));
                /* console.log("Producto ID " + number + " actualizado.") */
            } else {
                console.log("Producto ID " + number + " no encontrado.")
            }

        } catch (error) {
            console.log("Error en updateProductById: " + error);
        }
    }
}


export default ProductManager;

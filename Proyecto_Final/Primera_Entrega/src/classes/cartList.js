/* Copia del desafio N01 */
import fs from 'fs';

/* Declaración de clase Archivo */
class CartsFile {
    /* Atributos */
    constructor (archivo) {
        this.archivo = archivo;
    }

    /* Crea un carrito, asigna ID y actualiza el archivo txt. ------------------------- */
    createCart= async (user) => {
        let idMax=0;
        const arrayList = await this.getAllCarts();
        if (arrayList.length > 0) {
            for (let index = 0; index < arrayList.length; index++) {
                const number = arrayList[index].idCart;
                if (number > idMax) {
                    idMax=number;
                }
            }
        } 
        let newId = idMax + 1;
        console.log("Se asigna el id: " + newId);
        const timestamp = Date.now();
        
        try {
            const obj = ({
                idCart:newId,
                timestamp: timestamp,
                user: user,
                products: []
            });
            console.log(obj);
            arrayList.push(obj);
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
            await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null, 2));
        } catch (error) {
            console.log('No se pudo guardar.')
        }
    }
   
   
    /* Devuelve el array con los carritos presentes en el archivo ---------------------------------------- */
    getAllCarts = async () => {
        try {
            const contenido = await fs.promises.readFile(this.archivo, 'utf-8');
            return JSON.parse(contenido);
            
        } catch (error) {
            console.log('Error de lectura!', error);
        }
    } 
    
    /* Elimina del archivo el objeto con el id buscado */
    deleteById = async (number, user) => {
        const arrayList = await this.getAllCarts();
        let exists=0;
        let userCart="";
        for (let index = 0; index < arrayList.length; index++) {
            if (parseInt(number) === parseInt(arrayList[index].idCart)) {
                exists=1;
                userCart=arrayList[index].user;
            }
        }
        if (exists===1) {
            if (userCart === user || user === "admin") {
                try {
                    let newArray = arrayList.filter(cart => cart.idCart != number);
                    await fs.promises.writeFile(this.archivo, JSON.stringify([], null,2));
                    await fs.promises.writeFile(this.archivo, JSON.stringify(newArray, null,2));
                } catch (error) {
                    console.log('Error al intentar borrar el id ingresado');
                }
            } else {
                console.log("Solo el dueño puede borrar el carrito.");    
            }
            
        } else {
            console.log('Id de carrito ingresado no existe.');
            return null;
        }
    }   
    
    /* Busca del archivo el carrito con el id indicado */
    getById = (number, user) => {
        const arrayList = JSON.parse(fs.readFileSync('./data/listCarts.txt', 'utf-8'));
        let exists=0;
        let locate=0;
        for (let index = 0; index < arrayList.length; index++) {
            if (parseInt(number) === parseInt(arrayList[index].idCart)) {
                exists=1;
                locate=index;
            }
        }
        let prodsCart=false;
        let obj = [];
        if (exists===1) {
            if (arrayList[locate].user === user || user === "admin") {
                try {
                    obj = arrayList[locate];
                    if (arrayList[locate].products.length > 0) {
                       /*  console.log(arrayList[locate].products.length); */
                        prodsCart=true;
                    }
                    return {obj, prodsCart, exists};
                } catch (error) {
                    console.log('Error al intentar buscar el id ingresado');
                }
            } else {
                console.log("Solo el dueño puede ver el ccontenido del carrito.")
            }
        } else {
            console.log('Id de carrito ingresado no existe.');
            return {obj, prodsCart, exists};

        }
    } 

    /* Agrega productos nuevos por Id */
    includeProductById = async (idCart, id, user) => {
        /* 1. verifica que que ID del carrito exista */
        const arrayList = JSON.parse(fs.readFileSync('./data/listCarts.txt', 'utf-8'));
        let existsCart=0;
        let locateCart=0;
        let exists=0;
        let locate=0;
        for (let index = 0; index < arrayList.length; index++) {
            if (parseInt(idCart) === parseInt(arrayList[index].idCart)) {
                existsCart=1;
                locateCart=index;
                console.log("El carrito existe.")
            }
        }
        
        if (existsCart===1) {
            /* 2. Verifico que el carrito pertenece al usuario  */
            if (arrayList[locateCart].user === user || user === "admin") {
                console.log("El usuario esta ok");
                /* 3. verifico que el id del producto exista */
                const arrayProducts = JSON.parse(fs.readFileSync('./data/listProducts.txt', 'utf-8'));
                if (arrayProducts.length > 0) {
                    exists=0;
                    for (let index = 0; index < arrayProducts.length; index++) {
                        if (parseInt(id) === parseInt(arrayProducts[index].id)) {
                            exists=1;
                            locate=index;
                            console.log("El producto esta ok");
                        }
                    }
                } else {
                    console.log("No hay productos listados.");
                }
                                
                try {
                    if (exists===1) {
                        const prod=arrayProducts[locate];
                        /* if (arrayList[locateCart].products.length === 0) {
                            arrayList[locateCart].products=prod;
                        } else {
                            console.log("aca"); */
                            arrayList[locateCart].products.push(prod);
                        /* } */
                        console.log("Producto agregado");
                        console.log(arrayList[locateCart].products);
                        await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2));
                        await fs.promises.writeFile(this.archivo, JSON.stringify(arrayList, null, 2));
                    } else {
                        console.log("El ID del producto ingresado no existe.");
                    }

                    
                    
                } catch (error) {
                    console.log('Error al intentar buscar el id ingresado');
                }
            } else {
                console.log("Solo el dueño puede ver el ccontenido del carrito.")
            }
        } else {
            console.log('Id de carrito ingresado no existe.');
            return null;
        }
    } 
    }

export default CartsFile;
import { Product } from "./models/productModel.js";

class ProductMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        try {
            const contenido = await Product.find().lean()
            let contenido2=contenido;
            for (let i = 0; i < contenido.length; i++) {
                contenido2[i]._id = contenido[i]._id.toString();
            }
            return { status: 'success', message: "Products ok.", value: contenido2}
            
        } catch (error) {
            return { status: 'error', message: "Error en getAll MongoDB: " + error, value: null}
        }
    } 

    getById = async (number) => {
        try {
            let product = await Product.findOne({id: number}).lean();
            if (!product) {
                return { status: 'error', message: `Product ID ${number} do not exists.`, value: null}
            } else {
                return { status: 'success', message: "Product founded.", value: product}
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
                    if (value.id > maxId) {
                        maxId=value.id
                    }
                })
                maxId=maxId+1;
            }
            return { status: 'success', message: `Assigned product ID ${maxId} added.`, value: maxId}
        } catch (error) {
            return { status: 'error', message: `ProductManager asignId error: ${error}.`, value: null}    
        }
    }

    repeatCode = async (code) => {
        try {
            const list = await this.getAll();
            for (let i=0; i<list.value.length; i++){
                if (list.value[i].code===code) {
                    return { status: 'error', message: `Code already in use.`, value: true}
                }
            }
            return { status: 'success', message: `Code not used.`, value: false}
        } catch (error) {
            return { status: 'error', message: `ProductManager repeatCode error: ${error}.`, value: true}
        }
    }

    save = async (newProduct) => {
        try {
            const idProd = await this.asignId();
            let id = idProd.value;
            const repeatCode = await this.repeatCode(newProduct.code);
            if (!repeatCode.value){
                const title=newProduct.title;
                const thumbnail=newProduct.thumbnail;
                const code = newProduct.code;
                const description = newProduct.description;
                const category = newProduct.category;
                const stock = newProduct.stock;
                const price=newProduct.price;
                const prod = {id, title, thumbnail, price, code, category, stock, description};
    
                const newProd = new Product(prod);
                /* console.log(newProd) */
                await newProd.save();
                return { status: 'success', message: `Producto cargado.`, value: newProd}
            } else {
                return { status: 'error', message: `${repeatCode.message}`, value: null}
            }
            
        } catch (error) {
            return { status: 'error', message: `ProductManager save Mongo DB error: ${error}.`, value: false}
        }
        
    } 

    deleteById = async (id) => {
        try {
            await Product.deleteOne({
                id: id
            })
            return { status: 'success', message: "Product deleted.", value: true}
        } catch (error) {
            return { status: 'error', message: "Error en deleteById MongoDB: " + error, value: false}
        }
    }

    

    updateById = async (prod) => {
        let number=prod.id;
        let newObject = await Product.findOne({id: number});
        /* console.log("new objetc");
        console.log(newObject) */
        if (newObject === []) {
            return { status: 'error', message: `Product ID ${number} do not exists.`, value: false}
        } else {
            if (prod.title !== "" ) {
                newObject.title=prod.title
            } 
            if (prod.thumbnail != "" ) {
                newObject.thumbnail=prod.thumbnail
            }
            if (prod.price != "" ) {
                newObject.price=prod.price
            }
            if (prod.description != "" ) {
                newObject.description=prod.description
            }
            if (prod.stock != "" ) {
                newObject.stock=prod.stock
            }
            if (prod.category != "" ) {
                newObject.category=prod.category
            }
            /* console.log("NEW OBJECT");
            console.log(newObject); */
        }
        
        await Product.updateOne({id: number}, newObject)
        return { status: 'success', message: `Product ID ${number} updated.`, value: true}
    
    }

}

export default ProductMongoDB;
import { Product } from "../models/productModel.js";
import { generateProduct } from "../../../mocks/prods.mocks.js";

class ProductMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async (validLimit,page,sort,category) => {
        try {
            let options = {
                page: Number(page) || 1,
                limit: Number(validLimit),
                sort: {price: Number(sort)},
            };
            let contenido;
            if (category) {
                contenido = await Product.paginate({category: category},options);
            } else {
                contenido = await Product.paginate({},options);
            }
            return { status: 'success', message: "Products ok.", value: contenido}
            
        } catch (error) {
            return { status: 'error', message: "Error en getAll MongoDB: " + error, value: null}
        }
    } 

    getById = async (number) => {
        try {
            if (parseInt(number) > 0) {
                let product = await Product.findOne({id: number}).lean();
                if (!product) {
                    return { status: 'error', message: `Product ID ${number} do not exists.`, value: null}
                } else {
                    return { status: 'success', message: "Product founded.", value: product}
                }
            } else {
                return { status: 'error', message: "Product ID is not valid.", value: null}
            }
        } catch (error) {
            return { status: 'error', message: "Error en getById MongoDB: " + error, value: null}
        }
        
    } 

    asignId = async () => {
        try {
            const list = await Product.aggregate([
                {$sort: {price:1}}
            ])
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
            return { status: 'success', message: `Assigned product ID ${maxId} added.`, value: maxId}
        } catch (error) {
            return { status: 'error', message: `ProductManager asignId error: ${error}.`, value: null}    
        }
    }

    repeatCode = async (code) => {
        try {
            const list = await Product.aggregate([
                {$sort: {price:1}}
            ])
            for (let i=0; i<list.length; i++){
                if (list[i].code===code) {
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
                await newProd.save();
                return { status: 'success', message: `Product charged.`, value: newProd}
            } else {
                return { status: 'error', message: `${repeatCode.message}`, value: null}
            }
            
        } catch (error) {
            return { status: 'error', message: `ProductManager save Mongo DB error: ${error}.`, value: false}
        }
        
    } 

    deleteById = async (id) => {
        try {
            if (parseInt(id)>0) {
                let answer = await this.getById(id);
                if (answer.status === 'success') {
                    await Product.deleteOne({
                        id: id
                    })
                    return { status: 'success', message: `Product ${id} deleted.`, value: true}
                } else {
                    return { status: 'error', message: `Product ${id} do not exists.`, value: false}
                }
            } else {
                return { status: 'errr', message: "The ID must be an integer.", value: false}
            }
        } catch (error) {
            return { status: 'error', message: "Error en deleteById MongoDB: " + error, value: false}
        }
    }

    

    updateById = async (prod) => {
        let number=prod.id;
        let newObject = await Product.findOne({id: number});
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
        }
        
        await Product.updateOne({id: number}, newObject)
        return { status: 'success', message: `Product ID ${number} updated.`, value: true}
    
    }

    validateFields =  async (product) => {
        try {
            if ( (typeof product.title === 'undefined') 
                || (typeof product.description === 'undefined') 
                || (typeof product.code === 'undefined')
                || (typeof product.thumbnail === 'undefined')
                || (typeof product.price === 'undefined')
                || (typeof product.stock === 'undefined')
                || (typeof product.category === 'undefined')
            ){
                return { status: 'error', message: `All fields shall be completed.`, value: false}
            } else {
                return { status: 'success', message: `All fields are completed.`, value: true}
            }
        } catch (error) {
            return { status: 'error', message: `ProductManager validateFields error: ${error}`, value: false}
        }
    }

    fakerProducts = async(limit, page, sort) => {
        try {
            /* let options = {
                page: limit,
                limit: page,
                sort: {price: sort},
            }; */
            let contenido=[];
            for (let index = 0; index < 20; index++) {
                contenido.push(generateProduct());
            }
            //let fakers = await contenido.paginate({},options);
            //console.log(fakers)
            return { status: 'success', message: "Products ok.", value: contenido}
            
        } catch (error) {
            return { status: 'error', message: "Error en fakerProducst MongoDB: " + error, value: null}
        }
    }


    /* infoProducts = async (cart) => {
        try {
            let info = [];
            let listado = await Product.find().lean();
            if (cart.products.length > 0) {
                for (let index = 0; index < cart.products.length; index++) {
                    let idProduct = parseInt(cart.products[index].id);
                    for (let b = 0; b < listado.length; b++) {
                        if (parseInt(listado[b].id) === parseInt(idProduct)) {
                            let a = {
                                id: idProduct,
                                quantity: cart.products[index].quantity,
                                title: listado[b].title,
                                thumbnail: listado[b].thumbnail,
                                price: listado[b].price,
                                description: listado[b].description,
                                stock: listado[b].stock,
                                category: listado[b].category,
                                code: listado[b].code
                            }
                            info.push(a);
                        }
                        
                    }
                }
                cart.products=info;
            }
            return cart
        } catch (error) {
            console.log(error)
            return null;
        }
    } */
}

export default ProductMongoDB;
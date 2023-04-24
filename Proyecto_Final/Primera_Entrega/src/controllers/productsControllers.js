/* CLASSES ---------------------------------------------------------------------------- */
import ProductManager from '../classes/ProductManager.js';
const productsList = new ProductManager("../Primera_Entrega/src/data/listProducts.txt")

export const getProducts = async (req, res) => {
    try {
        let { limit } = req.query;
        let listado = await productsList.getProducts();
        if (listado.length>0) {
            if (!limit) {
                /* res.render('../src/views/main.hbs', { prods: listado, productsExists: true }) */
                res.send(listado);
            } else {
                let newArray = [];
                for (let i=0; i<parseInt(limit); i++) {
                    newArray.push(listado[i]);
                }
                /* res.render('../src/views/main.hbs', { prods: newArray, productsExists: true }) */
                res.send(newArray);
            }
        } else {
            /* res.render('../src/views/main.hbs', { prods: listado, productsExists: false }) */
            res.send("No hay productos.")
        }
    } catch (error) {
        console.log("getProducts Controller error: " + error);
    }

}

export const getProductById = async (req, res) => {
    try {
        let id = req.params.id;
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            let prod = await productsList.getProductById(id);
            if (!prod) {
                res.send("Producto no encontrado")
            } else {
                /* res.render('../src/views/partials/lookForId.hbs', { prod: prod, productsExists: true }) */
                res.send(prod);
            }
        }
    } catch (error) {
        console.log("getProductById Controller error: " + error);
    }

}

export const addNewProductForm = async (req, res) => {
    try {
        res.render('../src/views/partials/newProduct.hbs')
    } catch (error) {
        console.log("editProducts Controller error: " + error);    
    }
}

export const addNewProduct = async (req, res) => {
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields=true;
        if ( (title === "") 
            || (description === "") 
            || (code === "")
            || (thumbnail === "")
            || (price === "")
            || (stock === "")
            || (category === "")
        ){
            validateFields=false;
        }
        if (validateFields === true) {
            const prod = {title, description, code, thumbnail, price, stock, category};
            const newProd = await productsList.addProduct(prod);
            res.send("Producto agregado: " + newProd);
            /* res.redirect('/api/products'); */    
        } else {
            console.log("Todos los campos deben estar completos.");    
        }
        req.body.reset;
    } catch (error) {
        console.log("addNewProduct Controller error: " + error);    
    }
    
 }

export const updateProductByIdForm = async (req, res) => {
    try {
        let id = req.params.id;
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            let prod = await productsList.getProductById(id);
            if (!prod) {
                res.send("Producto no encontrado")
            } else {
                res.render('../src/views/partials/updateProduct.hbs', { prod: prod })
            }
        }

    } catch (error) {
        console.log("updateProductByIdForm error: " + error);
    }
 }

export const updateProductById = async (req, res) => {
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let id = req.params.id;
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
        /* console.log(newProd) */
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            await productsList.updateProductById(id, newProd);
            /* res.redirect('/api/products'); */
            res.send("Producto " + newProd.id + " actualizado. ")
        }
        
    } catch (error) {
        console.log("Error en updateProductById: " + error);
    }
}

export const deleteProductById = async(req,res)=> {
    try {
        let id = parseInt(req.params.id);
        if (!isNaN(id)) {
            await productsList.deleteById(id);
            res.redirect('/api/products');
        } else {
            res.status(400).send({ error: 'El parámetro no es un número.'}) 
        }
    } catch (error) {
        console.log("Error en deleProductById: " + error)
    }
}
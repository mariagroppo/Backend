/* CLASSES ---------------------------------------------------------------------------- */
import ProductManager from '../classes/ProductManager.js';
const productsList = new ProductManager("../Primera_Entrega/src/data/listProducts.txt")

export const getProducts = async (req, res) => {
    try {
        let { limit } = req.query;
        let listado = await productsList.getProducts();
        if (!limit) {
            if (listado.value.length>0){
                res.send(listado.value);
            } else {
                res.status(400).send("No hay productos.");
            }
        } else {
            if (isNaN(parseInt(limit)) || parseInt(limit)<0 ) {
                res.status(400).send("El limite debe ser un numero entero positivo.");
            } else {
                let newArray = [];
                if (parseInt(limit) < listado.value.length) {
                    for (let i=0; i<parseInt(limit); i++) {
                        newArray.push(listado.value[i]);
                    }
                } else {
                    newArray = listado.value;
                }
                res.send(newArray);
            }
        }
    } catch (error) {
        res.status(400).send("getProducts Controller error: " + error);
    }

}

export const getProductById = async (req, res) => {
    try {
        let id = req.params.id;
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            let prod = await productsList.getProductById(id);
            if (!prod.value) {
                res.send(prod.message)
            } else {
                /* res.render('../src/views/partials/lookForId.hbs', { prod: prod, productsExists: true }) */
                res.send(prod.value);
            }
        }
    } catch (error) {
        res.send("getProductById Controller error: " + error);
    }

}

/* export const addNewProductForm = async (req, res) => {
    try {
        res.render('../src/views/partials/newProduct.hbs')
    } catch (error) {
        console.log("editProducts Controller error: " + error);    
    }
} */

export const addNewProduct = async (req, res) => {
    try {
        const {title, description, code, thumbnails, price, stock, category} = req.body;
        let validateFields= await productsList.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnails, price, stock, category};
            const newProd = await productsList.addProduct(prod);
            if (newProd.status === 'success') {
                res.send(newProd.message);
            } else {
                res.send(newProd.message);
            }
        } else {
            res.send(validateFields.message)    
        }
        req.body.reset;
    } catch (error) {
        res.send("addNewProduct Controller error: " + error);    
    }
    
 }

/* export const updateProductByIdForm = async (req, res) => {
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
 } */

export const updateProductById = async (req, res) => {
    try {
        const prodToUpdate = req.body;
        let id = req.params.id;
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            let updated = await productsList.updateProductById(id, prodToUpdate);
            res.send(updated.message)
        }
        
    } catch (error) {
        res.send("Error en updateProductById: " + error);
    }
}

export const deleteProductById = async(req,res)=> {
    try {
        let id = parseInt(req.params.id);
        if (!isNaN(id)) {
            let deleted = await productsList.deleteById(id);
            res.send(deleted.message);
        } else {
            res.status(400).send({ error: 'El parámetro no es un número.'}) 
        }
    } catch (error) {
        res.send("Error en deleProductById: " + error);
    }
}
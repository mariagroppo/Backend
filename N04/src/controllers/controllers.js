import ProductManager from '../classes/productManager.js';
let listOfProducts = new ProductManager('./src/productos.txt');

export const getProducts = async (req, res) => {
    try {
        let { limit } = req.query;
        const arrayProductos = await listOfProducts.getProducts();
        if (!limit) {
            res.render('../src/views/main.hbs', { prods: arrayProductos, productsExists: true, realTime: false })
        } else {
            let newArray = [];
            for (let i=0; i<parseInt(limit); i++) {
                newArray.push(arrayProductos[i]);
            }
            res.render('../src/views/main.hbs', { prods: newArray, productsExists: true, realTime: false })
        }
    } catch (error) {
        console.log("getProducts controller error: " + error);
        res.send(null);
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await listOfProducts.getProductById(req.params.pid);
        if (!product) {
            /* console.log(`El producto con id ${req.params.pid} no existe.`); */
            res.render('../src/views/partials/lookForId.hbs', { prod: product, productsExists: false })
        } else {
            res.render('../src/views/partials/lookForId.hbs', { prod: product, productsExists: true })
        }
    } catch (error) {
        console.log("getProducts controller error: " + error);
        res.send(null);
    }
}

/* export const addNewProductForm = async (req, res) => {
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
            const newProd = await listOfProducts.addProduct(prod);
            res.send("Producto agregado: " + newProd);
              
        } else {
            console.log("Todos los campos deben estar completos.");    
        }
        req.body.reset;
    } catch (error) {
        console.log("addNewProduct Controller error: " + error);    
    }
    
 } */

export const updateProductByIdForm = async (req, res) => {
    try {
        let id = req.params.id;
        if (isNaN(id)){
            res.status(400).send({ error: 'El parámetro no es un número.'})    
        } else {
            let prod = await listOfProducts.getProductById(id);
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
            await listOfProducts.updateProductById(id, newProd);
            res.redirect('/api/products');
            /* res.send("Producto " + newProd.id + " actualizado. ") */
        }
        
    } catch (error) {
        console.log("Error en updateProductById: " + error);
    }
}

export const deleteProductById = async(req,res)=> {
    try {
        let id = parseInt(req.params.id);
        if (!isNaN(id)) {
            await listOfProducts.deleteById(id);
            res.redirect('/api/products');
        } else {
            res.status(400).send({ error: 'El parámetro no es un número.'}) 
        }
    } catch (error) {
        console.log("Error en deleProductById: " + error)
    }
}
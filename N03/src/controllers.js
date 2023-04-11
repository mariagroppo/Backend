import ProductManager from './productManager.js';
let listOfProducts = new ProductManager('./productos.txt');

export const getProducts = async (req, res) => {
    try {
        let { limit } = req.query;
        const arrayProductos = await listOfProducts.getProducts();
        if (!limit) {
            res.send(arrayProductos)
        } else {
            let newArray = [];
            for (let i=0; i<parseInt(limit); i++) {
                newArray.push(arrayProductos[i]);
            }
            res.send(newArray)
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
            res.send(`El producto con id ${req.params.pid} no existe.`)
        } else {
            res.send(product)
        }
    } catch (error) {
        console.log("getProducts controller error: " + error);
        res.send(null);
    }
}
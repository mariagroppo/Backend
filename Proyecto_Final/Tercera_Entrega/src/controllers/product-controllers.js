
import { productService } from '../services/repository.js';
import { validateLimit, validatePage } from '../../utils.js';

const getProducts = async (req, res) => {
    try {
        console.log("aca")
        let { limit, page, sort, category } = req.query;
        let validPage=await validatePage(page); //devuelve 1 si no está definida o mal definida.
        let validLimit = await validateLimit(limit); //devuelve 10 si está mal definido o el valor inicial si esta OK.
        if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
            sort=1; // de menor a mayor
        }
        let listado = await productService.getAll(validLimit,validPage,sort,category);
        let hasPrevPage = listado.value.hasPrevPage;
        let hasNextPage = listado.value.hasNextPage;
        let prevPage = listado.value.prevPage;
        let nextPage = listado.value.nextPage;
        if (listado.value.docs.length>0){
            res.send({status: 'success', message: "Products list ok", prods: listado.value.docs, productsExists: true, realTime: false, hasPrevPage, hasNextPage, prevPage, nextPage, validPage, validLimit, sort, category })
        } else {
            res.send({status: 'success', message: "No products added.", prods: listado.value, productsExists: false, realTime: false })
        }
        
    } catch (error) {
        res.send({status:'error', message: "getProducts Controller error: " + error})
    }
}

const addProduct = async (req, res) => {
    let userName = req.session.user.name;
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields= await productService.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnail, price, stock, category};
            const newProd = await productService.save(prod);
            res.sendSuccessMessage(newProd.message);
        } else {
            res.sendError(validateFields.message)    
        }
    } catch (error) {
        res.sendError("addProduct controller error");
    }
}

const getProductById = async (req, res) => {
    try {
        let product = await productService.getById(req.params.pid);
        res.send({ status: product.status, message: product.message, prod: product.value })
    } catch (error) {
        res.sendError("getProductById Controller error: " + error);
    }
}

const updateProductById = async (req, res) => {
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
        if (isNaN(id)){
            res.sendError("The ID must be a number.")        
        } else {
            await productService.updateById(newProd)
            res.sendSuccessMessage(`Product ${newProd.id} updated.`)
        }
    } catch (error) {
        res.sendError("updateProductById Controller error: " + error)        
    }
}

const deleteProductById = async(req,res)=> {
    try {
        let id = parseInt(req.params.id);
        let deleteProduct;
        if (!isNaN(id)) {
            deleteProduct = await productService.deleteById(id);
            res.send({status: deleteProduct.status, message: deleteProduct.message})
        } else {
            res.sendError('El parámetro no es un número.') 
        }
    } catch (error) {
        res.sendError("deleteProductById Controller error: " + error) 
    }
}

const addProductForm = async (req,res)=> {
    try {
        res.sendSuccessMessage("Ingrese la información del producto.")
    } catch (error) {
        res.sendError("Error addProductForm controller: " + error)
    }
}

export default {
    getProducts,
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById,
    addProductForm
}
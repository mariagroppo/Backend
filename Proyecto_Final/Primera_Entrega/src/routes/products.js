import express from 'express';
const router = express.Router();
import fs from 'fs';
import { userName, adminLicence } from '../server.js';

/* El usuario tiene acceso a la lista de productos unicamente.
El admin puede, además, acceder a la sección "Edición de productos". */

/* CLASSES ---------------------------------------------------------------------------- */
import ProductsFile from '../classes/productsList.js';
const productsList = new ProductsFile('./data/listProducts.txt')

/* GET Vista de todos los productos -------------------------------- */
router.get('/', (req, res) => {
    let listado = JSON.parse(fs.readFileSync('../Proyecto_Final/data/listProducts.txt', 'utf-8'));
    if (listado.length>0) {
        res.render('../views/main.hbs', { prods: listado, productsExists: true, user: userName, licence: adminLicence})
    } else {
        res.render('../views/main.hbs', { prods: listado, productsExists: false, user: userName , licence: adminLicence})
    }
})

/* GET Vista de formularios para administrador --------------------- */
router.get('/edicionProductos', (req, res) => {
    if (adminLicence) {
        res.render('../views/partials/formsAdmin.hbs', {user: userName, licence: adminLicence})
    } else {
        let answerError = { error: -1, description: "Ruta no autorizada"};
        console.log("Error: " + answerError.error + ". " + answerError.description)   
        res.render('../views/partials/formsAdmin.hbs', {user: userName, licence: adminLicence}) 
    }
})

/* POST Recibe y agrega un producto --------------------------------------------------------  */
router.post('/edicionProductos', (req, res) => {
    const {title, description, code, thumbnail, price, stock} = req.body;
    let validateFields=true;
    if (title === "") {
        validateFields=false;
    }
    if (description === "") {
        validateFields=false;
    }
    if (code === "") {
        validateFields=false;
    }
    if (thumbnail === "") {
        validateFields=false;
    }
    if (price === "") {
        validateFields=false;
    }
    if (stock === "") {
        validateFields=false;
    }

    if (validateFields === true) {
        const prod = {title, description, code, thumbnail, price, stock};
        productsList.save(prod);
        res.redirect('/api/productos/edicionProductos');    
    } else {
        console.log("Todos los campos deben estar completos.");    
    }
    req.body.reset;
 })

 /* DELETE 'api/productos -> elimina un producto segùn su id -------------------------------- */
 router.post('/delete', (req, res) => {
     let id = req.body.id;
     let validateFields=true;
     if (id === "") {
        validateFields=false;
     }

     if (validateFields === true) {
         if (isNaN(id)){
             res.status(400).send({ error: 'El parámetro no es un número.'})    
         } else {
             productsList.deleteById(id);
             res.redirect('/api/productos/edicionProductos');
         }
     } else {
        console.log("El campo ID debe estar completo.")   
     }
 })

/* GET 'api/productos/:id -> devuelve un producto segùn su id */
router.get('/:id', (req, res) => {
    let id = req.params.id;
    if (isNaN(id)){
        res.status(400).send({ error: 'El parámetro no es un número.'})    
    } else {
        let prod=productsList.getById(id);
        res.render('../views/partials/lookForId.hbs', { prod: prod, productsExists: true, user:userName, licence: adminLicence})
        
    }
})

/* PUT 'api/productos/:id' -> recibe y actualizA UN producto segun su id. */
router.post('/update', (req, res) => {
    const {id, newTitle, newDescription, newCode, newThumbnail, newPrice, newStock} = req.body;
    let validateFields=true;
    if (id === "") {
        validateFields=false;
    }

    if (validateFields === true) {
        const prod = {id, newTitle, newDescription, newCode, newThumbnail, newPrice, newStock};
        productsList.updateProducts(prod);
        res.redirect('/api/productos/edicionProductos');
    } else {
        console.log("El campo ID debe estar completo.");
    }

})

export default router;
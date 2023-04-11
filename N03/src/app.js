/* Desafio N03 */
import { getProductById, getProducts } from './controllers.js';
import express from 'express';

const app=express();
const PORT=8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`);
})

server.on("error", e=> console.log(`Error en el servidor ${e}`));
app.use(express.urlencoded({extended:true}));

/* Ruta get '/products' que devuelva un array con todos los productos disponibles en el servidor */
app.get('/products', getProducts)

/* Ruta get '/products/:pid' que devuelve solo el producto con Id elegido */
app.get('/products/:pid', getProductById)


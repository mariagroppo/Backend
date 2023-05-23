import ProductManager from '../classes/fs/productManager.js';
let listOfProducts = new ProductManager('./src/productos.txt');

import MessageMongoDB from "../classes/mongodb/chatMongoDB.js";
const chatMongo = new MessageMongoDB();

import { prodsMongo } from '../controllers/controllers.js';
import db from '../classes/database.js';

export default function socketProducts(socketServer){
    /* ON es el escuchador de eventos */
    socketServer.on('connection', async socket => {
        console.log('Un cliente se ha conectado || ' + new Date().toLocaleString());
        
        /* CARGA INICIAL --------------------------------------------------- */
        let list;
        let messages;
        if (db === 'fs') {
            list = await listOfProducts.getProducts();
        } else {
            list = await prodsMongo.getAll();
            messages = await chatMongo.getAll();
        }
        socketServer.emit('listOfProducts', list.value);
        socketServer.emit ('logs', messages.value);

        /* GESTION DE PRODUCTOS ------------------------------------------------ */
        socket.on('newProduct', async newProduct => {
            let list;
            let answer;
            if (db === 'fs'){
                answer = await listOfProducts.addProduct(newProduct);
                list = await listOfProducts.getProducts();
            } else {
                answer = await prodsMongo.save(newProduct);
                list = await prodsMongo.getAll();
            }
            socketServer.emit('listOfProducts', list.value);
        });
        
        socket.on('deleteProduct', async data=> {
            let list;
            if (db==='fs') {
                await listOfProducts.deleteById(data);
                list = await listOfProducts.getProducts();
            } else {
                await prodsMongo.deleteById(data);
                list = await prodsMongo.getAll();
            }
            socketServer.emit('listOfProducts', list.value);
        })

        /* CHAT ------------------------------------------------------------------------- */
        socket.on('msg', async msg =>{
            let answer;
            //console.log("Desde socket el msg:")
            //console.log(msg)
            if (db === 'fs') {

            } else {
                answer = await chatMongo.save(msg);
                //console.log(answer.message)
            }
            /* messages.push(data); */
            let messages = await chatMongo.getAll();
            socketServer.emit('logs', messages.value)
        })

        socket.on('authenticated', userData=> {
            /* Notifico a todos menos a mi */
            socket.broadcast.emit('newUserConnected', userData);
            /* users.push(data);
            console.log(users);
            socket.emit('users', users); */
        })

    })
}
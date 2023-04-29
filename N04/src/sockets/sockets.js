import ProductManager from '../classes/productManager.js';
let listOfProducts = new ProductManager('./src/productos.txt');

export default function socketProducts(socketServer){
    /* ON es el escuchador de eventos */
    socketServer.on('connection', async socket => {
        console.log('Un cliente se ha conectado || ' + new Date().toLocaleString());
    
/*         socket.on('msg', data => { */
            /* De esta manera le devuelve la respuesta a 1 socket.
            socket.emit('logs', data); */
            
            /* Si quiero mandar la respuesta a todos los sockets uso socketServer */
/*             socketServer.emit('logs', data);
        }) */
        let list = await listOfProducts.getProducts();
        socketServer.emit('listOfProducts', list);

        socket.on('newProduct', async newProduct => {
            await listOfProducts.addProduct(newProduct);
            let list = await listOfProducts.getProducts();
            socketServer.emit('listOfProducts', list);
        });
        
        socket.on('deleteProduct', async data=> {
            await listOfProducts.deleteById(data);
            let list = await listOfProducts.getProducts();
            socketServer.emit('listOfProducts', list);
        })

    })
}
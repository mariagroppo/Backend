import express from 'express';
import router from './src/routes/products.js';
import routerRealTime from './src/routes/realTime.js';
import routerChat from './src/routes/chat.js';
import routerCarts from './src/routes/carts.js';
import routerPersonal from './src/routes/personal.js';
import routerViews from './src/routes/views.js';
import __dirname from './utils.js';

const app=express();
const PORT=8080;

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/src/public'));
app.use('/api/products', router);
app.use('/api/realtimeproducts', routerRealTime);
app.use('/api/carts', routerCarts);
app.use('/api/chat', routerChat)
app.use('/api/personal', routerPersonal)
app.use('/views', routerViews)

/* CONFIGURACION DE HANDLEBARS ------------------------------------------------------------------ */
import { engine } from 'express-handlebars';
/* import Handlebars from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'; */
app.set('view engine', 'hbs');
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: './src/views/layouts', // Ruta de la plantilla principal
    partialsDir: './src/views/partials', // Ruta de las plantillas parciales
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
      }
} ));

/* MONGO DATABASE --------------------------------------------------------------------------------------------  */
import { connection } from "./src/dao/mongodb/config.js";
connection();

/* SOCKETS ----------------------------------------------------------------------------------------- */
import { Server } from 'socket.io';
import socketProducts from './src/sockets/sockets.js';

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`);
})

server.on("error", e=> console.log(`Error en el servidor ${e}`));
const socketServer = new Server(server); // socketServer sera un servidor para trabajar con sockets.

socketProducts(socketServer);
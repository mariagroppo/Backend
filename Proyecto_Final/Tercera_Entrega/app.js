import express from 'express';
import ViewsRouter from './src/routes/views.js';
//import ProductsRouter() from '';
//import CartsRouter() from '';
//import SessionRouter() from '';
//import ChatRouter() from '';
import RegisterRouter from './src/routes/user-register-router.js';
import __dirname from './utils.js';
import passport from 'passport';
import initializePassport from './src/passport/passport.js';
import config from './src/config/config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
const PORT = config.app.PORT;
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/src/public'));

/* SESSION ---------------------------------------------------------------------------------------- */
app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.URL,
        ttl: 120,
        collectionName: 'sessions'
    }),
    secret: config.app.SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
initializePassport();

//const sessionRouter = new SessionRouter();
const viewsRouter = new ViewsRouter();
//const productsRouter = new ProductsRouter();
//const cartsRouter = new CartsRouter();
//const chatRouter = new ChatRouter();
const registerRouter = new RegisterRouter();

app.use('/api/register', registerRouter.getRouter())
/* app.use('/api/login', routerlogin)
app.use('/api/restorePassword', routerRestore) */
//app.use('/api/products', productsRouter.getRouter());
//app.use('/api/carts', cartsRouter.getRouter());
//app.use('/api/chat', chatRouter.getRouter());
//app.use('/api/logout', routerlogout)
app.use('/', viewsRouter.getRouter());


/* CONFIGURACION DE HANDLEBARS ------------------------------------------------------------------ */
import { engine } from 'express-handlebars';
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
/* import { connection } from "./src/dao/mongodb/config.js";
connection(); */

/* SOCKETS ----------------------------------------------------------------------------------------- */
import { Server } from 'socket.io';
import socketProducts from './src/sockets/sockets.js';

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`);
})

server.on("error", e=> console.log(`Error en el servidor ${e}`));
const socketServer = new Server(server); // socketServer sera un servidor para trabajar con sockets.
socketProducts(socketServer);
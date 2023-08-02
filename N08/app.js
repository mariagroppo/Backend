import express from 'express';
import ViewsRouter from './src/routes/views-router.js';
import RegisterRouter from './src/routes/user-register-router.js';
import LoginRouter from './src/routes/user-login-router.js';
import OthersSessionRouter from './src/routes/user-others-router.js';
import ProductsRouter from './src/routes/products-router.js';
import CartsRouter from './src/routes/carts-router.js';
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
        ttl: 1200,
        collectionName: 'sessions'
    }),
    secret: config.app.SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
initializePassport();

const viewsRouter = new ViewsRouter();
const registerRouter = new RegisterRouter();
const loginRouter = new LoginRouter();
const otherSessionRouter = new OthersSessionRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
//const loggersRouter = new Loggers();

app.use('/api/register', registerRouter.getRouter());
app.use('/api/login', loginRouter.getRouter());
app.use('/api/others', otherSessionRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
//app.use('/api/chat', chatRouter.getRouter());
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

/* SOCKETS ----------------------------------------------------------------------------------------- */
import { Server } from 'socket.io';
import socketProducts from './src/sockets/sockets.js';

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port} usando express`);
})

server.on("error", e=> console.log(`Error en el servidor ${e}`));
const socketServer = new Server(server); // socketServer sera un servidor para trabajar con sockets.
socketProducts(socketServer);
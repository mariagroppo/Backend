import express from 'express';
import router from './src/routes/products.js';
import routerChat from './src/routes/chat.js';
import routerCarts from './src/routes/carts.js';
import routerSignin from './src/routes/signin.js';
import routerlogin from './src/routes/login.js';
import routerlogout from './src/routes/logout.js';
import routerRestore from './src/routes/restore.js';
import routerViews from './src/routes/views.js';
import __dirname from './utils.js';
import passport from 'passport';
import initializePassport from './src/passport/passport.js';

const app=express();
const PORT=8080;
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/src/public'));

/* SESSION ---------------------------------------------------------------------------------------- */
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true};
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://mariagroppo86:SwXTw96jwHQ2bZVT@codercluster.qg5m3ro.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions,
        ttl: 60,
        collectionName: 'sessions'
    }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 100000 }
}));

app.use(passport.initialize());
initializePassport();


app.use('/views', routerViews);
app.use('/api/signin', routerSignin)
app.use('/api/login', routerlogin)
app.use('/api/restorePassword', routerRestore)
app.use('/api/products', router);
app.use('/api/carts', routerCarts);
app.use('/api/chat', routerChat);
app.use('/api/logout', routerlogout)


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
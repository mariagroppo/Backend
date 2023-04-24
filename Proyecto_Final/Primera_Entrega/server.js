/* IMPORTACICONES -------------------------------------------------------------------- */
import express from 'express';
import router from './src/routes/products.js';
import routerCart from './src/routes/cart.js';

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* CONFIGURACION DE HANDLEBARS ----------------------------------------------------------- */
/* import { engine } from 'express-handlebars';
app.set('view engine', 'hbs');
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: './src/views/layouts', // Ruta de la plantilla principal
    partialsDir: './src/views/partials' // Ruta de las plantillas parciales
} )); */


/* ROUTERS ----------------------------------------------------------------------------------- */
app.use('/api/products', router);
app.use('/api/carts', routerCart);

/* SERVIDOR ------------------------------------------------------------------------------------  */
const puerto = 8080;
const server = app.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`);});
server.on('error', error => {console.log('error en el servidor:', error);});

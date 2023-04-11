import express from 'express';
export const app = express();

/* CONFIGURACION DE HANDLEBARS ----------------------------------------------------------- */
import { engine } from 'express-handlebars';
app.set('view engine', 'hbs');
app.engine('hbs',engine( {
    extname: '.hbs', // Extensión a utilizar
    defaultLayout: 'index.hbs', // Plantilla principal
    layoutsDir: './views/layouts', // Ruta de la plantilla principal
    partialsDir: './views/partials' // Ruta de las plantillas parciales
} ));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTERS ----------------------------------------------------------------------------------- */
import router from './routes/products.js';
import routerCart from './routes/cart.js';
app.use('/api/productos', router);
app.use('/api/cart', routerCart);
app.use(express.static("public"));

/* SERVIDOR ------------------------------------------------------------------------------------  */
const puerto = 8080;
const server = app.listen(puerto, () => {console.log(`servidor escuchando en http://localhost:${puerto}`);});
server.on('error', error => {console.log('error en el servidor:', error);});
export default server;

/* VARIABLE ADMINISTRADOR -------------------------------------------------------------------- */
let userName="admin";
let adminLicence=false;
if (userName === "admin") {
    adminLicence=true
}
export {adminLicence, userName};

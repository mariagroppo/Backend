import ProductManager from "./desafioN02.js";

/* ---------------- TEST -----------------------------------------*/
/* Se creará una instancia de la clase “ProductManager” */
let productManager = new ProductManager('listado.txt');
    
/* Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío [] */
console.log("Llamado a getProducts ----------------------");
console.log(await productManager.getProducts());

/* Se llamará al método “addProduct”. El objeto debe agregarse satisfactoriamente con un id generado
 automáticamente SIN REPETIRSE */
console.log("Se agrega nuevo producto -------------------");
const newProduct = {
    title: 'Producto nuevo', 
    description: 'nuevoooo',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25}
await productManager.addProduct(newProduct);

/* Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado */
console.log("Segundo llamado a getProducts ----------------------------------------------");
console.log(await productManager.getProducts());

/* Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error 
porque el código estará repetido. */
console.log("Se agrega 2do producto con mismo codigo -------------------------------------------");
const newProduct1 = {
    title: 'Producto nuevo', 
    description: 'nuevoooo',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25}
await productManager.addProduct(newProduct1);

/* Se agregan 2 productos Mas */
const newProduct2 = {
    title: 'Producto nuev 2', 
    description: 'nuevoooo 2',
    price: 300,
    thumbnail: 'Sin imagen',
    code: 'abc3445',
    stock: 25}

const newProduct3 = {
    title: 'Producto nuevo 3', 
    description: 'nuevoooo 333333333',
    price: 400,
    thumbnail: 'Sin imagen',
    code: 'abc1234',
    stock: 25}

await productManager.addProduct(newProduct2);
await productManager.addProduct(newProduct3);

console.log("Tercer llamado a getProducts ----------------------------------------------");
console.log(await productManager.getProducts());

/* Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso
 de encontrarlo */
console.log("Se pide ver productos por ID -----------------------------------------------");
await productManager.getProductById(2);
await productManager.getProductById(10);

/* Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, 
se evaluará que no se elimine el id y que sí se haya hecho la actualización. */
console.log("Actualización de producto 3.");
const updateProduct3 = {
    title: 'Titulo nuevo producto 3', 
    description: 'Descripcion del nuevo producto 3.',
    price: 1400,
    thumbnail: 'Sin imagen',
    code: 'abc1234',
    stock: 350}
await productManager.updateProductById(3, updateProduct3);
await productManager.updateProductById(10, updateProduct3);

console.log("Cuarto llamado a getProducts ----------------------------------------------");
console.log(await productManager.getProducts());

/* Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que
 arroje un error en caso de no existir. */
console.log("Se elimina el producto numero 2 ----------------------------------------------------------")
await productManager.deleteById(2);
await productManager.deleteById(10);
console.log("Quinto llamado a getProducts ----------------------------------------------");
console.log(await productManager.getProducts());


/* await productManager.deleteAll(); */
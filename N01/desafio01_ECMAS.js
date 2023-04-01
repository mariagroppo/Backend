
class ProductManager {
    
    /* Atributos */
    constructor () {
        this.listOfProducts = [];
    }

    getFullProduct = (product) => {
        const quantity = this.asignId();
        const newProd = {
            id: quantity,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock}
        return newProd;
    }

    /* Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos
    los productos creados hasta ese momento */
    getProducts = () => {
        return this.listOfProducts;
    } 

    asignId = () => {
        const list = this.getProducts();
        let maxId=0;
        if (list.length === 0) {
            maxId=1;
        } else {
            list.forEach(value => {
                if (value.id > maxId) {
                    maxId=value.id
                }
            })
            maxId=maxId+1;
        }
        /* console.log("ID asignado: " + maxId); */
        return maxId;
        
    }

    verifyCode = (code) => {
        const list = this.getProducts();
        for (let i=0; i<list.length; i++){
            if (list[i].code===code) {
                return false
            }
        }
        return true
    }
    /* Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
    Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    Al agregarlo, debe crearse con un id autoincrementable */
    addProduct = (product) => {
        const newProd = this.getFullProduct(product);
        const repeatCode = this.verifyCode(newProd.code);
        if (repeatCode){
            this.listOfProducts.push(newProd);
            console.log("Producto ", newProd.id, " agregado");
        } else if (!repeatCode) {
            console.log("El producto ", newProd.id, " no puede agregar por codigo repetido.")
        }
        
    } 

/*     Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida 
    con el id. En caso de no coincidir ningún id, mostrar en consola un error “Not found” */
    getProductById = (number) => {
        let a=[];
        let product = this.getProducts().find(prod => prod.id === number);
        if (!product) {
            console.log("Producto con id " + number + " no encontrado.")
            return a
        } else {
            console.log("Producto encontrado.");
            console.log(product);
        }
        return product
    } 

}


/* ---------------- TEST -----------------------------------------*/
/* Se creará una instancia de la clase “ProductManager” */
const productManager = new ProductManager();

/* Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío [] */
console.log("Llamado a getProducts ----------------------");
console.log(productManager.getProducts());

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
productManager.addProduct(newProduct);

/* Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado */
console.log("Segundo llamado a getProducts ----------------------");
console.log(productManager.getProducts());

/* Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error 
porque el código estará repetido. */
console.log("Se agrega 2do producto con mismo codigo -------------------");
const newProduct1 = {
    title: 'Producto nuevo', 
    description: 'nuevoooo',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25}
productManager.addProduct(newProduct1);

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

productManager.addProduct(newProduct2);
productManager.addProduct(newProduct3);

console.log("Tercer llamado a getProducts ----------------------");
console.log(productManager.getProducts());


/* Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso
 de encontrarlo */
console.log("Se pide ver productos por ID -----------------------");
productManager.getProductById(2);
productManager.getProductById(10);
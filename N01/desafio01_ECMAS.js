listOfProducts = [];

class ProductManager {
    
    /* Atributos */
    constructor (product) {
        this.title = product.title;
        this.price = product.price;
        this.thumbnail = product.thumbnail;
        this.code=product.code;
        this.stock=product.stock;
    }

    getFullProduct = () => {
        const quantity = listOfProducts.length;
        const newProd = {
            id: quantity+1,
            title: this.title,
            price: this.price,
            thumbnail: this.thumbnail,
            code: this.code,
            stock: this.stock}
        return newProd;
            
    }

    /* Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos
    los productos creados hasta ese momento */
    getProducts = () => {
        const contenido = listOfProducts;
        return contenido;
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
    addProduct = () => {
        const newProd = this.getFullProduct()
        const repeatCode = this.verifyCode(newProd.code);
        if (repeatCode){
            listOfProducts.push(newProd);
            console.log("Producto ", newProd.id, " agregado");
        } else if (!repeatCode) {
            console.log("El producto ", newProd.id, " no puede agregar por codigo repetido.")
        }
        
    } 

/*     Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida 
    con el id. En caso de no coincidir ningún id, mostrar en consola un error “Not found” */

    getProductById = (number) => {
        const list = this.getProducts();
        let a=[];
        for (let i=0; i<list.length; i++){
            if (list[i].id===number) {
                a= list[i]
            }
        }
        if (a.length===0){
            console.log("Not found");
        }
        return a
    } 

    deleteById = (number) => {
        const list = this.getProducts();
        const resultado = list.filter(i => i.id != number);
        listOfProducts=resultado;
    }

}

/* Creacion de objeto e invocacion de métodos */
const newProduct = {
    title: 'Producto nuevo', 
    description: 'nuevoooo',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25}

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
    code: 'abc123',
    stock: 25}

const product1 = new ProductManager (newProduct);
const product2 = new ProductManager (newProduct2);
const product3 = new ProductManager (newProduct3);
product1.getProducts();
product1.addProduct(newProduct);
product2.addProduct(newProduct2);
product3.addProduct(newProduct3);
product1.getProducts();

const a = product1.getProductById(1);
console.log(a)
const b = product1.getProductById(5);
console.log(b)

product1.deleteById(2)
//Se deben homologar los manager de FS para que los metodos se llamen de igual Forma
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = async (validLimit,page,sort,category) => {
        return this.dao.getAll(validLimit,page,sort,category);
    }

    getById = async (number) => {
        return this.dao.getById(number);
    }

    asignId = async () => {
        return this.dao.asignId();
    }

    repeatCode = async (code) => {
        return this.dao.repeatCode(code);
    }

    save = async (newProduct) => {
        return this.dao.save(newProduct);
    }

    deleteById = async (id) => {
        return this.dao.deleteById(id);
    }

    updateById = async (prod) => {
        return this.dao.updateById(prod);
    }

    validateFields =  async (product) => {
        return this.dao.validateFields(product);
    }
    
    fakerProducts = async(limit, page, sort) => {
        return this.dao.fakerProducts(limit, page, sort);
    }
}
//Se deben homologar los manager de FS para que los metodos se llamen de igual Forma
export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = async () => {
        return this.dao.getAll();
    }

    getById = async (number) => {
        return this.dao.getById(number);
    }

    asignId = async () => {
        return this.dao.asignId();
    }

    save = async () => {
        return this.dao.save();
    }

    deleteById = async (id) => {
        return this.dao.deleteById(id);
    }

    verifyProductIsCharged = async (idCart, id) => {
        return this.dao.verifyProductIsCharged(idCart, id);
    }

    addProductInCart = async (cid, id, quantity) => {
        return this.dao.addProductInCart(cid, id, quantity);
    }

    updateCart = async (cid, id, qty) => {
        return this.dao.updateCart(cid, id, qty);
    }

    deleteProduct = async (cid, id) => {
        return this.dao.deleteProduct(cid, id);
    }

    updateCartGlobal = async (cid, newData) => {
        return this.dao.updateCartGlobal(cid, newData);
    }

    updateCartGlobal2 = async (cid, newData) => {
        return this.dao.updateCartGlobal2(cid, newData);
    }

    closeCart = async (cid) => {
        return this.dao.closeCart(cid);
    }

    reopenCart = async (cid) => {
        return this.dao.reopenCart(cid);
    }
}
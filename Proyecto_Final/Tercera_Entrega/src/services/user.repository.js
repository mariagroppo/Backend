//Se deben homologar los manager de FS para que los metodos se llamen de igual Forma
export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    verifyMail = async (email) =>{
        return this.dao.verifyMail(email);
    }

    checkPassword = async (email, password) =>{
        return this.dao.checkPassword(email, password);
    }

    createUser = async (user) =>{
        return this.dao.createUser(user);
    }

    getUserByEmail = async (email) =>{
        return this.dao.getUserByEmail(email);
    }

    updateUserPassword = async (email) =>{
        return this.dao.updateUserPassword(email);
    }
}
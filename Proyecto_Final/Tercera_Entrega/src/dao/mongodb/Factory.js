import config from '../../config/config.js';
import { connection } from './config.js';
const persistence = config.app.PERSISTENCE;
// Esta “Fábrica” se encargará de devolver sólo el DAO que necesitemos acorde 
// con lo solicitado en el entorno o los argumentos. 

export default class PersistenceFactory {
    static async getPersistence() {
        let usersDAO;
        switch (persistence) {
            case 'MONGO':
                connection();
                const {default: UserManager} = await import ('../mongodb/managers/userManager.js')
                usersDAO = UserManager
            case 'FS':
                break
            }
        return usersDAO;
        }
}
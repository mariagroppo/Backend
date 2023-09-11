import usersControllers from '../controllers/users-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';
import uploader from '../services/uploader.js';

export default class UsersRouter extends BaseRouter {
    init() {
        //this.get('/', ['ADMIN'], privacy('NO_AUTHENTICATED'), usersControllers.listAllUsers)
        this.get('/', ['PUBLIC'], usersControllers.listAllUsers)
        
        //this.get('/lastConnections', ['ADMIN'], privacy('NO_AUTHENTICATED'), usersControllers.usersLastConnection)
        this.get('/lastConnections', ['PUBLIC'], usersControllers.usersLastConnection)

        //this.delete('/', ['ADMIN'], privacy('NO_AUTHENTICATED'), usersControllers.deleteUsersLastConnection)
        this.delete('/', ['PUBLIC'], usersControllers.deleteUsersLastConnection)

        //this.post('upload-premium-doc', ['USER'], , privacy('PRIVATE'), usersControllers.uploadPremiumDoc);
        this.post('/upload-premium-avatar', ['PUBLIC'], uploader.single('image'), usersControllers.uploadPremiumAvatar);
        //Accept a single file with the name fieldname. The single file will be stored in req.file.
        
        //this.post('/:uid/documents', ['USER'], , privacy('PRIVATE'), usersControllers.uploadPremiumDoc);
        this.post('/:uid/documents', ['PUBLIC'], uploader.any(), usersControllers.uploadPremiumDoc);
        //Accepts all files that comes over the wire. An array of files will be stored in req.files.


        ///api/users/premium/:uid



        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound)
    }
}
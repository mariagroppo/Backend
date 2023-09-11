import { userService } from "../services/repository.js";

const listAllUsers = async (req, res, next) => {
    try {
        const users = await userService.listUsers();
        const filteredArray = users.map((user) => ({
            name: user.first_name,
            email: user.userEmail,
            role: user.role,
          }));
        res.sendSuccessMessageAndValue("Users list OK", filteredArray);
    } catch (error) {
        res.sendErrorMessage("listAllUsers controller error: " + error)
    }
}

const usersLastConnection = async (req, res, next) => {
    try {
        const users = await userService.usersLastConnection();
        res.sendSuccessMessageAndValue(users.message, users.payload);
    } catch (error) {
        res.sendErrorMessage("deleteUsersLastConnection controller error: " + error)
    }
}

const deleteUsersLastConnection = async (req, res, next) => {
    try {
        const users = await userService.deleteUsersLastConnection();
        res.sendSuccessMessageAndValue(users.message, users.payload);
    } catch (error) {
        res.sendErrorMessage("deleteUsersLastConnection controller error: " + error)
    }
}

const updateUserRole = async (req, res, next) => {
    try {
        const {userEmail, role} = req.body;
        let id = req.params.pid;
        const newProd = {
            id: parseInt(id),
            title: title,
            description: description,
            thumbnail: thumbnail,
            price: price,
            stock: stock,
            category: category
        }
        if (isNaN(id)){
            req.info = {
                status: 'error',
                message: "The ID must be a number.",
            };
            next();       
        } else {
            const answer = await productService.updateById(newProd,userId);
            req.info = {
                status: answer.status,
                message: answer.message
            };
            next(); 
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "updateProductById Controller error: " + error,
        };
        next();        
    }
}

const uploadPremiumAvatar = async (req, res, next) => {
    try {
        console.log("esto?")
        console.log(req.file);

    } catch (error) {
        
    }
}


const uploadPremiumDoc = async (req, res, next) => {
    try {
        const filesUploaded = req.files;
        filesUploaded.forEach(element => {
            console.log("ELEMENTO -------------------------------------------------------")
            console.log(element);
        });

    } catch (error) {
        
    }
}

export default {
    listAllUsers,
    usersLastConnection,
    deleteUsersLastConnection,
    uploadPremiumDoc,
    uploadPremiumAvatar
}
import { validatePassword } from "../../../../utils.js";
import UserModel from "../models/userModel.js";
import { mailDeleteAccount } from "../../../mail/nodemailer.js";

class UserManager {
    
    listUsers= async () => {
        try {
            let users = await UserModel.find().lean();
            return users
        } catch (error) {
            return null
        }
    }

    verifyMail = async (email) => {
        try {
            let ok = await UserModel.findOne({userEmail: email}).lean();
            if (ok) {
                return true
            }
            return false
        } catch (error) {
            return true
        }
    }
  
    createUser = async (user) => {
        try {
            const verification = await this.verifyMail(user.userEmail);
            if (!verification) {
                const newUser = await UserModel.create(user);
                return { status: 'success', message: "User created ok.", value: newUser}
            }
            return { status: 'error', message: "User not created. Email already exists.", value: null}
        } catch (error) {
            return { status: 'error', message: "User not created - Error: " + error, value: null}
        }
    };

    checkPassword = async (email, password) => {
        try {
            let user = await UserModel.findOne({userEmail: email}).lean();
            if (user) {
                //console.log("El usuario existe")
                const isValidPassword = await validatePassword(password,user.hashedPassword);
                //if (password === user.inputPassword) {
                if (isValidPassword) {
                    return { status: 'success', message: "User logged in ok.", value: user}
                } else {
                    //res.status(400).send({status:'error', message: "User not logged in. Password incorrect."})
                    return { status: 'error', message: "User not logged in. Password incorrect.", value: null}
                }
            } else {
                return { status: 'error', message: "User not logged in. Email not found.", value: null}
            }
        } catch (error) {
            return { status: 'error', message: "User not logged in - Error: " + error, value: null}
        }
    };

    getUserByEmail = async (email) => {
        try {
            let user = await UserModel.findOne({userEmail: email}).lean();
            if (user) {
                return { status: 'success', message: "User founded.", value: user}
            } else {
                return { status: 'error', message: "User not founded.", value: null}
            }
        } catch (error) {
            return { status: 'error', message: "getUserByEmail Manager error: " + error, value: null}
        }
    }

    updateUserPassword = async (email, newHashedPassword) => {
        try {
            const answer = await UserModel.updateOne(
                {userEmail: email},
                {
                    $set: {hashedPassword: newHashedPassword}
                })
            if (answer.acknowledged === false) {
                return { status: 'error', message: "User password NOT updated."}
            } else {
                return { status: 'success', message: "User password updated."}
            }
        } catch (error) {
            return { status: 'error', message: "updateUserPassword Manager error: " + error}
        }
    }

    updateUserLastConnection = async (email) => {
        try {
            const last_connection = new Date().getTime();
            const answer = await UserModel.updateOne(
                {userEmail: email},
                {
                    $set: {last_connection: last_connection}
                })
            if (answer.acknowledged === false) {
                return { status: 'error', message: "User status NOT updated correctly."}
            } else {
                return { status: 'success', message: "User status updated."}
            }
        } catch (error) {
            return { status: 'error', message: "updateUserLastConnection Manager error: " + error}
        }
    }
    

    usersLastConnection = async () => {
        try {
            const users = await this.listUsers();
            const now = new Date().getTime();
            let connectionsArray=[];
            users.forEach(element => {
                let last = new Date(element.last_connection).getTime();
                let difference = (now - last) / (1000*60*60*24);
                let result = element.first_name + " not connected since: " + difference.toFixed(2) + " days."
                connectionsArray.push(result);
            });
            return { status: 'success', message: "User list OK.", payload: connectionsArray}
            //db.tu_coleccion.deleteOne({ campo: valor });
        } catch (error) {
            return { status: 'error', message: "usersLastConnection Manager error: " + error, payload: null}
        }
    }

    deleteUsersLastConnection = async () => {
        try {
            const users = await this.listUsers();
            const now = new Date().getTime();
            let deletedUsers = [];
            users.forEach(async (element) => {
                let last = new Date(element.last_connection).getTime();
                let difference = (now - last) / (1000*60*60*24);
                if (difference >= 10) {
                    //Borro usuario - Comente el codigo para que no sean borrados realmente.
                    /* const result = await UserModel.deleteOne({
                        _id: element._id
                    }) */
                    //if (result.acknowledged === true) {
                        deletedUsers.push(element);
                        await mailDeleteAccount(element);
                    //}
                }
            });
            return { status: 'success', message: "User deleted OK", payload: deletedUsers}
            //db.tu_coleccion.deleteOne({ campo: valor });
        } catch (error) {
            return { status: 'error', message: "deleteUsersLastConnection Manager error: " + error, payload: null}
        }
    }

    }

export default UserManager;
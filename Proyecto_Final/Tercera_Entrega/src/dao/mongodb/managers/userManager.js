import { validatePassword } from "../../../../utils.js";
import UserModel from "../models/userModel.js";

class UserManager {

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
        await UserModel.updateOne(
            {userEmail: email},
            {
                $set: {hashedPassword: newHashedPassword}
            })
        return { status: 'success', message: "User password updated."}
    } catch (error) {
        return { status: 'error', message: "updateUserPassword Manager error: " + error}
    }
  }
}


export default UserManager;
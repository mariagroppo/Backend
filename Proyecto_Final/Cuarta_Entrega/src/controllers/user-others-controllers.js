import { userService } from "../services/repository.js";
import { createHash, validatePassword } from "../../utils.js";
import crypto from 'crypto';
import { mailPwd } from "../mail/nodemailer.js";

const logout = async (req, res, next) => {
    try {
        if (req.session) {
            req.session.destroy();
        }
        res.status(200).send("Session closed.");
    } catch (error) {
        res.sendErrorMessage("Logout error: " + error)
    }
    
}

const current = async(req,res, next) =>{
    try {
        res.status(200).send(req.session.user);
    } catch (error) {
        res.sendErrorMessage("Current error: " + error)
    }
}


const changePwdForm = async (req, res, next) => {
    try {
        res.status(200).send('Ingrese su actualPassword y newPassword.');
    } catch (error) {
        res.sendErrorMessage("changePwdForm error: " + error)
    }
}

const changePwd = async (req, res, next) => {
    let userEmail = req.session.user.email;
    const user = (await userService.getUserByEmail(userEmail)).value;
    try {
        let { actualPassword, newPassword } = req.body;
        //1° Verifico que la pwd actual este bien ingresada.
            const isSamePassword = await validatePassword(actualPassword, user.hashedPassword);
            if(isSamePassword) {
                //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
                const isSamePassword2 = await validatePassword(newPassword, user.hashedPassword);
                if(isSamePassword2) {
                    res.sendErrorMessage("Cannot replace password. Please define a different one.")
                } else {
                    const newHashedPassword = await createHash(newPassword);
                    let answer = await userService.updateUserPassword(userEmail, newHashedPassword);
                    res.sendStatusAndMessage(answer.status,answer.message);
                }
            } else {
                res.sendErrorMessage("The actual password is not correct.")
            }
    } catch (error) {
        res.sendErrorMessage("changePwd controller error: " + error)
    }
}

const restorePwdForm = async (req, res, next) => {
    try {
        res.status(200).send('Please complete your email.');
    } catch (error) {
        res.sendErrorMessage("restorePwdForm controller error: " + error)
    }
}

const restorePassword = async (req, res, next) => {
    try {
        let { userEmail } = req.body;
        if(!userEmail) {
            res.sendErrorMessage("Please insert a valid email.")
        }
        const user = await userService.getUserByEmail(userEmail);
        let userId = user._id;
        if(!user) {
            res.sendErrorMessage("The email charged is not registered in this ecommerce.")
        } else {
            const token = crypto.randomBytes(32).toString('hex');
            //const resetTokens[userId] = token;
            await mailPwd(userEmail, token);
            res.status(200).send("The email to change password was sent.");
        }
        
    } catch (error) {
        res.sendErrorMessage("restorePassword controller error: " + error)
    }
}


export default {
    logout,
    current,
    changePwdForm,
    changePwd,
    restorePwdForm,
    restorePassword
}
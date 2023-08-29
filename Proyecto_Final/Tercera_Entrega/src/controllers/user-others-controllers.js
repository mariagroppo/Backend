import { userService } from "../services/repository.js";
import { createHash, validatePassword } from "../../utils.js";
import crypto from 'crypto';
import { mailPwd } from "../mail/nodemailer.js";

const logout = async (req, res, next) => {
    try {
        if (req.session) {
            req.session.destroy();
        }
        req.info = {
            status: 'success',
            message: "Session closed."
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "Logout error: " + error
        };
        next();
    }
    
}

const current = async(req,res, next) =>{
    try {
        req.info = {
            status: 'success',
            message: req.session.user
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "Current error: " + error
        };
        next();
    }
}


const changePwdForm = async (req, res, next) => {
    try {
        req.info = {
            status: 'success',
            message: 'Ingrese su actualPassword y newPassword.'
        };
        next();

    } catch (error) {
        req.info = {
            status: 'error',
            message: "changePwdForm controller error: " + error
        };
        next();
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
                    req.info = {
                        status: 'error',
                        message: "Cannot replace password. Please define a different one."
                    };
                    next();
                } else {
                    const newHashedPassword = await createHash(newPassword);
                    let answer = await userService.updateUserPassword(userEmail, newHashedPassword);
                    req.info = {
                        status: answer.status,
                        message: answer.message
                    };
                    next();
                }
            } else {
                req.info = {
                    status: 'error',
                    message: "The actual password is not correct."
                };
                next();
            }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "changePwd controller error: " + error
        };
        next();
    }
}

const restorePwdForm = async (req, res, next) => {
    try {
        req.info = {
            status: 'success',
            message: 'Please complete your email.'
        };
        next();

    } catch (error) {
        req.info = {
            status: 'error',
            message: "restorePwdForm controller error: " + error
        };
        next();
    }
}

const restorePassword = async (req, res, next) => {
    try {
        let { userEmail } = req.body;
        if(!userEmail) {
            req.info = {
                status: 'error',
                message: "Please insert a valid email."
            };
            next();
        }
        const user = await userService.getUserByEmail(userEmail);
        let userId = user._id;
        if(!user) {
            req.info = {
                status: 'error',
                message: "The email charged is not registered in this ecommerce."
            };
            next();
        } else {
            const token = crypto.randomBytes(32).toString('hex');
            //const resetTokens[userId] = token;
            await mailPwd(userEmail, token);
            req.info = {
                status: 'success',
                message: "The email to change password was sent."
            };
            next();
        }
        
    } catch (error) {
        req.info = {
            status: 'error',
            message: "restorePassword controller error: " + error
        };
        next();
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
import { createHash, validatePassword } from "../../utils.js";
import { userService } from "../services/repository.js";

const logout = async (req, res) => {
    try {
        let userStatus=false;
        if (req.session) {
            req.session.destroy();
        }
        req.logger.log("info",`Bye Bye! See you later!.`);
        res.render('../src/views/main.hbs', {userStatus});
    } catch (error) {
        req.logger.log("error",'Logout controller error: ' + error);
        res.RenderInternalError("Logout controller error.", false)
    }
}

const restorePasswordForm = async (req, res) => {
    try {
        req.logger.log("info",`Restoring password proccess ends successfully!.`);
        res.render('../src/views/partials/session-restorePwd.hbs')
    } catch (error) {
        req.logger.log("error",'restorePasswordForm controller error: ' + error);
        res.RenderInternalError("restorePasswordForm controller error", false)
    }
}

const restorePassword = async (req, res) => {
    try {
        let { userEmail, newPassword } = req.body;
        //1° Verifico si el correo esta registrado.
        const user = (await userService.getUserByEmail(userEmail)).value;
        if (!user) {
            req.logger.log("warning", `Email ${userEmail} not registered.`);
            res.RenderInternalError(`Email ${userEmail} not registered.`, false);
        } else {
            //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
            const isSamePassword = await validatePassword(newPassword, user.hashedPassword);
            if(isSamePassword) {
                req.logger.log("warning", "Cannot replace password. Please define a different one.");
                res.RenderInternalError("Cannot replace password. Please define a different one.", false)
            } else {
                const newHashedPassword = await createHash(newPassword);
                let a = await userService.updateUserPassword(userEmail, newHashedPassword);
                req.logger.log("info", a.message);
                res.render('../src/views/partials/error.hbs', { message: a.message})
            }

        }
    } catch (error) {
        req.logger.log("error",'restorePassword controller error: ' + error);
        res.RenderInternalError("restorePassword controller error", false)
    }
}


export default {
    logout,
    restorePasswordForm,
    restorePassword
}
import { createHash, validatePassword } from "../../utils.js";
import { userService } from "../services/repository.js";

const logout = async (req, res) => {
    try {
        let userStatus=false;
        if (req.session) {
            req.session.destroy();
        }
        res.render('../src/views/main.hbs', {userStatus});
    } catch (error) {
        res.RenderInternalError("Logout controller error.", false)
    }
}

const restorePasswordForm = async (req, res) => {
    try {
        res.render('../src/views/partials/session-restorePwd.hbs')
    } catch (error) {
        res.RenderInternalError("restorePasswordForm controller error", false)
    }
}

const restorePassword = async (req, res) => {
    try {
        let { userEmail, newPassword } = req.body;
        //1° Verifico si el correo esta registrado.
        const user = (await userService.getUserByEmail(userEmail)).value;
        if (!user) {
            res.RenderInternalError("Email not registered.", false);
        } else {
            //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
            const isSamePassword = await validatePassword(newPassword, user.hashedPassword);
            if(isSamePassword) {
                res.RenderInternalError( "Cannot replace password. Please define a different one.", false)
            } else {
                const newHashedPassword = await createHash(newPassword);
                let a = await userService.updateUserPassword(userEmail, newHashedPassword);
                res.render('../src/views/partials/error.hbs', { message: a.message})
            }

        }
    } catch (error) {
        res.RenderInternalError("restorePassword controller error", false)
        //res.render('../src/views/partials/error.hbs', { message: "restorePassword controller error: " + error })
    }
}


export default {
    logout,
    restorePasswordForm,
    restorePassword
}
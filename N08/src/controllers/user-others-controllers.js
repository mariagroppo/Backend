import { userService } from "../services/repository.js";
import { createHash, validatePassword } from "../../utils.js";

const logout = async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy();
        }
        res.sendSuccessMessage("Session closed.")
    } catch (error) {
        res.sendError("Logout error: " + error)
    }
}

const restorePassword = async (req, res) => {
    try {
        let { userEmail, newPassword } = req.body;
        //1° Verifico si el correo esta registrado.
        const user = (await userService.getUserByEmail(userEmail)).value;
        if (!user) {
            res.sendError("Email not registered.");
        } else {
            //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
            const isSamePassword = await validatePassword(newPassword, user.hashedPassword);
            if(isSamePassword) {
                res.sendError("Cannot replace password. Please define a different one.")
            } else {
                const newHashedPassword = await createHash(newPassword);
                let a = await userService.updateUserPassword(userEmail, newHashedPassword);
                res.sendSuccessMessage(a.message)
            }
        }
    } catch (error) {
        res.sendError({status:'error', message:"restorePassword controller error: " + error})
    }
}

export default {
    logout,
    restorePassword
}
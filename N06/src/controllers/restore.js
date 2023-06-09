import { users } from "./session.js";
import { createHash, validatePassword } from "../../utils.js";

export const restorePasswordForm = async (req, res) => {
    try {
        res.render('../src/views/partials/restorePassword.hbs')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "restorePasswordForm controller error: " + error })
    }
}

export const restorePassword = async (req, res) => {
    try {
        let { userEmail, newPassword } = req.body;
        //1° Verifico si el correo esta registrado.
        const user = (await users.getUserByEmail(userEmail)).value;
        if (!user) {
            res.status(400).render('../src/views/partials/error.hbs', { message: "Email not registered."})
        } else {
            //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
            const isSamePassword = await validatePassword(newPassword, user.hashedPassword);
            //console.log(isSamePassword);
            if(isSamePassword) {
                res.status(400).render('../src/views/partials/error.hbs', { message: "Cannot replace password. Please define a different one."})
            } else {
                const newHashedPassword = await createHash(newPassword);
                let a = await users.updateUserPassword(userEmail, newHashedPassword);
                res.status(400).render('../src/views/partials/error.hbs', { message: a.message})
            }

        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "restorePassword controller error: " + error })
        //console.log("ERROR" + error);
    }
}

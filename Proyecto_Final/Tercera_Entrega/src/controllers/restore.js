import { users } from "./session.js";
import { createHash, validatePassword } from "../../utils.js";

export const restorePassword = async (req, res) => {
    try {
        let { userEmail, newPassword } = req.body;
        //1° Verifico si el correo esta registrado.
        const user = (await users.getUserByEmail(userEmail)).value;
        if (!user) {
            res.send({status:'error', message:"Email not registered."})
        } else {
            //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
            const isSamePassword = await validatePassword(newPassword, user.hashedPassword);
            if(isSamePassword) {
                res.send({status:'error', message:"Cannot replace password. Please define a different one."})
            } else {
                const newHashedPassword = await createHash(newPassword);
                let a = await users.updateUserPassword(userEmail, newHashedPassword);
                res.send({status:'success', message: a.message})
            }
        }
    } catch (error) {
        res.send({status:'error', message:"restorePassword controller error: " + error})
    }
}

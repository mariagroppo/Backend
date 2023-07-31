export const loginForm = async (req, res) => {
    try {
        res.sendSuccessMessage("Please login with yout email and password.")
    } catch (error) {
        res.sendError("Login init error: " + error);
    }
}

export const login = async (req, res) => {
    try {
        req.session.user = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
        res.sendSuccessMessage("You login successfully!!!")
    } catch (error) {
        res.sendError("Login error: " + error);
    }
}

export const loginFail = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    res.sendError(req.session.messages[c-1])
}

export default {
    loginForm,
    login,
    loginFail
}
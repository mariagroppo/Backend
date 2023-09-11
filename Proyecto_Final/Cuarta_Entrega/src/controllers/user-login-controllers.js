export const loginForm = async (req, res, next) => {
    try {
        res.status(200).send("Please login with your email and password.");
    } catch (error) {
        res.sendErrorMessage("loginForm controller error: " + error)
    }
}

export const login = async (req, res, next) => {
    try {
        req.session.user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        };
        res.status(200).send("You login successfully!!!");
    } catch (error) {
        res.sendErrorMessage("login controller error: " + error)
    }
}

export const loginFail = async (req, res, next) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    res.sendErrorMessage(req.session.messages[c-1]);
}

export default {
    loginForm,
    login,
    loginFail
}
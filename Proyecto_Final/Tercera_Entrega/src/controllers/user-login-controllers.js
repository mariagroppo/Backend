export const loginForm = async (req, res, next) => {
    try {
        req.info = {
            status: 'success',
            message: "Please login with your email and password."
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "Login init error: " + error
        };
        next();
    }
}

export const login = async (req, res, next) => {
    try {
        req.session.user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
        //console.log(req.user)
        req.info = {
            status: 'success',
            message: "You login successfully!!!"
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "Login error: " + error
        };
        next();
    }
}

export const loginFail = async (req, res, next) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    req.info = {
        status: 'error',
        message: req.session.messages[c-1]
    };
    next();
}

export default {
    loginForm,
    login,
    loginFail
}
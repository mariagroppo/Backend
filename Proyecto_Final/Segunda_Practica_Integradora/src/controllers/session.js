import UserManager from "../dao/mongodb/userManager.js";
export const users = new UserManager();

export const signInForm = async (req, res) => {
    try {
        res.send({status:'success', message: "Post the neccesary user information."})
    } catch (error) {
        res.send({status:'error', message: "signInForm controller error: " + error})
    } 
}

export const signIn = async (req, res) => {
    if (req.user) {
        res.send({ status: 'success', message: req.session.message})
    }
}

export const signInFailed = async (req, res) => {
    res.send({ status: 'error', message: "Signin error: " + req.session.message})
}

export const loginForm = async (req, res) => {
    try {
        res.send({status:'success', message: "Please login with yout email and password."})
    } catch (error) {
        res.send({ status:'error', message: "Login init error: " + error});
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
        res.send({status:'success', message: "You login successfully!!!"})
    } catch (error) {
        res.send({ status:'error', message: "Login error: " + error});
    }
}

export const loginFailed = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    res.send({ message: req.session.messages[c-1] })
}

export const logout = async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy();
        }
        res.send({status: 'success', message: "Session closed."})
    } catch (error) {
        res.send({status: 'error', message: "Logout error: " + error})
    }
}

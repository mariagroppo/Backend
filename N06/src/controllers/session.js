import UserManager from "../dao/mongodb/userManager.js";
export const users = new UserManager();

export const signInForm = async (req, res) => {
    try {
        res.render('../src/views/partials/signin.hbs', { userStatus: false})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getSignInForm controller error: " + error , userStatus: false})
    } 
}

export const signIn = async (req, res) => {
    if (req.user) {
        res.render('../src/views/partials/login.hbs', { message: req.session.message , userStatus: false})
    }
}

export const signInFailed = async (req, res) => {
    res.render('../src/views/partials/error.hbs', { message: req.session.message , userStatus: false}) 
}

export const loginForm = async (req, res) => {
    try {
        res.render('../src/views/partials/login.hbs', { userStatus: false})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getLoginForm controller error: " + error , userStatus: false})
    }
}

export const login = async (req, res) => {
    req.session.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    }
    res.redirect('/api/products')
}

export const loginFailed = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    res.render('../src/views/partials/error.hbs', { message: req.session.messages[c-1] , userStatus: false}) 
}

export const logout = async (req, res) => {
    try {
        let userStatus=false;
        if (req.session) {
            req.session.destroy();
        }
        res.render('../src/views/main.hbs', {userStatus});
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "logout session error: " + error , userStatus: false})
    }
}

export const githubCallback = async (req, res) => {
    try {
        console.log(req.user)
        const user = req.user;
        req.session.user = {
            name: user.first_name,
            email: user.userEmail,
            role: req.user.role
        }
        console.log("logueado con github")
        res.redirect('/api/products')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "githubCallback error", userStatus: false})
    }
}
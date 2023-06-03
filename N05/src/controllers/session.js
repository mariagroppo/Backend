import UserManager from "../dao/mongodb/userManager.js";
const users = new UserManager();

export const signInForm = async (req, res) => {
    try {
        res.render('../src/views/partials/signin.hbs', { userStatus: false})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getSignInForm controller error: " + error , userStatus: false})
    } 
}

export const signIn = async (req, res) => {
    try {
        const {first_name, last_name, inputPassword, userEmail } = req.body;
        if (userEmail !== "adminCoder@coder.com"){
            const result = await users.createUser(req.body);
            if (result.status === 'success') {
                res.render('../src/views/partials/login.hbs', { message: result.message , userStatus: false})
            } else {
                res.render('../src/views/partials/error.hbs', { message: result.message , userStatus: false})   
            }
        } else {
            res.render('../src/views/partials/error.hbs', { message: "Email ingresado no permitido. Corresponde al administrador." , userStatus: false})
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getSignIn controller error: " + error , userStatus: false})
    }
}

export const loginForm = async (req, res) => {
    try {
        res.render('../src/views/partials/login.hbs', { userStatus: false})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getLoginForm controller error: " + error , userStatus: false})
    }
}

export const login = async (req, res) => {
    try {
        const { userEmail, inputPassword } = req.body;
        if (userEmail === "adminCoder@coder.com" && inputPassword === "123456") {
            req.session.user = {
                name: "Coder admin",
                email: userEmail,
                role: 'admin'
              };
            res.redirect('/api/products');
        } else {
            const userLogin = await users.checkPassword(userEmail, inputPassword);
            if (userLogin.status === "success") {
                req.session.user = {
                    name: `${userLogin.value.first_name} ${userLogin.value.last_name}`,
                    email: userLogin.value.userEmail
                  };
                //console.log(req.session)
                res.redirect('/api/products');
                
            } else {
                res.render('../src/views/partials/error.hbs', { message: userLogin.message , userStatus: false})
            }
        }
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "Login controller error: " + error , userStatus: false})
    }
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
const registerForm = async (req, res, next) => {
    try {
        req.info = {
            status: 'success',
            message: "For the registration process you need to send the folloging information: first_name, last_name, userEmail, inputPassword."
        };
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "registerForm controller error: " + error
        };
        next();
    } 
};

const register = async (req, res, next) => {
    try {
        if (req.user) {
            req.info = {
                status: 'success',
                message: "User registered OK."
            };
        } else {
            req.info = {
                status: 'success',
                message: "User not registered."
            };
        }
        next();
    } catch (error) {
        req.info = {
            status: 'error',
            message: "register controller error: " + error
        };
        next();
    }
}

const registerFail = async (req, res, next) => {
    req.info = {
        status: 'error',
        message: "Error proceso de registro!"
    };
    next();
}

export default {
    registerForm,
    register,
    registerFail
}
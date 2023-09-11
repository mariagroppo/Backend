const registerForm = async (req, res) => {
    try {
        const options = {
            status: 'success',
            message: "For the registration process you need to send the folloging information: first_name, last_name, userEmail, inputPassword."
        }
        res.status(200).send(options);
    } catch (error) {
        res.sendErrorMessage("registerForm controller error: " + error)
    } 
};

const register = async (req, res) => {
    try {
        let message;
        let status;
        if (req.user) {
            message = "User registered OK.";
            status=200;
        } else {
            message = "User NOT registered.";
            status=400;
        }
        const options = {
            status: 'success',
            message: message,
        }
        res.status(status).send(options);
    } catch (error) {
        res.sendErrorMessage("register controller error: " + error)
    }
}

const registerFail = async (req, res) => {
    res.sendErrorMessage("Error en proceso de registro")
}

export default {
    registerForm,
    register,
    registerFail
}
const registerForm = async (req, res) => {
    try {
        res.render('../src/views/partials/session-register.hbs', { userStatus: false})
    } catch (error) {
        res.renderInternalError('registerForm controller error.', false)
    } 
}

const register = async (req, res) => {
    try {
        let message;
        let status;
        if (req.user) {
            message = "User registered OK.";
            status=200;
        } else {
            message = "User NOT registered correctly.";
            status=400;
        }
        const options = {
            status: 'success',
            message: message,
        }
        if (options.status === 'success') {
            res.redirect('/login')
        } else {
            res.renderInternalError(options.message, false)
        }
    } catch (error) {
        res.renderInternalError('register controller error.', false)
    }
}

const registerFailed = async (req, res) => {
    res.renderInternalError("Registration process error.", false)
}

export default {
    registerForm,
    register,
    registerFailed
}
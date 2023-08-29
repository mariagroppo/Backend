const registerForm = async (req, res) => {
    try {
       if (req.info.status === "error") {
            res.RenderInternalError(req.info.message, false)
        } else {
            res.render('../src/views/partials/session-register.hbs', { userStatus: false})
        }
    } catch (error) {
        res.renderInternalError('registerForm controller error.', false)
    } 
}

const register = async (req, res) => {
    try {
        if (req.info.status === 'success') {
            res.redirect('/login')
        } else {
            res.renderInternalError(req.info.message, false)
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
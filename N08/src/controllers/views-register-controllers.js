const registerForm = async (req, res) => {
    try {
        res.render('../src/views/partials/session-register.hbs', { userStatus: false})
    } catch (error) {
        req.logger.log("error",'registerForm controller error.')
        res.RenderInternalError('registerForm controller error.', false)
    } 
}

const register = async (req, res) => {
    try {
        req.logger.log("info",`The registration process ends successfully!.`);
        res.redirect('/login')
    } catch (error) {
        req.logger.log("error",'register controller error.')
        res.RenderInternalError('register controller error.', false)
    }
}

const registerFailed = async (req, res) => {
    let c = req.session.messages.length;
    req.logger.log("error",req.session.messages[c-1])
    res.RenderInternalError(req.session.messages[c-1], false)
}

export default {
    registerForm,
    register,
    registerFailed
}
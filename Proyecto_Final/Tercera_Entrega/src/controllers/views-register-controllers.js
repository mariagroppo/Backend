const registerForm = async (req, res) => {
    try {
        res.render('../src/views/partials/session-register.hbs', { userStatus: false})
    } catch (error) {
        res.RenderInternalError('registerForm controller error.', false)
    } 
}

const register = async (req, res) => {
    try {
        res.redirect('/login')
    } catch (error) {
        res.RenderInternalError('register controller error.', false)
    }
}

const registerFailed = async (req, res) => {
    //console.log(req.session.messages)
    let c = req.session.messages.length;
    res.RenderInternalError(req.session.messages[c-1], false)
}

export default {
    registerForm,
    register,
    registerFailed
}
const loginForm = async (req, res) => {
    try {
        res.status(200).render('../src/views/partials/session-login.hbs', { userStatus: false})
    } catch (error) {
        res.renderInternalError('getLoginForm controller error.', false)
    }
}

const login = async (req, res) => {
    try {
        res.status(200).redirect('/products',)
    } catch (error) {
        res.renderInternalError('login controller error.', false)
    }
}

const loginFailed = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    //res.sendInternalError(error, req.session.messages[c-1], false)
    res.renderInternalError(req.session.messages[c-1], false)
}

const githubCallback = async (req, res) => {
    try {
        const user = req.user;
        req.session.user = {
            name: user.first_name,
            email: user.userEmail,
            role: req.user.role
        }
        //console.log("logueado con github")
        res.redirect('/products')
    } catch (error) {
        res.RenderInternalError("githubCallback error", false)
    }
}

export default {
    loginForm,
    login,
    loginFailed,
    githubCallback
}
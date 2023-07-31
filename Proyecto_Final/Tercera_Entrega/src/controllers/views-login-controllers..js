const loginForm = async (req, res) => {
    try {
        res.render('../src/views/partials/session-login.hbs', { userStatus: false})
    } catch (error) {
        res.RenderInternalError('getLoginForm controller error.', false)
    }
}

const login = async (req, res) => {
    try {
        //console.log(req.session.user)
        req.session.user = {
            name: req.user.name,
            role: req.user.role,
            id: req.user.id,
            email: req.user.email
        }
        res.redirect('/',)
    } catch (error) {
        res.RenderInternalError('login controller error.', false)
    }
}

const loginFailed = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    //res.sendInternalError(error, req.session.messages[c-1], false)
    res.RenderInternalError(req.session.messages[c-1], false)
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
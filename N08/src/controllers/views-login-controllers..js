const loginForm = async (req, res) => {
    try {
        req.logger.log("http",`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
        res.render('../src/views/partials/session-login.hbs', { userStatus: false})
    } catch (error) {
        req.logger.log("error",'getLoginForm controller error: ' + error)
        res.RenderInternalError('getLoginForm controller error: ' + error, false)
    }
}

const login = async (req, res) => {
    try {
        req.session.user = {
            name: req.user.name,
            role: req.user.role,
            id: req.user.id,
            email: req.user.email
        }
        req.logger.log("info",`The login process ends successfully!.`);
        res.redirect('/',)
    } catch (error) {
        req.logger.log("error",'login controller error.')
        res.RenderInternalError('login controller error.', false)
    }
}

const loginFailed = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    let c = req.session.messages.length;
    req.logger.log("error",req.session.messages[c-1])
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
        req.logger.log("info",`The GitHub login process ends successfully!.`);
        res.redirect('/products')
    } catch (error) {
        req.logger.log("error", "githubCallback controller error")
        res.RenderInternalError("githubCallback controller error", false)
    }
}

export default {
    loginForm,
    login,
    loginFailed,
    githubCallback
}
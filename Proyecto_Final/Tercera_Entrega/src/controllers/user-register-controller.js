const registerForm = async (req, res) => {
    res.sendSuccess("For the registration process you need to send the folloging information: first_name, last_name, userEmail, inputPassword.")
}

const register = async (req, res) => {
    if (req.user) {
        res.sendSuccess(req.message)
    }
}

const registerFail = async (req, res) => {
    res.sendError("Register process error (Controller): " + req.body)

}

const pageNotFound = async (req, res) => {
    res.sendNotFound("Page not found.")
}

export default {
    registerForm,
    register,
    registerFail,
    pageNotFound
}
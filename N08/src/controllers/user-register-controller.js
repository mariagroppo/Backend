const registerForm = async (req, res) => {
    res.sendSuccessMessage("For the registration process you need to send the folloging information: first_name, last_name, userEmail, inputPassword.")
}

const register = async (req, res) => {
    if (req.user) {
        res.sendSuccessMessage("User created OK.")
    }
}

const registerFail = async (req, res) => {
    res.sendError("Register process error (Controller): " + req.error)

}

export default {
    registerForm,
    register,
    registerFail
}
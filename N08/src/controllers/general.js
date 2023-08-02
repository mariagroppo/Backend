const pageNotFound = async (req, res) => {
    res.sendNotFound("Page not found.")
}

const views_pageNotFound = async (req, res) => {
    try {
        res.render('../src/views/partials/session-register.hbs', { userStatus: false})
    } catch (error) {
        if (req.user) {
            return res.RenderInternalError('registerForm controller error.', true)
        } else {
            return res.RenderInternalError('registerForm controller error.', false)
        }

    } 
}

export default {
    pageNotFound,
    views_pageNotFound
}
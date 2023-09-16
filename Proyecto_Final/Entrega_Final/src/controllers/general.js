const pageNotFound = async (req, res) => {
    res.sendErrorMessage("Page not found. " + req.url);
}

const views_pageNotFound = async (req, res) => {
    let userName = req.session.user.name;
    try {
        res.render('../src/views/partials/pageNotFound.hbs', { userStatus: true, userName});
    } catch (error) {
        if (req.user) {
            return res.renderInternalError('registerForm controller error.', true)
        } else {
            return res.renderInternalError('registerForm controller error.', false)
        }

    } 
}

export default {
    pageNotFound,
    views_pageNotFound
}
export const getProducts = async (req, res) => {
    try {
        let userName = req.session.user.name;
        let userStatus=false;
        if (userName !== ""){
            userStatus = true;
        }
        res.render('../src/views/partials/realTime.hbs', {userName, userStatus})
    } catch (error) {
        /* console.log("getProducts Real Time controller error: " + error); */
        res.render('../src/views/partials/error.hbs', { message: "getProducts Controller Real Time error: " + error, userName, userStatus})
    }
}

export default function auth(req, res, next){
    if ((req.session?.user.name !== undefined) && (req.session?.user.name !== "")) {
        return next();
    }
    res.send({status: "error", message: "Session closed. Please login again."})
}

export const auth2 = async (req, res, next) => {
    if (!req.session?.user) {
        return next();
    }
    res.send({message: "Session still opened: " + req.session.user.name})
}

export const auth3 = async (req, res, next) => {
    //if (req.session.user !== undefined) {
    if ((req.session.user !== undefined) && (req.session.user !== "")) {
        return next();
    }
    return res.render('../src/views/partials/error.hbs', { message: "Session closed. Please login again.", userStatus: false})
}

export const auth4 = async (req, res, next) => {
    if (!req.session?.user) {
        //console.log("entre auth4")
        return next();
    }
    return res.redirect('/views/products')
    //return res.render('../src/views/partials/error.hbs', { message: "Session still opened: " + req.session.user.name, userStatus: true})
}
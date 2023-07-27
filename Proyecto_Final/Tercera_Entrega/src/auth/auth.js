export const privacy = (privacyType) => {
    return async (req, res, next) => {
        const {user} = req.session;
        switch (privacyType) {
            case 'PRIVATE':
            //Deja continuar con el proceso a aquellos que se encuentren logueads.
                if (user) next();
                else res.redirect('/login')
                break;
            //Si no estás logueado, continuas. Sino, te redirige al home.
            case "NO_AUTHENTICATED":
                if (!user) next();
                else res.redirect('/products')
        }
    }
}

export const authRoles = (role) => {
    return async (req, res, next) => {
        //Si llegue a este punto, SIEMPRE debo tener un usuario logueado.
        const {userRole} = req.session.user.role;
        if (userRole !== role) return res.status(403).send({status:"error", error: "Forbidden."})
        next();
    }
}


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
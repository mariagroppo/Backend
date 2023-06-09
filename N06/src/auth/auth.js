export default function auth(req, res, next){
    if (req.session?.name !== "") {
        return next();
    }
    return res.render('../src/views/partials/error.hbs', { message: "Sesión cerrada. Ingrese nuevamente.", userStatus: false})
}
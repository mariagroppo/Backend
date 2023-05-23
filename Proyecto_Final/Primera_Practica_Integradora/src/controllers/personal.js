export const getPersonal = async (req, res) => {
    try {
        res.render('../src/views/partials/personal.hbs')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getPersonal controller error: " + error })
    }
}

export const chargePhoto = async (req, res) => {
    try {
        if(!req.file){
            console.log("no existe file")
        }
        res.send(req.body)
    } catch (error) {
        res.send(error)
    }
}

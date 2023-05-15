export const getProducts = async (req, res) => {
    try {
        res.render('../src/views/partials/realTime.hbs')
    } catch (error) {
        /* console.log("getProducts Real Time controller error: " + error); */
        res.render('../src/views/partials/error.hbs', { message: "getProducts Controller Real Time error: " + error})
    }
}

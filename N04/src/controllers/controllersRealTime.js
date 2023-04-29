export const getProducts = async (req, res) => {
    try {
        res.render('../src/views/partials/realTime.hbs')
    } catch (error) {
        console.log("getProducts Real Time controller error: " + error);
    }
}

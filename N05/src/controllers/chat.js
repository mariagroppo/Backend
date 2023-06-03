export const getChat = async (req, res) => {
    try {
        res.render('../src/views/partials/chat.hbs')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getChat controller error: " + error })
    }
}

const getAnswers = async (req, res) => {
    try {
        if (req.info.status === 'success') {
           res.status(200).send(req.info);
       } else {
           res.sendInternalErrorMessage(req.info.message);
       }
    } catch (error) {
        res.sendErrorMessage("BACK controller error: " + error)
    }
}

export default {
    getAnswers
}
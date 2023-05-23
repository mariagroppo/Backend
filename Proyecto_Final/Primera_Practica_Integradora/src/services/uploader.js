//Multer es un middleware
import multer from "multer";
import __dirname from "../../utils.js";

//¿Donde voy a almacenar?
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/img`)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()} + ${file.originalname}`)
    }
})

const uploader = multer(storage);

export default uploader;
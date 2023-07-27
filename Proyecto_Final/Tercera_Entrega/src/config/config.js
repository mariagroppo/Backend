import dotenv from "dotenv";
dotenv.config();;

export default {
    app: {
        PORT: process.env.PORT || 8080,
        PERSISTENCE: process.env.PERSISTENCE,
        SECRET: process.env.SECRET,
    },
    mongo: {
        URL: process.env.MONGO_URL
    },
    mailing: {
        APP_PWD: process.env.APP_PWD,
        APP_MAIL: process.env.APP_MAIL,
    }
}
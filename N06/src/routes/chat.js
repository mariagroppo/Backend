import { getChat } from "../controllers/chat.js";
import express from 'express';
import auth from "../auth/auth.js";

const routerChat = express.Router();

/* GET Vista de todos los productos -------------------------------- */
routerChat.get('/', auth, getChat);

export default routerChat;
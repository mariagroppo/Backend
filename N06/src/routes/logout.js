import { logout } from "../controllers/session.js";
import express from 'express';

const routerlogout = express.Router();

routerlogout.get('/', logout);

export default routerlogout;
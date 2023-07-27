// Sirve para no mantener una conexión intermedia entre el DAO y el controlador.
// Toma el DAO del factory y define el metodo.

import PersistenceFactory from "../dao/mongodb/Factory.js";

import UserRepository from "./user.repository.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from "./products.repository.js";
import TicketRepostory from "./tickets.repository.js";

//let a = PersistenceFactory.getPersistence();
export const userService = new UserRepository(PersistenceFactory.getPersistence())
export const productService = new ProductRepository(PersistenceFactory.getPersistence());
export const cartService = new CartRepository(PersistenceFactory.getPersistence());
export const ticketsService = new TicketRepostory(PersistenceFactory.getPersistence());

import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    idCart:{ type: Number, required: true },
    timestamp: { type: String, required: true },
    products: { type: Array }
});

export const Cart = mongoose.model("cartscollection", cartsSchema )
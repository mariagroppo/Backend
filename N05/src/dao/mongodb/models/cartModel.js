import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    idCart:{ type: Number, required: true, index: true },
    timestamp: { type: String, required: true },
    products: { type: Array }
});

/* const cartsSchema = new mongoose.Schema({
    idCart:{ type: Number, required: true, index: true },
    timestamp: { type: String, required: true },
    products: { 
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'productscollection'
                },
                quantity: {type: Number}
            }
        ],
        default:[]
    }
}); */

export const Cart = mongoose.model("cartscollection", cartsSchema )
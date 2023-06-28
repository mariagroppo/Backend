import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    first_name:{type: String},
    last_name: {type: String},
    userEmail: {type: String},
    age: {type: Number},
    hashedPassword: {type: String},
    role: { type: String, default: "user" },
    carts: { 
      type: [
          {
              idCarts: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref:'cartscollection'
              }
          }
      ],
      default:[],
  }
    
});

const UserModel = mongoose.model("userscollection", schema);

export default UserModel;
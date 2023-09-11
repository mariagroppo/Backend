import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    first_name:{type: String},
    last_name: {type: String},
    userEmail: {type: String},
    role: { type: String, default: "user" },
    hashedPassword: {type: String},
    last_connection: {type: String, required: false}    
});

const UserModel = mongoose.model("userscollection", schema);

export default UserModel;
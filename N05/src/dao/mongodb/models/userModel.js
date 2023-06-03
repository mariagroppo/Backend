import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    userEmail: String,
    inputPassword: String,
    role: { type: String, default: "user" },
  }
);

const UserModel = mongoose.model("userscollection", schema);

export default UserModel;
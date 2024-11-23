import { userRoles } from "@/constants/role";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: userRoles.BASIC,
  },
  phone: {
    type: String,
    required: true,
  },
  gstnumber: {
    type: String,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

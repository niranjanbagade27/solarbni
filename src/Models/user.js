import mongoose from "mongoose";
import { roles } from "@/constants/dataconstants";

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    enum: roles,
    required: true,
  },
  loginApproved: {
    type: Boolean,
    required: true,
    default: false
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

import mongoose from "mongoose";
import { Schema, model } from "mongoose";
interface User {
  name: string;
  image: string;
  email: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String },
  image: { type: String },
});

export const UsersModel =
  mongoose.models?.Users || model<User>("User", userSchema);

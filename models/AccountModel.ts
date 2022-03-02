import mongoose, { Schema, model } from "mongoose";

const AccountsSchema = new Schema({
  userId: mongoose.Types.ObjectId,
  oauth_token: String,
  oauth_token_secret: String,
  provider: String,
});

export const AccountsModel =
  mongoose.models.Account || model("Account", AccountsSchema);

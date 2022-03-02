import { AccountsModel } from "models/AccountModel";
import { UsersModel } from "models/UserModel";
import dbConnect from "utils/mongoose";

export class UserRepository {
  static getUserTokens = async (userId: string) => {
    await dbConnect();

    return AccountsModel.findOne({ userId });
  };
}

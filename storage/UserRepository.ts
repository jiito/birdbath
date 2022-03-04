import { AccountsModel } from "models/AccountModel";
import { UsersModel } from "models/UserModel";
import dbConnect from "utils/mongoose";

export class UserRepository {
  static getUserAccount = async (userId: string) => {
    await dbConnect();

    return AccountsModel.findOne({ userId });
  };
  static getTwitterTokens = async (userId: string) => {
    const account = await UserRepository.getUserAccount(userId);

    console.log(account);
    return {
      token: account.oauth_token,
      secret: account.oauth_token_secret,
    };
  };
}

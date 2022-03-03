import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import TwitterClient from "services/twitter";
import { UserRepository } from "storage/UserRepository";
import dbConnect from "utils/mongoose";

export const apiHandlerWithTwitter = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    console.log(session);

    const { token, secret } = await UserRepository.getTwitterTokens(
      session!.userId as string
    );

    TwitterClient.login(token as string, secret as string);

    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);
    }
  };
};

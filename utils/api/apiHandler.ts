import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import TwitterClient from "services/twitter";
import { UserRepository } from "storage/UserRepository";

export const apiHandlerWithTwitter = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    const { token, secret } = await UserRepository.getTwitterTokens(
      session!.userId as string
    );

    TwitterClient.login(token as string, secret as string);

    try {
      await handler(req, res);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };
};

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import Twitter from "next-auth/providers/twitter";
import { getSession } from "next-auth/react";
import TwitterClient from "services/twitter";

export const apiHandlerWithTwitter = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    TwitterClient.login(
      token!.accessToken as string,
      token!.tokenSecret as string
    );

    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);
    }
  };
};

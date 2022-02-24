// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { UserV2Result } from "twitter-api-v2";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import TwitterClient from "services/twitter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserV2Result>
) {
  const session = await getSession({ req });
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  TwitterClient.login(
    token!.accessToken as string,
    token!.accessSecret as string
  );
  console.log("session", session);
  console.log("token", token);
  const username = req.query.username as string;
  console.log("client", TwitterClient.oauth_key);
  const userRes = await TwitterClient.getUserByName(username);
  res.status(200).json(userRes);
}

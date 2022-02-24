// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { UserV2Result } from "twitter-api-v2";
import TwitterClient from "services/twitter";
import { apiHandlerWithTwitter } from "utils/api/apiHandler";

export default apiHandlerWithTwitter(
  async (req: NextApiRequest, res: NextApiResponse<UserV2Result>) => {
    const username = req.query.username as string;
    const userRes = await TwitterClient.getUserByName(username);
    res.status(200).json(userRes);
  }
);

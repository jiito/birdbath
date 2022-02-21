// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserByName } from "../../../../services/twitter";
import { UserV2Result } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserV2Result>
) {
  const username = req.query.username as string;
  const userRes = await getUserByName(username);
  res.status(200).json(userRes);
}

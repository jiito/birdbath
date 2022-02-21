// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getUserByName,
  getTweetsForUserById,
} from "../../../../services/twitter";
import { TweetUserTimelineV2Paginator, UserV2Result } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetUserTimelineV2Paginator>
) {
  const username = req.query.username as string;
  const id = await (await getUserByName(username)).data.id;
  const userRes = await getTweetsForUserById(id);
  res.status(200).json(userRes);
}

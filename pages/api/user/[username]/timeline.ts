// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TwitterClient from "services/twitter";
import { TweetUserTimelineV2Paginator, UserV2Result } from "twitter-api-v2";
import { apiHandlerWithTwitter } from "utils/api/apiHandler";

export default apiHandlerWithTwitter(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetUserTimelineV2Paginator>
) {
  const username = req.query.username as string;
  const id = await (await TwitterClient.getUserByName(username)).data.id;
  const userRes = await TwitterClient.getTweetsForUserById(id);
  res.status(200).json(userRes);
});

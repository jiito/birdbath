// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TwitterClient from "services/twitter";
import { TweetV2 } from "twitter-api-v2";
import { apiHandlerWithTwitter } from "utils/api/apiHandler";
import { FilterFacotry } from "utils/FilterFactory";

export default apiHandlerWithTwitter(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetV2[]>
) {
  const likes = parseInt(req.query.likes as string) || Infinity;
  const username = req.query.username as string;
  const id = await (await TwitterClient.getUserByName(username)).data.id;
  const userRes = await TwitterClient.getTweetsForUserById(id);
  const filteredTweets = await TwitterClient.filterTweets(
    FilterFacotry.likesFilter(likes),
    userRes.tweets
  );
  res.status(200).json(filteredTweets);
});

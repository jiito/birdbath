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
  const filter = FilterFacotry.getFilter(req.query.filter! as string);
  const total = parseInt(req.query.total! as string);
  const username = req.query.username as string;
  const id = await (await TwitterClient.getUserByName(username)).data.id;
  const tweets = await TwitterClient.getTweetsForUserById(id, total);
  const filteredTweets = await TwitterClient.filterTweets(filter, tweets);
  res.status(200).json(filteredTweets);
});

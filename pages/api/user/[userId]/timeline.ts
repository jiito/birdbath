// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TwitterClient from "services/twitter";
import { OembedTweetV1Result, TweetV2 } from "twitter-api-v2";
import { apiHandlerWithTwitter } from "utils/api/apiHandler";
import { FilterFacotry } from "utils/FilterFactory";

enum ResponseTypes {
  Embed = "EMBED",
  Default = "DEFAULT",
}

export default apiHandlerWithTwitter(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ tweets: TweetV2[] | OembedTweetV1Result[] }>
) {
  const filter = FilterFacotry.getFilter(req.query.filter! as string);
  const total = parseInt(req.query.total! as string);
  const userId = req.query.userId as string;
  const type: ResponseTypes = req.query.type as ResponseTypes;
  const twitterId = await TwitterClient.getTwitterIdByUserId(userId);
  const tweets = await TwitterClient.getAndFilterTweets(
    twitterId,
    total,
    filter
  );
  let ans: TweetV2[] | OembedTweetV1Result[] = [];
  switch (type) {
    case ResponseTypes.Embed:
      ans = await Promise.all(
        tweets.map(async (tweet) => {
          return await TwitterClient.getEmbed(tweet.id);
        })
      );
      console.log(ans);
      break;
    case ResponseTypes.Default:
      ans = tweets;
    default:
      break;
  }
  res.status(200).json({ tweets: ans });
});

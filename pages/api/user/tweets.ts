import { getSession } from "next-auth/react";
import TwitterClient from "services/twitter";
import { UserRepository } from "storage/UserRepository";
import { apiHandlerWithTwitter } from "utils/api/apiHandler";
import { FilterFacotry } from "utils/FilterFactory";

export default apiHandlerWithTwitter(async (req, res) => {
  const session = await getSession({ req });
  if (!session) throw new Error("Not logged in!");
  const total = parseInt(req.query.total! as string);
  const filter = FilterFacotry.getFilter(req.query.filter! as string);
  const maxResults = parseInt(req.query.maxResults! as string);
  const twitterId = await TwitterClient.getTwitterIdByUserId(
    session.userId as string
  );
  if (!twitterId && !filter) {
    throw new Error("Must supply a tweet id or a filter");
  }
  switch (req.method) {
    case "GET":
      const tweets = await TwitterClient.getAndFilterTweets(
        twitterId,
        total,
        filter
      );
      const embeds = await Promise.all(
        tweets.map(async (tweet) => {
          return await TwitterClient.getEmbed(tweet.id);
        })
      );
      res.json({ ok: true, tweets: embeds });
      break;
    case "DELETE":
      const deleteTweets = await TwitterClient.deleteTweetsWithFilter(
        twitterId,
        maxResults,
        filter
      );
      console.log(deleteTweets);
      res.json({ ok: true, tweets: deleteTweets });
  }
});

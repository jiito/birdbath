import TwitterClient from "services/twitter";
import { apiHandlerWithTwitter } from "utils/api/apiHandler";

export default apiHandlerWithTwitter(async (req, res) => {
  const tweetId = req.query.id as string;
  if (!tweetId) throw new Error("Must supply a tweet id");

  if (req.method === "DELETE") {
    const deleteTweet = await TwitterClient.deleteTweetById(tweetId);
    console.log(deleteTweet);
    res.json({ ok: true, tweet: deleteTweet });
  }
});

import { getSession } from "next-auth/react";
import TwitterClient from "services/twitter";
import { UserRepository } from "storage/UserRepository";
import { apiHandlerWithTwitter } from "utils/api/apiHandler";
import { FilterFacotry } from "utils/FilterFactory";

export default apiHandlerWithTwitter(async (req, res) => {
  console.log("called");
  const session = await getSession({ req });
  console.log(session);
  const tweetId = req.query.id as string;
  const filterString = req.query.filter! as string;
  const maxResults = parseInt(req.query.maxResults! as string);
  if (!tweetId && !filterString) {
    throw new Error("Must supply a tweet id or a filter");
  }
  if (filterString) {
    const filter = FilterFacotry.getFilter(filterString);
    const account = await UserRepository.getUserAccount(
      (session as any).userId
    );
    const deleteTweets = await TwitterClient.deleteTweetsWithFilter(
      account.providerAccountId,
      maxResults,
      filter
    );
    console.log(deleteTweets);
    res.json({ ok: true, tweets: deleteTweets });
  }

  if (req.method === "DELETE") {
    const deleteTweet = await TwitterClient.deleteTweetById(tweetId);
    console.log(deleteTweet);
    res.json({ ok: true, tweets: deleteTweet });
  }
});

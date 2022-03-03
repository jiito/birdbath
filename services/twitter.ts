import { TweetV2, TwitterApi, TwitterApiTokens } from "twitter-api-v2";
import { Filter } from "utils/FilterFactory";

const twitterTokens = {
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  // Following access tokens are not required if you are
  // at part 1 of user-auth process (ask for a request token)
  // or if you want a app-only client (see below)
} as TwitterApiTokens;

class Twitter {
  oauth_key: string | undefined;
  oauth_secret: string | undefined;
  client: TwitterApi;
  constructor() {
    this.client = new TwitterApi(twitterTokens);
  }
  login = (oauth_k: string, oauth_s: string) => {
    this.oauth_key = oauth_k;
    this.oauth_secret = oauth_s;

    this.client = new TwitterApi({
      ...twitterTokens,
      accessSecret: oauth_s,
      accessToken: oauth_k,
    });
  };
  getUserByName = (name: string) => this.client.v2.userByUsername(name);

  getTweetsForUserById = async (id: string, total: number = 3200) => {
    const paginator = await this.client.v2.userTimeline(id, {
      "tweet.fields": ["public_metrics"],
    });
    await paginator.fetchLast(total);

    return paginator.data.data;
  };

  filterTweets = (filter: Filter, tweets: TweetV2[]) => {
    return tweets.filter(filter);
  };

  deleteTweets = (tweets: TweetV2[]) => {
    tweets.forEach(async (tweet) => {
      try {
        return await this.deleteTweetById(tweet.id);
      } catch (error) {
        console.error(error);
      }
    });
  };

  deleteTweetById = async (tweetId: string) => {
    const res = await this.client.v2.deleteTweet(tweetId);
    if (!res.data.deleted) {
      throw new Error(`Unable to delete tweet with ID: ${tweetId}`);
    }
    return { deleted: res.data.deleted, id: tweetId };
  };

  getAndFilterTweets = async (
    userId: string,
    maxResults: number,
    filter: Filter
  ) => {
    return this.filterTweets(
      filter,
      await this.getTweetsForUserById(userId, maxResults)
    );
  };
}
let TwitterClient = new Twitter();

export default TwitterClient;

import { AccountsModel } from "models/AccountModel";
import { TweetUserTimelineV2Paginator } from "twitter-api-v2/dist/paginators/tweet.paginator.v2";
import { TweetV2, TwitterApi, TwitterApiTokens } from "twitter-api-v2";
import { Filter } from "utils/FilterFactory";
import dbConnect from "utils/mongoose";
import JobService from "./JobService";

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
  userTimelinePaginator: TweetUserTimelineV2Paginator | undefined;
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

  getTwitterIdByUserId = async (userId: string) => {
    await dbConnect();

    const account = await AccountsModel.findOne({ userId });
    console.log("Account:", account);
    // have to use ._doc because it is defined by NextAuth
    return account._doc.providerAccountId;
  };

  getPaginatorForUser = async (id: string, max_results: number = 20) => {
    return this.client.v2.userTimeline(id, {
      "tweet.fields": ["public_metrics"],
      max_results,
    });
  };

  fetchTweets = async (userId: string, maxResults: number) => {
    JobService.addJob("fetchTweets", { userId, maxResults });
    if (!this.userTimelinePaginator) {
      this.userTimelinePaginator = await this.getPaginatorForUser(
        userId,
        maxResults
      );

      this.userTimelinePaginator.fetchLast(maxResults);
    } else {
      await this.fetchNextPage(maxResults);
    }
    return this.userTimelinePaginator.data.data;
  };

  fetchNextPage = (maxResults: number) => {
    return this.userTimelinePaginator?.fetchNext(maxResults);
  };

  filterTweets = (filter: Filter, tweets: TweetV2[]) => {
    return tweets.filter(filter);
  };

  deleteTweets = async (tweets: TweetV2[], chunkSize: number = 15) => {
    for (let i = 0; i < tweets.length; i + chunkSize) {
      await JobService.addJob("deleteTweets", {
        tweets: tweets.slice(i, i + chunkSize),
      });
    }
  };

  deleteTweetById = async (tweetId: string) => {
    const res = await this.client.v2.deleteTweet(tweetId);
    if (!res.data.deleted) {
      throw new Error(`Unable to delete tweet with ID: ${tweetId}`);
    }
    return { deleted: res.data.deleted, id: tweetId };
  };

  deleteTweetsWithFilter = async (
    userId: string,
    maxResults: number,
    filter: Filter
  ) => {
    const tweets = await this.getAndFilterTweets(userId, maxResults, filter);

    await this.deleteTweets(tweets);
  };

  getAndFilterTweets = async (
    userId: string,
    maxResults: number,
    filter: Filter
  ) => {
    return this.filterTweets(
      filter,
      await this.fetchTweets(userId, maxResults)
    );
  };
}
let TwitterClient = new Twitter();

export default TwitterClient;

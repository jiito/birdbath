import { AccountsModel } from "models/AccountModel";
import { TweetUserTimelineV2Paginator } from "twitter-api-v2/dist/paginators/tweet.paginator.v2";
import {
  OembedTweetV1Result,
  TweetV2,
  TweetV2ListTweetsPaginator,
  TwitterApi,
  TwitterApiTokens,
} from "twitter-api-v2";
import { Filter } from "utils/FilterFactory";
import dbConnect from "utils/mongoose";
import { Jobs } from "./JobService";

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
    console.log(id, max_results);
    return this.client.v2.userTimeline(id, {
      "tweet.fields": ["public_metrics"],
      max_results,
    });
  };

  fetchTweets = async (userId: string, maxResults: number) => {
    if (!this.userTimelinePaginator) {
      this.userTimelinePaginator = await this.getPaginatorForUser(
        userId,
        maxResults
      );

      await this.userTimelinePaginator.fetchLast(maxResults);
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
    console.log("[deleting]: ", tweets.length, "tweets");
    for (let i = 0; i < tweets.length; i += chunkSize) {
      await Jobs.addJob("deleteTweets", {
        tweets: tweets.slice(i, i + chunkSize),
      });
    }
    return tweets;
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

    const delTweets = await this.deleteTweets(tweets);
    return delTweets;
  };

  deleteTweetsPaginator = async (
    userId: string,
    perPage: number = 15,
    upTo: number,
    filter: Filter
  ) => {
    const tweetPage = await this.getAndFilterTweets(
      userId,
      Math.min(perPage, upTo),
      filter
    );

    const deletedTweets = await this.deleteTweets(tweetPage);

    if (tweetPage.length < upTo) {
      const remaining = upTo - tweetPage.length;
      deletedTweets.concat(
        await this.deleteTweetsPaginator(userId, perPage, remaining, filter)
      );
    }

    return deletedTweets;
  };
  async getAndFilterTweets(
    userId: string,
    total: number,
    filter: Filter
  ): Promise<TweetV2[]> {
    const tweets = await this.fetchTweets(userId, total);
    console.log("fetched tweets legnth: ", tweets.length);
    const filteredTweets = this.filterTweets(filter, tweets);

    if (filteredTweets.length < total) {
      console.log("length", filteredTweets.length, "total", total);
      console.log("Calling");
      return [
        ...filteredTweets,
        ...(await this.getAndFilterTweets(
          userId,
          total - filteredTweets.length,
          filter
        )),
      ];
    }

    console.log("TweetId: ", filteredTweets[0].id);
    console.log("Calling:", await this.getEmbed(filteredTweets[0].id));

    return filteredTweets.slice(-1 * total);
  }
  async transformToEmbeds(tweets: TweetV2[]) {
    return tweets.map(async (tweet) => await this.getEmbed(tweet.id));
  }

  async getEmbed(tweetId: string) {
    console.log(tweetId);
    return this.client.v1.oembedTweet(tweetId);
  }
}
let TwitterClient = new Twitter();

export default TwitterClient;

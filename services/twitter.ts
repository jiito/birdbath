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
import { JobQueues, QUEUES } from "./JobService";

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
      "user.fields": ["id"],
      expansions: ["author_id"],
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

  addTweetsToDeleteQueue = async (tweets: TweetV2[]) => {
    tweets.forEach((tweet) =>
      JobQueues.get(QUEUES.DELETE_TWEETS).add("deleteTweet", tweet)
    );
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

    const delTweets = await this.addTweetsToDeleteQueue(tweets);
    return delTweets;
  };

  // TODO: find better name
  deleteTweetsWithPaginator = async (
    userId: string,
    perPage: number = 15,
    upTo: number,
    filter: Filter
  ) => {
    let tweetPage = await this.getAndFilterTweets(
      userId,
      Math.min(perPage, upTo),
      filter
    );

    await this.addTweetsToDeleteQueue(tweetPage);

    if (tweetPage.length < upTo) {
      const remainingCount = upTo - tweetPage.length;

      const remainingTweets = await this.deleteTweetsWithPaginator(
        userId,
        perPage,
        remainingCount,
        filter
      );
      tweetPage.concat(remainingTweets);
    }

    return tweetPage;
  };
  async getAndFilterTweets(
    userId: string,
    total: number,
    filter: Filter
  ): Promise<TweetV2[]> {
    const tweets = await this.fetchTweets(userId, total);
    const filteredTweets = this.filterTweets(filter, tweets);

    if (filteredTweets.length < total) {
      return [
        ...filteredTweets,
        ...(await this.getAndFilterTweets(
          userId,
          total - filteredTweets.length,
          filter
        )),
      ];
    }

    return filteredTweets.slice(-1 * total);
  }
  async transformTweetsToEmbeds(tweets: TweetV2[]) {
    return tweets.map(async (tweet) => await this.getEmbed(tweet.id));
  }

  async getEmbed(tweetId: string) {
    return this.client.v1.oembedTweet(tweetId);
  }
}

let TwitterClient = new Twitter();

export default TwitterClient;

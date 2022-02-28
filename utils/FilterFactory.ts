import { TweetV2 } from "twitter-api-v2";

export type Filter = (tweet: TweetV2) => boolean;

export class FilterFacotry {
  static likesFilter = (threshold: number) => {
    return ((tweet: TweetV2) => {
      return tweet.public_metrics?.like_count! > threshold;
    }) as Filter;
  };
  static retweetsFilter = (threshold: number) => {
    return ((tweet: TweetV2) => {
      return tweet.public_metrics?.retweet_count! > threshold;
    }) as Filter;
  };
  static dateFilter = (threshold: Date) => {
    return ((tweet: TweetV2) => {
      return Date.parse(tweet.created_at!) > threshold.getTime();
    }) as Filter;
  };
}

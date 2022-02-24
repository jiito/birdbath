import { TweetV2 } from "twitter-api-v2";

export type Filter = (tweet: TweetV2) => boolean;

export class FilterFacotry {
  static likesFilter = (threshold: number) => {
    return ((tweet: TweetV2) => {
      return tweet.public_metrics?.like_count! > threshold;
    }) as Filter;
  };
}

import { TweetV2 } from "twitter-api-v2";

export type Filter = (tweet: TweetV2) => boolean;

export class FilterFacotry {
  static getFilter = (filterString: string) => {
    const [filter, threshold] = filterString.split(":");
    if (!filter || !threshold) throw new Error("Incorrect filter format");
    return filterMap[filter](threshold);
  };
  static likesFilter = (threshold: string) => {
    const x = parseInt(threshold);
    return ((tweet: TweetV2) => {
      return tweet.public_metrics?.like_count! < x;
    }) as Filter;
  };
  static retweetsFilter = (threshold: string) => {
    const x = parseInt(threshold);
    return ((tweet: TweetV2) => {
      return tweet.public_metrics?.retweet_count! < x;
    }) as Filter;
  };
  static dateFilter = (threshold: string) => {
    const d = Date.parse(threshold);
    return ((tweet: TweetV2) => {
      return Date.parse(tweet.created_at!) < d;
    }) as Filter;
  };
}

const filterMap: Record<string, (threshold: string) => Filter> = {
  like: FilterFacotry.likesFilter,
  retweet: FilterFacotry.retweetsFilter,
  date: FilterFacotry.dateFilter,
};

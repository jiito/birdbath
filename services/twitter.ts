import { TwitterApi, TwitterApiTokens } from "twitter-api-v2";

const twitterTokens = {
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  // Following access tokens are not required if you are
  // at part 1 of user-auth process (ask for a request token)
  // or if you want a app-only client (see below)
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
} as TwitterApiTokens;
console.log(twitterTokens);
const twitterClient = new TwitterApi(twitterTokens);

export const getUserByName = (name: string) =>
  twitterClient.v2.userByUsername(name);

export const getTweetsForUserById = (id: string) =>
  twitterClient.v2.userTimeline(id);

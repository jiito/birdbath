import { TweetV2 } from "twitter-api-v2";

const Tweet = (tweet: TweetV2) => {
  return (
    <p className="p-4 whitespace-pre-wrap border border-gray-200 rounded">
      {tweet.text}
    </p>
  );
};

export default Tweet;

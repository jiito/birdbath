import { Worker } from "bullmq";
import { RateLimiter } from "limiter";
import { TweetV2 } from "twitter-api-v2";
import TwitterClient from "./twitter";
import throttledQueue from "throttled-queue";
const limiter = new RateLimiter({ tokensPerInterval: 3, interval: "min" });

const throttle = throttledQueue(3, 1000 * 60); // at most 5 requests per minute.

const worker = new Worker("JobService", async (job) => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log(job.data);
  switch (job.name) {
    case "deleteTweets":
      const tweet = job.data as TweetV2;
      TwitterClient.deleteTweetById(tweet.id);
  }
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

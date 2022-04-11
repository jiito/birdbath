import { Queue, QueueScheduler, Worker } from "bullmq";
import { TweetV2 } from "twitter-api-v2";
import { SendGridAdapter } from "./SendgridAdapter";
import TwitterClient from "./twitter";

export enum QUEUES {
  DELETE_TWEETS = "twitter_deleteTweets",
}
class JobService {
  private queue: Queue;
  private worker: Worker<any, any, string>;
  private queueScheduler: QueueScheduler;
  constructor(name: string, limiterKey?: string) {
    // TODO: move this to a static var in the class
    this.queue = new Queue(name, {
      limiter: { groupKey: limiterKey! },
    });

    // needed to throttle the jobs
    this.queueScheduler = new QueueScheduler(name);

    this.worker = new Worker(
      name,
      async (job) => {
        // TODO: find a better place for the worker job processing
        switch (job.name) {
          case "deleteTweet":
            const { tweet, num }: { tweet: TweetV2; num: number } = job.data;
            const res = await TwitterClient.deleteTweetById(tweet.id);
        }
      },
      {
        limiter: {
          groupKey: limiterKey!,
          max: 3,
          duration: 1000 * 60 * 15,
        },
      }
    );
    this.startWorker();
  }

  async add(title: string, data: any) {
    await this.queue.add(title, data);
  }

  async shutdown() {
    await this.queue.close();
    await this.queueScheduler.close();
  }

  startWorker() {
    this.worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
      switch (job.name) {
        case "deleteTweet":
          const { tweet, num }: { tweet: TweetV2; num: number } = job.data;
          console.log(`Deleted tweet: ${tweet.id}`);
          if (num === 1) {
            console.log("Finished deleting tweets");
            SendGridAdapter.sendEmail("Finished deleting tweets", "");
          }
          break;
        default:
          break;
      }
    });

    this.worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
  }
}

export class JobQueues {
  private static mapping: Map<QUEUES, JobService> = new Map([
    [
      QUEUES.DELETE_TWEETS,
      new JobService(QUEUES.DELETE_TWEETS, "tweet.author_id"),
    ],
  ]);

  public static get(queue: QUEUES): JobService {
    return this.mapping.get(queue)!;
  }
}

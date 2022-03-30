import { Job, Queue } from "bullmq";

export enum QUEUES {
  DELETE_TWEETS = "twitter_deleteTweets",
}

export class JobQueue {
  q: Queue;
  constructor(name: string, limiterKey?: string) {
    this.q = new Queue(name, {
      limiter: { groupKey: limiterKey! },
    });
  }

  async addJob(title: string, data: any) {
    await this.q.add(title, data);
  }
}

export class JobQueues {
  private static mapping: Map<QUEUES, JobQueue> = new Map([
    [QUEUES.DELETE_TWEETS, new JobQueue(QUEUES.DELETE_TWEETS, "userId")],
  ]);

  public static get(queue: QUEUES): JobQueue {
    return this.mapping.get(queue)!;
  }
}

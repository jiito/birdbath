import { Job, Queue } from "bullmq";

export class JobService {
  q: Queue;
  constructor() {
    this.q = new Queue("JobService");
  }

  async addJob(title: string, data: any) {
    await this.q.add(title, data);
  }
}

export default new JobService();

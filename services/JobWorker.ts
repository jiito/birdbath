import { Worker } from "bullmq";

const worker = new Worker("JobService", async (job) => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log(job.data);
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

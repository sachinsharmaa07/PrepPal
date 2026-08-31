import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

const submissionWorker = new Worker(
  'submissions',
  async (job) => {
    console.log(`Processing submission job ${job.id}`);
    // Will integrate Judge0 call here
  },
  { connection }
);

submissionWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

submissionWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});

console.log('Workers started successfully.');

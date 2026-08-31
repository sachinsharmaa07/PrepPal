"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});
const submissionWorker = new bullmq_1.Worker('submissions', async (job) => {
    console.log(`Processing submission job ${job.id}`);
    // Will integrate Judge0 call here
}, { connection });
submissionWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
});
submissionWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error ${err.message}`);
});
console.log('Workers started successfully.');

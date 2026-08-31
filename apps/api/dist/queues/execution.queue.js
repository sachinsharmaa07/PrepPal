"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionQueue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
exports.connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
};
exports.executionQueue = new bullmq_1.Queue('executionQueue', { connection: exports.connection });

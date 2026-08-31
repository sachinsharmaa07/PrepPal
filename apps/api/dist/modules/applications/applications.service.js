"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const db_1 = __importDefault(require("../../config/db"));
class ApplicationsService {
    async applyToJob(userId, jobId, resumeId) {
        // 1. Check if job exists
        const job = await db_1.default.job.findUnique({ where: { id: jobId } });
        if (!job)
            throw new Error('Job not found');
        // 2. Check if already applied (handled by DB constraint as well, but good practice)
        const existing = await db_1.default.application.findUnique({
            where: {
                jobId_userId: { jobId, userId }
            }
        });
        if (existing)
            throw new Error('You have already applied to this job');
        // 3. Create application
        return db_1.default.application.create({
            data: {
                jobId,
                userId,
                resumeId,
                status: 'APPLIED'
            }
        });
    }
    async updateApplicationStatus(id, status) {
        return db_1.default.application.update({
            where: { id },
            data: { status }
        });
    }
}
exports.ApplicationsService = ApplicationsService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const jobs_service_1 = require("./jobs.service");
const envelope_1 = require("../../common/response/envelope");
const ai_client_1 = require("../ai/ai.client");
const job_parse_prompt_1 = require("../ai/prompts/job-parse.prompt");
const db_1 = __importDefault(require("../../config/db"));
class JobsController {
    jobsService = new jobs_service_1.JobsService();
    getJobs = async (req, res) => {
        try {
            const result = await this.jobsService.getJobs(req.query);
            res.status(200).json((0, envelope_1.success)(result));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    getJob = async (req, res) => {
        try {
            const job = await this.jobsService.getJobById(req.params.id);
            if (!job)
                return res.status(404).json((0, envelope_1.error)('NOT_FOUND', 'Job not found'));
            res.status(200).json((0, envelope_1.success)(job));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    getMyJobs = async (req, res) => {
        try {
            const userId = req.user?.userId || req.query.userId;
            if (!userId)
                return res.status(401).json((0, envelope_1.error)('UNAUTHORIZED', 'Authentication required'));
            // Find or create company for this recruiter
            let company = await db_1.default.company.findUnique({ where: { recruiterId: userId } });
            if (!company) {
                return res.status(404).json((0, envelope_1.error)('NOT_FOUND', 'No company profile found. Please create your company profile first.'));
            }
            const jobs = await this.jobsService.getJobsByCompany(company.id);
            res.status(200).json((0, envelope_1.success)({ jobs, company }));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    createJob = async (req, res) => {
        try {
            const userId = req.user?.userId || req.body.userId;
            if (!userId)
                return res.status(401).json((0, envelope_1.error)('UNAUTHORIZED', 'Authentication required'));
            // Find or auto-create a company for this recruiter
            let company = await db_1.default.company.findUnique({ where: { recruiterId: userId } });
            if (!company) {
                company = await db_1.default.company.create({
                    data: {
                        recruiterId: userId,
                        name: req.body.companyName || 'My Company',
                    },
                });
            }
            const result = await this.jobsService.createJob(company.id, req.body);
            res.status(201).json((0, envelope_1.success)(result));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    updateJob = async (req, res) => {
        try {
            const userId = req.user?.userId || req.body.userId;
            const company = await db_1.default.company.findUnique({ where: { recruiterId: userId } });
            if (!company)
                return res.status(404).json((0, envelope_1.error)('NOT_FOUND', 'Company not found'));
            const result = await this.jobsService.updateJob(req.params.id, company.id, req.body);
            res.status(200).json((0, envelope_1.success)(result));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    deleteJob = async (req, res) => {
        try {
            const userId = req.user?.userId || req.query.userId;
            const company = await db_1.default.company.findUnique({ where: { recruiterId: userId } });
            if (!company)
                return res.status(404).json((0, envelope_1.error)('NOT_FOUND', 'Company not found'));
            await this.jobsService.deleteJob(req.params.id, company.id);
            res.status(200).json((0, envelope_1.success)({ message: 'Job closed successfully' }));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    applyToJob = async (req, res) => {
        try {
            const userId = req.user?.userId || req.body.userId;
            if (!userId)
                return res.status(401).json((0, envelope_1.error)('UNAUTHORIZED', 'Authentication required'));
            const { resumeId } = req.body;
            const jobId = req.params.id;
            const result = await this.jobsService.applyToJob(userId, jobId, resumeId);
            res.status(201).json((0, envelope_1.success)(result));
        }
        catch (err) {
            if (err.message === 'You have already applied to this job') {
                return res.status(409).json((0, envelope_1.error)('CONFLICT', err.message));
            }
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    analyze = async (req, res) => {
        try {
            const { description } = req.body;
            if (!description || description.trim() === '') {
                return res.status(400).json((0, envelope_1.error)('VALIDATION_ERROR', 'Job description is required'));
            }
            const prompt = (0, job_parse_prompt_1.getJobParsePrompt)(description);
            const parsedData = await ai_client_1.aiClient.generateStructured(prompt, job_parse_prompt_1.JobParsedSchema);
            res.status(200).json((0, envelope_1.success)(parsedData));
        }
        catch (err) {
            console.error('Job analysis error:', err);
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message || 'Failed to analyze job description'));
        }
    };
}
exports.JobsController = JobsController;

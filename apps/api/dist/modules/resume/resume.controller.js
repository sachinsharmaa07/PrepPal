"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeController = void 0;
const resume_service_1 = require("./resume.service");
const envelope_1 = require("../../common/response/envelope");
class ResumeController {
    resumeService;
    constructor() {
        this.resumeService = new resume_service_1.ResumeService();
    }
    upload = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json((0, envelope_1.error)('VALIDATION_ERROR', 'PDF file is required'));
            }
            const fileBuffer = req.file.buffer;
            const jobDescription = req.body.jobDescription || '';
            const jobRequiredSkills = req.body.jobRequiredSkills ? JSON.parse(req.body.jobRequiredSkills) : [];
            const userId = req.body.userId || 'dummy-user-id'; // Use dummy for MVP
            const result = await this.resumeService.analyzeResume(fileBuffer, jobDescription, jobRequiredSkills, userId);
            res.status(200).json((0, envelope_1.success)(result));
        }
        catch (err) {
            console.error(err);
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message || 'Failed to analyze resume'));
        }
    };
    analyze = async (req, res) => {
        try {
            // In a real scenario, the file would come via multer or pre-signed S3 URL download
            // For this MVP stub, we assume the raw text or file is available in the request
            // Let's assume we receive base64 encoded pdf buffer in req.body.fileBase64
            if (!req.body.fileBase64) {
                return res.status(400).json((0, envelope_1.error)('VALIDATION_ERROR', 'File buffer required in base64 format'));
            }
            const fileBuffer = Buffer.from(req.body.fileBase64, 'base64');
            const jobDescription = req.body.jobDescription;
            const jobRequiredSkills = req.body.jobRequiredSkills || [];
            const result = await this.resumeService.analyzeResume(fileBuffer, jobDescription, jobRequiredSkills);
            res.status(200).json((0, envelope_1.success)(result));
        }
        catch (err) {
            console.error(err);
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message || 'Failed to analyze resume'));
        }
    };
}
exports.ResumeController = ResumeController;

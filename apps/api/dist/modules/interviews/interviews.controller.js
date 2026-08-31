"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewController = void 0;
const interviews_service_1 = require("./interviews.service");
const envelope_1 = require("../../common/response/envelope");
class InterviewController {
    interviewService;
    constructor() {
        this.interviewService = new interviews_service_1.InterviewService();
    }
    createSession = async (req, res) => {
        try {
            const { userId, type, difficulty, role } = req.body;
            const result = await this.interviewService.createSession(userId, type, difficulty, role);
            res.status(201).json((0, envelope_1.success)(result));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
    submitAnswer = async (req, res) => {
        try {
            const { questionId, answerText } = req.body;
            const result = await this.interviewService.submitAnswer(questionId, answerText);
            res.status(200).json((0, envelope_1.success)(result));
        }
        catch (err) {
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message));
        }
    };
}
exports.InterviewController = InterviewController;

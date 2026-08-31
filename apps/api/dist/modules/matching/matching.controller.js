"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingController = void 0;
const matcher_service_1 = require("../resume/matcher.service");
const envelope_1 = require("../../common/response/envelope");
const ai_client_1 = require("../ai/ai.client");
const suggestions_prompt_1 = require("../ai/prompts/suggestions.prompt");
class MatchingController {
    matcherService = new matcher_service_1.MatcherService();
    analyze = async (req, res) => {
        try {
            const { candidate, job } = req.body;
            if (!candidate || !job) {
                return res.status(400).json((0, envelope_1.error)('VALIDATION_ERROR', 'Both candidate (parsed resume) and job (parsed JD) are required'));
            }
            const matchResult = this.matcherService.match(candidate, job);
            res.status(200).json((0, envelope_1.success)(matchResult));
        }
        catch (err) {
            console.error('Matching analysis error:', err);
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message || 'Failed to match candidate with job'));
        }
    };
    suggestions = async (req, res) => {
        try {
            const { candidate, job } = req.body;
            if (!candidate || !job) {
                return res.status(400).json((0, envelope_1.error)('VALIDATION_ERROR', 'Both candidate and job data are required'));
            }
            const prompt = (0, suggestions_prompt_1.getSuggestionsPrompt)(JSON.stringify(candidate), JSON.stringify(job));
            const suggestions = await ai_client_1.aiClient.generateStructured(prompt, suggestions_prompt_1.SuggestionsSchema);
            res.status(200).json((0, envelope_1.success)(suggestions));
        }
        catch (err) {
            console.error('Suggestions error:', err);
            res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', err.message || 'Failed to generate suggestions'));
        }
    };
}
exports.MatchingController = MatchingController;

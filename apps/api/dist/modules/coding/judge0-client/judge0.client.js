"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Judge0Client = void 0;
const axios_1 = __importDefault(require("axios"));
class Judge0Client {
    baseUrl;
    constructor() {
        this.baseUrl = process.env.JUDGE0_URL || 'http://localhost:2358';
    }
    async submitCode(data) {
        const response = await axios_1.default.post(`${this.baseUrl}/submissions`, data, { params: { base64_encoded: false, wait: false } });
        return response.data.token;
    }
    async getSubmissionResult(token) {
        const response = await axios_1.default.get(`${this.baseUrl}/submissions/${token}`, { params: { base64_encoded: false } });
        return response.data;
    }
}
exports.Judge0Client = Judge0Client;

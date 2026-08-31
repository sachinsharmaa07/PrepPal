"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgeService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class JudgeService {
    static checkOutput(expected, actual, type = 'exact') {
        if (!actual)
            return false;
        switch (type) {
            case 'exact':
                return expected.trim() === actual.trim();
            case 'token':
                return expected.trim().split(/\s+/).join(' ') === actual.trim().split(/\s+/).join(' ');
            case 'numeric':
                return parseFloat(expected) === parseFloat(actual);
            default:
                return expected.trim() === actual.trim();
        }
    }
    static async submitToJudge0(code, languageId, stdin, timeLimitMs, memoryLimitMb) {
        const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';
        const payload = {
            source_code: code,
            language_id: languageId,
            stdin,
            cpu_time_limit: timeLimitMs / 1000,
            memory_limit: memoryLimitMb * 1024
        };
        const res = await fetch(`${JUDGE0_URL}/submissions?wait=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await res.json();
    }
    static getLanguageId(lang) {
        const map = {
            CPP: 54,
            JAVA: 62,
            PYTHON: 71,
            JAVASCRIPT: 93
        };
        return map[lang.toUpperCase()] || 93;
    }
}
exports.JudgeService = JudgeService;

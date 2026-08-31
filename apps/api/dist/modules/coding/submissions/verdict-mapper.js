"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapJudge0StatusToVerdict = void 0;
const mapJudge0StatusToVerdict = (statusId) => {
    switch (statusId) {
        case 1: // In Queue
        case 2: // Processing
            return 'PENDING';
        case 3: // Accepted
            return 'ACCEPTED';
        case 4: // Wrong Answer
            return 'WRONG_ANSWER';
        case 5: // Time Limit Exceeded
            return 'TIME_LIMIT_EXCEEDED';
        case 6: // Compilation Error
            return 'COMPILATION_ERROR';
        case 7: // Runtime Error (SIGSEGV)
        case 8: // Runtime Error (SIGXFSZ)
        case 9: // Runtime Error (SIGFPE)
        case 10: // Runtime Error (SIGABRT)
        case 11: // Runtime Error (NZEC)
        case 12: // Runtime Error (Other)
            return 'RUNTIME_ERROR';
        case 13: // Internal Error
        case 14: // Exec Format Error
            return 'RUNTIME_ERROR';
        default:
            return 'RUNTIME_ERROR';
    }
};
exports.mapJudge0StatusToVerdict = mapJudge0StatusToVerdict;

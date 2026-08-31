"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const resume_routes_1 = __importDefault(require("./modules/resume/resume.routes"));
const interviews_routes_1 = __importDefault(require("./modules/interviews/interviews.routes"));
const jobs_routes_1 = __importDefault(require("./modules/jobs/jobs.routes"));
const matching_routes_1 = __importDefault(require("./modules/matching/matching.routes"));
const coding_routes_1 = require("./modules/coding/coding.routes");
const setupRoutes = (app) => {
    // Health check
    app.get('/health', (req, res) => {
        res.json({ success: true, data: { status: 'OK' } });
    });
    app.use('/v1/auth', auth_routes_1.default);
    app.use('/v1/resume', resume_routes_1.default);
    app.use('/v1/interviews', interviews_routes_1.default);
    app.use('/v1/jobs', jobs_routes_1.default);
    app.use('/v1/matching', matching_routes_1.default);
    app.use('/v1/coding', coding_routes_1.codingRoutes);
};
exports.setupRoutes = setupRoutes;

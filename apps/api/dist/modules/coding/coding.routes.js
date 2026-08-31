"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codingRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../common/middleware/auth");
const coding_controller_1 = require("./coding.controller");
const router = (0, express_1.Router)();
const controller = new coding_controller_1.CodingController();
// Code Editor State Routes
router.get('/code/:problemId', auth_1.requireAuth, controller.getUserCode);
router.put('/code/:problemId', auth_1.requireAuth, controller.saveUserCode);
// Problem Routes (for fetching details)
router.get('/problems/:slug', auth_1.requireAuth, controller.getProblem);
// Submissions / Executions
router.post('/executions', auth_1.requireAuth, controller.runCode); // Run (public tests)
router.post('/submissions', auth_1.requireAuth, controller.submitCode); // Submit (hidden tests)
router.get('/submissions/problem/:problemId', auth_1.requireAuth, controller.getSubmissionHistory);
router.get('/submissions/:submissionId', auth_1.requireAuth, controller.getSubmissionDetails);
exports.codingRoutes = router;

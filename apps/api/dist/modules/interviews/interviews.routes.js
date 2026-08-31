"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interviews_controller_1 = require("./interviews.controller");
const router = (0, express_1.Router)();
const interviewController = new interviews_controller_1.InterviewController();
router.post('/', interviewController.createSession);
router.post('/answer', interviewController.submitAnswer);
exports.default = router;

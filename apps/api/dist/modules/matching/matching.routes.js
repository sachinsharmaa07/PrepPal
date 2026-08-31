"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matching_controller_1 = require("./matching.controller");
const router = (0, express_1.Router)();
const matchingController = new matching_controller_1.MatchingController();
router.post('/analyze', matchingController.analyze);
router.post('/suggestions', matchingController.suggestions);
exports.default = router;

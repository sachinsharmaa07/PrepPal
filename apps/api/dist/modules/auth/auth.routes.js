"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = require("../../common/validation/validateRequest");
const auth_dto_1 = require("./auth.dto");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', (0, validateRequest_1.validateRequest)(auth_dto_1.registerSchema), authController.register);
router.post('/login', (0, validateRequest_1.validateRequest)(auth_dto_1.loginSchema), authController.login);
router.post('/google', (0, validateRequest_1.validateRequest)(auth_dto_1.googleLoginSchema), authController.googleLogin);
// Note: /refresh and /logout require authGuard which will be implemented later.
exports.default = router;

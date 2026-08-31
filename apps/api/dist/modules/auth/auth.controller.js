"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const envelope_1 = require("../../common/response/envelope");
class AuthController {
    authService;
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    register = async (req, res) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json((0, envelope_1.success)(result));
        }
        catch (err) {
            if (err.message === 'User already exists') {
                res.status(409).json((0, envelope_1.error)('CONFLICT', err.message));
            }
            else {
                console.error(err);
                res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', 'Registration failed'));
            }
        }
    };
    login = async (req, res) => {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json((0, envelope_1.success)(result));
        }
        catch (err) {
            if (err.message === 'Invalid email or password') {
                res.status(401).json((0, envelope_1.error)('UNAUTHORIZED', err.message));
            }
            else {
                console.error(err);
                res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', 'Login failed'));
            }
        }
    };
    googleLogin = async (req, res) => {
        try {
            const { idToken } = req.body;
            const result = await this.authService.googleLogin(idToken);
            res.status(200).json((0, envelope_1.success)(result));
        }
        catch (err) {
            console.error('Google login error:', err);
            res.status(401).json((0, envelope_1.error)('UNAUTHORIZED', err.message || 'Google login failed'));
        }
    };
}
exports.AuthController = AuthController;

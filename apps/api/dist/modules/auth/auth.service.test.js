"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_service_1 = require("./auth.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../config/db"));
vitest_1.vi.mock('bcrypt');
vitest_1.vi.mock('jsonwebtoken');
(0, vitest_1.describe)('AuthService', () => {
    let service;
    let mockUser;
    (0, vitest_1.beforeEach)(() => {
        service = new auth_service_1.AuthService();
        vitest_1.vi.clearAllMocks();
        mockUser = { id: '1', email: 'test@test.com', passwordHash: 'hash', role: 'STUDENT', name: 'Test' };
    });
    (0, vitest_1.it)('should login a valid user', async () => {
        db_1.default.user.findUnique.mockResolvedValueOnce(mockUser);
        vitest_1.vi.mocked(bcrypt_1.default.compare).mockResolvedValueOnce(true);
        vitest_1.vi.mocked(jsonwebtoken_1.default.sign).mockReturnValue('mock-token');
        const result = await service.login({ email: 'test@test.com', password: 'password' });
        (0, vitest_1.expect)(result.accessToken).toBe('mock-token');
        (0, vitest_1.expect)(result.user.id).toBe('1');
        (0, vitest_1.expect)(bcrypt_1.default.compare).toHaveBeenCalledWith('password', 'hash');
    });
    (0, vitest_1.it)('should throw if user not found on login', async () => {
        db_1.default.user.findUnique.mockResolvedValueOnce(null);
        await (0, vitest_1.expect)(service.login({ email: 'test@test.com', password: 'pwd' }))
            .rejects.toThrow('Invalid email or password');
    });
});

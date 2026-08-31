"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../config/db"));
const google_auth_library_1 = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
class AuthService {
    jwtSecret;
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    }
    async register(data) {
        const existingUser = await db_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const user = await db_1.default.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                role: data.role,
                profile: {
                    create: {},
                },
            },
        });
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, this.jwtSecret, { expiresIn: '15m' });
        // In a real app, generate refresh token too.
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
        };
    }
    async login(data) {
        const user = await db_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isValid = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid email or password');
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, this.jwtSecret, { expiresIn: '15m' });
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
        };
    }
    async googleLogin(idToken) {
        if (!GOOGLE_CLIENT_ID) {
            throw new Error('Google OAuth is not configured on the server');
        }
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error('Invalid Google token payload');
        }
        const { email, name, picture } = payload;
        let user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const passwordHash = await bcrypt_1.default.hash(randomPassword, 10);
            user = await db_1.default.user.create({
                data: {
                    email,
                    name: name || 'Google User',
                    avatarUrl: picture,
                    passwordHash,
                    role: 'STUDENT',
                    profile: {
                        create: {},
                    },
                },
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, this.jwtSecret, { expiresIn: '15m' });
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
        };
    }
}
exports.AuthService = AuthService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
// Mock auth middleware for MVP
const requireAuth = (req, res, next) => {
    // In a real app, verify JWT here
    req.user = { id: 'dummy-user-id' };
    next();
};
exports.requireAuth = requireAuth;

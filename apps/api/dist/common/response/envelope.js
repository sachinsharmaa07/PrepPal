"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
const success = (data) => {
    return {
        success: true,
        data,
    };
};
exports.success = success;
const error = (code, message) => {
    return {
        success: false,
        error: {
            code,
            message,
        },
    };
};
exports.error = error;

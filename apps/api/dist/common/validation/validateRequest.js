"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const envelope_1 = require("../response/envelope");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json((0, envelope_1.error)('VALIDATION_ERROR', err.errors.map((e) => e.message).join(', ')));
            }
            return res.status(500).json((0, envelope_1.error)('INTERNAL_ERROR', 'Internal server error during validation'));
        }
    };
};
exports.validateRequest = validateRequest;

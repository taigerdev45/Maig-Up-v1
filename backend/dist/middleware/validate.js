"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
// Recursively sanitize all strings in an object/array
const sanitizeData = (data) => {
    if (typeof data === 'string') {
        return (0, sanitize_html_1.default)(data, {
            allowedTags: [], // Strip all HTML tags
            allowedAttributes: {}, // Strip all attributes
        });
    }
    if (Array.isArray(data)) {
        return data.map(sanitizeData);
    }
    if (typeof data === 'object' && data !== null) {
        const sanitizedObj = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                sanitizedObj[key] = sanitizeData(data[key]);
            }
        }
        return sanitizedObj;
    }
    return data;
};
const validate = (schema) => {
    return (req, res, next) => {
        // Layer 1: Validate Schema (Types, formats, required fields)
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
            return;
        }
        // Layer 2: Sanitize Data (Strip HTML/XSS)
        req.body = sanitizeData(result.data);
        next();
    };
};
exports.validate = validate;

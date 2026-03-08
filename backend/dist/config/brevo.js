"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brevo_1 = require("@getbrevo/brevo");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { BREVO_API_KEY } = process.env;
if (!BREVO_API_KEY) {
    console.warn('Missing BREVO_API_KEY environment variable. Email functionality may not work.');
}
const brevo = new brevo_1.BrevoClient({
    apiKey: BREVO_API_KEY || ''
});
exports.default = brevo;

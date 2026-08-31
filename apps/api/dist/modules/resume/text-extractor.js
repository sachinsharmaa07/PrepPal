"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPdf = void 0;
const pdfParse = require('pdf-parse');
const extractTextFromPdf = async (fileBuffer) => {
    try {
        const data = await pdfParse(fileBuffer);
        return data.text;
    }
    catch (error) {
        console.error('PDF Extraction Error:', error);
        throw new Error('Failed to parse PDF document.');
    }
};
exports.extractTextFromPdf = extractTextFromPdf;

const docx = require('docx');
const { createDocument, parseTests } = require('../utils/docxUtils');
const mammoth = require('mammoth');
const processTextTests = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
            throw new Error('Matn kiritilmagan');
        }

        const cleanText = text
            .replace(/\*\*/g, '')
            .replace(/\?/g, '')
            .replace(/[^\w\s\.\)a-zA-Z0-9]/g, '')
            .trim();

        const tests = parseTests(cleanText);
        const doc = createDocument(tests);
        const buffer = await docx.Packer.toBuffer(doc);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=tests.docx');
        res.send(buffer);

    } catch (error) {
        console.error('Xatolik:', error);
        res.status(400).json({ error: error.message });
    }
};

const processFileTests = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Fayl yuklanmadi" });
        }

        const result = await mammoth.extractRawText({
            buffer: req.file.buffer
        });

        const text = result.value;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: "Fayl bo'sh yoki matn topilmadi" });
        }

        const cleanText = text
            .replace(/\*\*/g, '')
            .replace(/\?/g, '')
            .replace(/[^\w\s\.\)a-zA-Z0-9]/g, '')
            .trim();

        const tests = parseTests(cleanText);
        const doc = createDocument(tests);
        const buffer = await docx.Packer.toBuffer(doc);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=tests.docx');
        res.send(buffer);

    } catch (error) {
        console.error('Xatolik:', error);
        res.status(400).json({ error: error.message });
    }
};

const processFileTestsTR = (req, res) => {
    res.json({ message: "Text tests processing endpoint" });
};

module.exports = {
    processFileTests,
    processTextTests
};
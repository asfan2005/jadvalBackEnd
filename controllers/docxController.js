const docx = require('docx');
const { createDocument, parseTests } = require('../utils/docxUtils');
const mammoth = require('mammoth');

const processTextTests = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({ 
                error: 'Matn kiritilmagan. Iltimos, test matnini kiriting.' 
            });
        }

        // Matnni tozalash va formatlash 
        const cleanText = text
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        // Test formatini tekshirish
        const lines = cleanText.split('\n');
        let hasQuestions = false;
        let hasAnswers = false;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (/^\d+[\.\)]/.test(trimmedLine)) {
                hasQuestions = true;
            }
            if (/^[A-Da-d][\.\)]/.test(trimmedLine)) {
                hasAnswers = true;
            }
        }

        if (!hasQuestions) {
            return res.status(400).json({
                error: 'Test savollari topilmadi. Har bir savol raqam bilan boshlanishi kerak (1. yoki 1))'
            });
        }

        if (!hasAnswers) {
            return res.status(400).json({
                error: 'Test javoblari topilmadi. Har bir javob A), a), A. yoki a. formatida bo\'lishi kerak'
            });
        }

        try {
            const tests = parseTests(cleanText);
            
            if (!tests || tests.length === 0) {
                return res.status(400).json({ 
                    error: 'Test savollari to\'g\'ri formatda emas. Iltimos tekshirib qaytadan kiriting.' 
                });
            }

            const doc = createDocument(tests);
            const buffer = await docx.Packer.toBuffer(doc);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', 'attachment; filename=tests.docx');
            res.send(buffer);

        } catch (parseError) {
            return res.status(400).json({ 
                error: parseError.message || 'Test formatida xatolik. Iltimos tekshirib qaytadan kiriting.'
            });
        }

    } catch (error) {
        console.error('Xatolik:', error);
        res.status(500).json({ 
            error: 'Serverda kutilmagan xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.'
        });
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
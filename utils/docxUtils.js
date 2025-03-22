const { Document, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');

function createDocument(tests) {
    // Agar tests array bo'lmasa, uni array qilamiz
    if (!Array.isArray(tests)) {
        tests = [tests];
    }
    
    return new Document({
        sections: [{
            properties: {},
            children: tests.map((test) => [
                createTestTable(test),
                new Paragraph({
                    text: "",
                    spacing: { before: 300, after: 300 }
                }),
            ]).flat(),
        }],
    });
}

function createTestTable(test) {
    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 }
        },
        rows: [
            // Savol qatori
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph({ 
                            text: `${preserveText(test.question)}`,
                            spacing: { before: 120, after: 120 }
                        })],
                    }),
                ],
            }),
            // Javoblar qatorlari
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ 
                            text: `${preserveText(test.correctAnswer)}`,
                            spacing: { before: 120, after: 120 }
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ 
                            text: `${preserveText(test.wrongAnswer1)}`,
                            spacing: { before: 120, after: 120 }
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ 
                            text: `${preserveText(test.wrongAnswer2)}`,
                            spacing: { before: 120, after: 120 }
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ 
                            text: `${preserveText(test.wrongAnswer3)}`,
                            spacing: { before: 120, after: 120 }
                        })],
                    }),
                ],
            }),
        ],
    });
}

// Yangi funksiya - matnni asl holatida saqlash uchun
function preserveText(text) {
    if (!text) return '';
    return text
        .replace(/\s+/g, ' ')              // Ortiqcha bo'shliqlarni bitta bo'shliqqa o'zgartirish
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Ko'rinmas belgilarni olib tashlash
        .trim();
}

// Yangilangan cleanLine funksiyasi
function cleanLine(line) {
    if (!line) return '';
    return line
        .replace(/^\s+/, '')               // Boshidagi bo'shliqlarni olib tashlash
        .replace(/\s+$/, '')               // Oxiridagi bo'shliqlarni olib tashlash
        .replace(/\s+/g, ' ')              // Ortiqcha bo'shliqlarni bitta bo'shliqqa o'zgartirish
        .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Ko'rinmas belgilarni olib tashlash
}

function parseTests(text) {
    const tests = [];
    const lines = text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    let currentTest = null;
    let currentQuestion = '';

    for (let i = 0; i < lines.length; i++) {
        const line = cleanLine(lines[i]);
        
        // Yangi test savoli
        if (/^\d+[\.\)]+/.test(line)) {
            if (currentTest && isValidTest(currentTest)) {
                tests.push(currentTest);
            }
            
            currentTest = {
                number: line.match(/^\d+/)[0],
                question: line.replace(/^\d+[\.\)]+\s*/, ''),
                correctAnswer: '',
                wrongAnswer1: '',
                wrongAnswer2: '',
                wrongAnswer3: ''
            };
            currentQuestion = currentTest.question;
        }
        // Test javobi - katta va kichik harflarni qo'llab-quvvatlash
        else if (currentTest && /^[A-Da-d][\.\)]+/.test(line)) {
            const answerType = line.toLowerCase().charAt(0);
            const answer = line.replace(/^[A-Da-d][\.\)]+\s*/, '').trim();
            
            switch(answerType) {
                case 'a':
                    currentTest.correctAnswer = answer;
                    break;
                case 'b':
                    currentTest.wrongAnswer1 = answer;
                    break;
                case 'c':
                    currentTest.wrongAnswer2 = answer;
                    break;
                case 'd':
                    currentTest.wrongAnswer3 = answer;
                    break;
            }
        }
        // Savol davomi
        else if (currentTest && !isAnswerLine(line)) {
            currentQuestion += ' ' + line;
            currentTest.question = currentQuestion;
        }
    }

    // Oxirgi testni qo'shish
    if (currentTest && isValidTest(currentTest)) {
        tests.push(currentTest);
    }

    if (tests.length === 0) {
        throw new Error('Testlar topilmadi. Iltimos, to\'g\'ri formatda kiriting.');
    }

    return tests;
}

// Yordamchi funksiyalar
function cleanText(text) {
    return text
        .replace(/[""'']/g, '"')           // Maxsus qo'shtirnoqlarni oddiy qo'shtirnoqqa o'zgartirish
        .replace(/[`′]/g, "'")             // Maxsus birtirnoqlarni oddiy birtirnoqqa o'zgartirish
        .replace(/[—–]/g, "-")             // Maxsus chiziqchalarni oddiy chiziqchaga o'zgartirish
        .replace(/\s+/g, ' ')              // Ortiqcha bo'shliqlarni bitta bo'shliqqa o'zgartirish
        .trim();
}

function isAnswerLine(line) {
    return /^[A-Da-d][\.\)]+/i.test(line);
}

function isValidTest(test) {
    return test.question && 
           test.correctAnswer && 
           test.wrongAnswer1 && 
           test.wrongAnswer2 && 
           test.wrongAnswer3;
}

module.exports = {
    createDocument,
    parseTests
};
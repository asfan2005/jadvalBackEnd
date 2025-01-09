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
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 }
        },
        rows: [
            createTableRow(test.question),
            createTableRow(test.correctAnswer),
            createTableRow(test.wrongAnswer1),
            createTableRow(test.wrongAnswer2),
            createTableRow(test.wrongAnswer3),
        ],
    });
}

function createTableRow(content) {
    return new TableRow({
        children: [
            new TableCell({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({ 
                    text: content,
                    spacing: { before: 120, after: 120 }
                })],
            }),
        ],
    });
}

function parseTests(text) {
    const tests = [];
    const normalizedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\*\*/g, '')
        .replace(/\?/g, '')
        .replace(/[^\w\s\.\)a-zA-Z0-9]/g, '');

    const lines = normalizedText
        .split('\n')
        .map(line => line.trim()
            .replace(/\*\*/g, '')
            .replace(/\?/g, '')
            .replace(/[^\w\s\.\)a-zA-Z0-9]/g, ''))
        .filter(line => line);

    let currentTest = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
            .replace(/\*\*/g, '')
            .replace(/\?/g, '')
            .replace(/[^\w\s\.\)a-zA-Z0-9]/g, '')
            .trim();
        
        if (/^\d+[\.\)]/.test(line)) {
            if (currentTest) {
                tests.push(currentTest);
            }
            currentTest = {
                question: line.replace(/^\d+[\.\)]/, '').trim(),
                correctAnswer: '',
                wrongAnswer1: '',
                wrongAnswer2: '',
                wrongAnswer3: ''
            };
        }
        else if (currentTest && /^[A-Da-d][\.\)]/.test(line)) {
            const answer = line.replace(/^[A-Da-d][\.\)]/, '').trim();
            const answerType = line.charAt(0).toLowerCase();
            
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
    }

    if (currentTest) {
        tests.push(currentTest);
    }

    return tests;
}

module.exports = {
    createDocument,
    parseTests
};
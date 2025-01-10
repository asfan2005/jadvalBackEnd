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
                            text: `${test.question}`,
                            spacing: { before: 120, after: 120 }
                        })],
                    }),
                ],
            }),
            // Javoblar qatori - har bir javob alohida qatorda
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: test.correctAnswer })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: test.wrongAnswer1 })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: test.wrongAnswer2 })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: test.wrongAnswer3 })],
                    }),
                ],
            }),
        ],
    });
}

function parseTests(text) {
    const tests = [];
    const lines = text
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

    let currentTest = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Test raqami va savolini aniqlash
        if (/^\d+\./.test(line)) {
            if (currentTest) {
                tests.push(currentTest);
            }
            
            // Savolni va javoblarni ajratish
            let questionText = line.replace(/^\d+\.\s*/, '');
            let answers = {
                correctAnswer: '',
                wrongAnswer1: '',
                wrongAnswer2: '',
                wrongAnswer3: ''
            };
            
            // Agar savol ichida a), b), c), d) javoblari bo'lsa
            if (questionText.includes('a)')) {
                const parts = questionText.split(/([a-d]\))/);
                // Faqat savol qismini olish
                questionText = parts[0].trim();
                
                // Javoblarni ajratib olish
                for (let j = 1; j < parts.length; j += 2) {
                    const answerType = parts[j][0]; // a, b, c yoki d
                    const answerText = parts[j + 1].trim();
                    
                    switch(answerType) {
                        case 'a':
                            answers.correctAnswer = answerText;
                            break;
                        case 'b':
                            answers.wrongAnswer1 = answerText;
                            break;
                        case 'c':
                            answers.wrongAnswer2 = answerText;
                            break;
                        case 'd':
                            answers.wrongAnswer3 = answerText;
                            break;
                    }
                }
            }
            
            currentTest = {
                number: line.match(/^\d+/)[0],
                question: questionText,
                ...answers
            };
        }
        // Agar alohida qatorda javoblar bo'lsa
        else if (currentTest && /^[a-d]\)/.test(line)) {
            const answerType = line.charAt(0);
            const answer = line.substring(2).trim();
            
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
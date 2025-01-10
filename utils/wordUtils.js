const docx = require('docx');
const { Document, Paragraph, TextRun } = docx;

const createWordDocument = async (text) => {
    try {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: text,
                                size: 24, // 12pt
                            }),
                        ],
                    }),
                ],
            }],
        });

        const buffer = await doc.save();
        return buffer;
    } catch (error) {
        throw new Error(`Word hujjatini yaratishda xatolik: ${error.message}`);
    }
};

module.exports = {
    createWordDocument
};

const { Document, Paragraph, TextRun, Packer } = require('docx');

const convertToWord = async (req, res) => {
    try {
        const { text } = req.body;

        // Tekshirish
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Matn kiritilmagan yoki noto'g'ri format"
            });
        }

        // Matnni qayta ishlash
        const processedText = text
            .replace(/[#*-]/g, '') // Barcha #, * va - belgilarini olib tashlash
            .split('\n') // Qatorlarga bo'lish
            .map(line => {
                // Agar qator raqam bilan boshlansa, uni qatorning boshiga qo'yamiz
                const numberMatch = line.match(/^\s*(\d+)/);
                if (numberMatch) {
                    return line.trim(); // Ortiqcha bo'shliqlarni olib tashlash
                }
                return line;
            })
            .join('\n'); // Qayta birlashtiramiz

        // Word hujjatini yaratish
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: processedText,
                                size: 36, // 18pt (36 chunki docx da o'lcham 2 barobar ko'proq)
                                font: 'Times New Roman'
                            })
                        ],
                        spacing: {
                            line: 360,
                            before: 200,
                            after: 200
                        }
                    })
                ]
            }]
        });

        // Hujjatni buffer sifatida saqlash
        const buffer = await Packer.toBuffer(doc);

        // Response headerlarini o'rnatish
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=document-${Date.now()}.docx`);
        
        // Faylni yuborish
        res.send(buffer);

    } catch (error) {
        console.error('Word yaratishda xatolik:', error);
        res.status(500).json({
            success: false,
            message: 'Word faylini yaratishda xatolik yuz berdi',
            error: error.message
        });
    }
};

module.exports = {
    convertToWord
};
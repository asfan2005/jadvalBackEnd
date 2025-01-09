const { createEnhancedPptxPresentation } = require('../utils/pptxUtils');

const processTextPptx = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
            throw new Error('Matn kiritilmagan');
        }

        const cleanText = text
            .replace(/[#\-*]/g, '')
            .replace(/\r\n/g, '\n')
            .trim();

        const lines = cleanText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const pptxBuffer = await createEnhancedPptxPresentation(lines);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', 'attachment; filename=presentation.pptx');
        res.send(pptxBuffer);

    } catch (error) {
        console.error('Xatolik:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    processTextPptx
};
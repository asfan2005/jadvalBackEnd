const PptxGenJS = require('pptxgenjs');

async function createEnhancedPptxPresentation(lines) {
    const pres = new PptxGenJS();
    
    pres.layout = 'LAYOUT_WIDE';
    const LINES_PER_SLIDE = 7;
    let slideNumber = 1;

    for (let i = 0; i < lines.length; i += LINES_PER_SLIDE) {
        const slideLines = lines.slice(i, i + LINES_PER_SLIDE);
        const slide = pres.addSlide();
        
        slide.background = { color: 'FFFFFF' };

        slideLines.forEach((line, index) => {
            slide.addText(line, {
                x: 0.5,
                y: 1 + (index * 0.8),
                w: '90%',
                h: 0.5,
                fontSize: 19,
                color: '000000',
                fontFace: 'Arial',
                align: 'left',
                breakLine: true
            });
        });

        slide.addText(`${slideNumber}`, {
            x: '90%',
            y: '95%',
            w: 0.5,
            h: 0.3,
            fontSize: 14,
            color: '666666',
            bold: true,
            align: 'center'
        });

        slideNumber++;
    }

    return await pres.write('nodebuffer');
}

module.exports = {
    createEnhancedPptxPresentation
};
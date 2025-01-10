const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const errorHandler = require('./middleware/errorHandler');
const docxRoutes = require('./routes/docxRoutes');
const pptxRoutes = require('./routes/pptxRoutes');
const wordRoutes = require('./routes/wordRoutes');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', docxRoutes);
app.use('/api', pptxRoutes);
app.use('/api', wordRoutes);

// Error handling middleware
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server http://localhost:${PORT} portda ishga tushdi`);
}).on('error', (err) => {
    console.error('Server ishga tushish xatosi:', err);
});

module.exports = app;
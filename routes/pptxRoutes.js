const express = require('express');
const router = express.Router();
const { processTextPptx } = require('../controllers/pptxController');

router.post('/process-text-pptx', processTextPptx);

module.exports = router;
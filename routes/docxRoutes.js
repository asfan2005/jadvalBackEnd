const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { processTextTests, processFileTests } = require('../controllers/docxController');

router.post('/process-text-tests', processTextTests);
router.post('/process-file-tests', upload.single('file'), processFileTests);

module.exports = router;
const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

// POST /api/convert-to-word
router.post('/convert-to-word', wordController.convertToWord);

module.exports = router;
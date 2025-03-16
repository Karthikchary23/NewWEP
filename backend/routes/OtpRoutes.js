const express = require('express');
const router = express.Router();
const { handleOtpRequest } = require('../Controllers/OtpController');
router.post('/send-otp', handleOtpRequest);
module.exports = router;
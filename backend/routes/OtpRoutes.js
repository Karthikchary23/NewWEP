const express = require('express');
const router = express.Router();
const { handleOtpRequest } = require('../Controllers/OtpController');
const { ServiceprovideSignInOtpRequest} = require('../Controllers/LoginOtpContoller');

router.post('/send-otp', handleOtpRequest);
router.post('/serviceprovidersigninotpsend-otp', ServiceprovideSignInOtpRequest);
module.exports = router;
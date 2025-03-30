const express = require('express');
const router = express.Router();
const { handleOtpRequest } = require('../Controllers/OtpController');
const { ServiceprovideSignInOtpRequest} = require('../Controllers/LoginOtpContoller');
const{OtpVerification}=require("../Controllers/OtpVerification")
router.post('/send-otp', handleOtpRequest);
router.post('/serviceprovidersigninotpsend-otp', ServiceprovideSignInOtpRequest);
router.post('/otpverification',OtpVerification)
module.exports = router;
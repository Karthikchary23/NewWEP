const express = require('express');
const router = express.Router();
const {customerSignUp} = require('../Controllers/CustomerAuth');
const {CustomerSignInOtpRequest}= require('../Controllers/CustomerSigninOtp');
const {CustomerLogin}= require('../Controllers/CustomerSignin');
router.post('/customersignup', customerSignUp);
router.post('/customerdashboardsigninotpsend-otp', CustomerSignInOtpRequest);
router.post('/signin', CustomerLogin);

module.exports = router;

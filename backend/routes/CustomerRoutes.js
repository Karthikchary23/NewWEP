const express = require('express');
const router = express.Router();
const {customerSignUp} = require('../Controllers/CustomerAuth');
router.post('/customersignup', customerSignUp);
module.exports = router;

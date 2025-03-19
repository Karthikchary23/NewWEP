const express = require('express');
const router = express.Router();
const {requestService}=require('../Controllers/RequestController')
router.post('/request-service', requestService);

module.exports = router;
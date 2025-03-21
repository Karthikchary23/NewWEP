const express = require('express');
const router = express.Router();
const {requestService}=require('../Controllers/RequestController')
const {Updaterequest}=require('../Controllers/Requestupdate')

router.post('/request-service', requestService);
router.post('/requestupdate',Updaterequest)

module.exports = router;
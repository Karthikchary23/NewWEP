const express = require('express');
const router = express.Router();
const {requestService}=require('../Controllers/RequestController')
const {Updaterequest}=require('../Controllers/Requestupdate')
const {AcceptedRequests} = require('../Controllers/AcceptedRequests')

router.get('/acceptedrequests',AcceptedRequests);
router.post('/request-service', requestService);
router.post('/requestupdate',Updaterequest)

module.exports = router;
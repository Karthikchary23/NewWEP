const express = require('express');
const router = express.Router();
const {requestService}=require('../Controllers/RequestController')
const {Updaterequest}=require('../Controllers/Requestupdate')
const {AcceptedRequests} = require('../Controllers/AcceptedRequests')
const {Deleterequest}=require('../Controllers/Requestupdate')

router.get('/acceptedrequests',AcceptedRequests);
router.post('/request-service', requestService);
router.post('/requestupdate',Updaterequest)
router.post('/deleterequest',Deleterequest)

module.exports = router;
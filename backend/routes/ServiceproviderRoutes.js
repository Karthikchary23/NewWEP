const express = require('express');
const { Servicesignup } = require('../controllers/Serviceproviderauth');
const { ServiceproviderSignin } = require('../Controllers/ServiceproviderLogin');
const { ServiceproviderTokenverifcation } = require('../Controllers/ServiceproviderTokenverify');
const router = express.Router();

router.post('/service-providersignup', Servicesignup);
router.post('/signin', ServiceproviderSignin);
router.post('/serviceprovidertokenverify', ServiceproviderTokenverifcation);


module.exports = router;
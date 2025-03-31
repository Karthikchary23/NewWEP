const express = require('express');
const { Servicesignup } = require('../Controllers/Serviceproviderauth');
const { ServiceproviderSignin } = require('../Controllers/ServiceproviderLogin');
const { ServiceproviderTokenverifcation } = require('../Controllers/ServiceproviderTokenverify');
const { ServiceProvicerlocationUpdate } = require('../Controllers/ServiceProviderLocation');
const{UpdateAvailablestatus}=require("../Controllers/Available")
const router = express.Router();

router.post('/service-providersignup', Servicesignup);
router.post('/signin', ServiceproviderSignin);
router.post('/serviceprovidertokenverify', ServiceproviderTokenverifcation);
router.post('/update-location',ServiceProvicerlocationUpdate)
router.post("/isavailable",UpdateAvailablestatus)

module.exports = router;
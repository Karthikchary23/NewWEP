const express = require('express');
const { Servicesignup } = require('../controllers/Serviceproviderauth');
const { ServiceproviderSignin } = require('../Controllers/ServiceproviderLogin');
const router = express.Router();

router.post('/service-providersignup', Servicesignup);
router.post('/signin', ServiceproviderSignin);

module.exports = router;
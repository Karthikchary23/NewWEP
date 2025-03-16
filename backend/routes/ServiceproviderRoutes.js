const express = require('express');
const { Servicesignup } = require('../controllers/Serviceproviderauth');
const router = express.Router();

router.post('/service-providersignup', Servicesignup);

module.exports = router;
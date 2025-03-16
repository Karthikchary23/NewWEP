const express = require('express');
const { Servicesignup } = require('../controllers/Serviceproviderauth');
const router = express.Router();

router.post('/servicesignup', Servicesignup);

module.exports = router;
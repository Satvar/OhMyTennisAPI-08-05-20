"use strict";
const express = require("express");
const router = express.Router();
const cityController = require("../controller/cities");


router.get('/city/:postalcode', cityController.getCitynameForPostalCode);

module.exports = router;

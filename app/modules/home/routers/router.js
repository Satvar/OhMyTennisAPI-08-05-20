"use strict";
const express = require("express");
const router = express.Router();
const uploadfile = require('../../_helpers/uploadFile');

const homeController = require("../controller/home");


router.get('/landingpage' , homeController.getalldata)
router.post('/search_for_coach' , homeController.search_for_coach)
router.post('/searchindetailforcoach' , homeController.searchindetailforcoach)


module.exports = router;
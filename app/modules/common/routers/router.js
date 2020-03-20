"use strict";
const express = require("express");
const router = express.Router();

//importing the controller
const setController = require("../controller/del");

router.get("/common/set_course", setController.insertIndividualCourse);
router.get("/common/set_data_table", setController.setDataTable);

module.exports = router;

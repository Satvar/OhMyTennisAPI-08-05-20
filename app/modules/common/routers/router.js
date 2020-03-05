"use strict";
const express = require("express");
const router = express.Router();

//importing the controller
const setController = require("../controller/del");

router.get(
  "/common/set_individual_course",
  setController.insertIndividualCourse
);

module.exports = router;

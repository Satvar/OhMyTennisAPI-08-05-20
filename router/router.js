"use strict";
const express = require("express");
const router = express.Router();

const user = require("../app/modules/user/routers/router");
const coach = require("../app/modules/coach/routers/router");
const admin = require("../app/modules/admin/routers/router");
const cities = require("../app/modules/cities/routers/router");
const course = require("../app/modules/course/routers/router");
const coachdetails = require("../app/modules/coachdetails/routers/router");
const calender = require("../app/modules/calender/routers/router");
const home = require("../app/modules/home/routers/router");

const common = require("../app/modules/common/routers/router");

router.use("/", user);
router.use("/", coach);
router.use("/", cities);
router.use("/", course);
router.use("/", calender);
router.use("/", coachdetails);
router.use("/", admin);
router.use("/", home);
router.use("/", common);
module.exports = router;

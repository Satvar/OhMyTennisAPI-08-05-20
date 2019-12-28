"use strict";
const express = require("express");
const router = express.Router();

//importing the controller
const coachDetailController = require("../controller/coachdetail");

router.post('/coachdetail/bookcourse', coachDetailController.bookCourse);
router.get('/coachdetail/getbookcourse', coachDetailController.getCourseReservation);
router.get('/coachdetail/getevent', coachDetailController.search_for_event);
router.get('/coachdetail/geteventtop3', coachDetailController.search_for_event_top_3);
router.get('/coachdetail/getallcourse', coachDetailController.getall_course);
router.post('/coachdetail/getcoachbyevent', coachDetailController.getCoachbyevent);
router.get('/coachdetail/geteventbyid', coachDetailController.getEventbyId);

module.exports = router;
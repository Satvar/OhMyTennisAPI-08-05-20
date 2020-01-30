"use strict";
const express = require("express");
const router = express.Router();

//importing the controller
const coachController = require("../controller/coach");

router.post("/coach/getcoachbyid", coachController.getcoachbyid);
router.get("/coach/getallcoaches", coachController.getallcoaches);
router.post("/coach/insertavailabilty", coachController.insertAvailability);
router.get("/coach/getavailabilty", coachController.getAvailability);
router.get("/coach/getreservation", coachController.getReservation);
router.get("/coach/getcoachbycity", coachController.search_for_coach);
router.post("/coach/setreservation", coachController.coachReservation);
router.post("/coach/setStatus", coachController.setStatus);
router.get("/coach/findyourCoach", coachController.find_your_coach);
router.get("/coach/getTimeslot", coachController.getTime_slot);
router.post("/coach/setpayment", coachController.setpayment);
router.get("/coach/BookingDetail", coachController.getBookingDetail);
router.get(
  "/coach/getdemandavailability",
  coachController.getDemandAvailability
);
router.get("/coach/getslotavailability", coachController.getslotAvailability);
router.post("/coach/setclubavailability", coachController.setClubavailability);
router.get("/coach/getClubTimeslot", coachController.getClubTime_slot);
router.get("/coach/getDemandprice", coachController.getDemandPrice);
router.get(
  "/coach/CoachCalendarAvaiabilityForUser",
  coachController.getallavailabilityforCoachDetail
);
router.get("/coach/searchByCoach", coachController.searchByCoach);

module.exports = router;

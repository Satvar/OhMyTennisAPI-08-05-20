"use strict";
const express = require("express");
const router = express.Router();

//importing the controller
const coachController = require("../controller/coach");

router.post("/coach/getcoachbyid", coachController.getcoachbyid);
router.get("/coach/getallcoaches", coachController.getallcoaches);
router.post("/coach/insertavailabilty", coachController.insertAvailability);
router.get("/coach/getavailabilty", coachController.getAvailability);
router.get("/coach/getreservation", coachController.getReservations);
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

router.get("/coach/getcoachbycode/:code", coachController.getCoachByPostalcode);
// Get coach detail by id
router.post("/coach/getcoachdetailbyid", coachController.getcoachdetailbyid);

//Get GeoLocation based on Postal code
router.get(
  "/coach/geolocationByPostalCode/:id",
  coachController.geolocationByPostalCode
);

router.get(
  "/coach/get_remaining_slot/:coach_id/:user_id/:booking_course",
  coachController.get_remaining_slot
);

router.get(
  "/coach/get_avail_ten_is_or_not/:coach_id/:date",
  coachController.get_avail_ten_is_or_not
);

module.exports = router;

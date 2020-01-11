"use strict";
const express = require("express");
const router = express.Router();
// const uploadfile = require('../../_helpers/uploadFile');
// const passportFacebook = require('../../_helpers/auth/facebook');
// const passport = require('passport')
// const passportInstagram = require('../../_helpers/auth/instagram'); //check fot this when testing
// const FacebookStrategy = require('passport-facebook').Strategy;
// const auth = require('../../../../middleware/auth');
//importing the controller
const adminController = require("../controller/admin");
const userController = require("../controller/user");
const coachController = require("../controller/coach");
const courtController = require("../controller/court");
const paymentController = require("../controller/payment");
const serviceController = require("../controller/service");

router.post("/admin/create", adminController.registerAdmin);
router.post("/admin", adminController.loginAdmin);
router.post("/admin/forgotPassword", adminController.forgotPassword);
router.post("/admin/resetPassword", adminController.resetPassword);
router.post("/admin/changePassword", adminController.changePassword);
router.post("/admin/updateProfile", adminController.updateProfile);
router.get("/admin/getAdminDetails", adminController.getAdminDetails);
router.post("/admin/adminstatus", adminController.changeadminstatus);
router.post("/admin/getAdminbyid", adminController.getadminbyid);
router.get("/admin/getUsers", userController.index);
router.post("/admin/getuserbyid", userController.getuserbyid);
router.get("/admin/getcoaches", coachController.getallcoaches);
router.post("/admin/getcoachbyid", coachController.getcoachbyid);
router.post(
  "/admin/get_payment_coach_by_id",
  coachController.get_payment_coach_by_id
);
router.post("/admin/updatecoachProfile", coachController.updatecoachProfile);
router.post("/admin/coachstatustoactive", coachController.coachstatustoactive);
router.post(
  "/admin/coachstatustoinactive",
  coachController.coachstatustoinactive
);
router.post("/admin/userstatustoactive", userController.userstatustoactive);
router.post("/admin/userstatustoinactive", userController.userstatustoinactive);
router.post("/admin/updateuserProfile", userController.updateUserProfile);
router.post("/admin/createcourt", courtController.insertcourt);
router.post("/admin/updatecourt", courtController.updatecourt);
router.post("/admin/getcourtbyid", courtController.getcourtbyid);
router.post("/admin/courtstatustoactive", courtController.courtstatustoactive);
router.post(
  "/admin/courtstatustoinactive",
  courtController.courtstatustoinactive
);
router.get("/admin/getallcourts", courtController.getallcourts);
router.get("/admin/getallbookings", paymentController.getallbookings);
router.post("/admin/serviceprovider", serviceController.insertservice);
router.get("/admin/individuelservice", serviceController.getindividuelservice);
router.get("/admin/collectiveservice", serviceController.getcollectiveservice);
router.get("/admin/courtservice", serviceController.getcourtservice);
router.get("/admin/stageservice", serviceController.getstageservice);
router.get("/admin/teamservice", serviceController.getteamservice);
router.get("/admin/animationservice", serviceController.getanimationservice);
router.get("/admin/tournoiservice", serviceController.gettournoiservice);
router.get("/admin/getallcount", adminController.getallcount);
router.post("/admin/getclubbyid", courtController.getclubbyid);
router.post("/admin/getclubbypostal", courtController.getbypostal);
router.get("/admin/getallcoach", paymentController.getCoach);
router.post(
  "/admin/getbookinganduserdetails",
  paymentController.getbookinganduserdetails
);
router.get("/admin/getservice", serviceController.getservice);
router.post("/admin/createcustomerac", paymentController.createcustomerac);
router.post(
  "/admin/checkcustomeraccount",
  paymentController.CheckCustomerAccount
);

module.exports = router;

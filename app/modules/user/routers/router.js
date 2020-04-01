"use strict";
const express = require("express");
const router = express.Router();
const passportFacebook = require("../../_helpers/auth/facebook");
const passport = require("passport");
const passportInstagram = require("../../_helpers/auth/instagram"); //check fot this when testing
const FacebookStrategy = require("passport-facebook").Strategy;
const auth = require("../../../../middleware/auth");
//importing the controller
const userController = require("../controller/user");

router.get("/", userController.welcome);
router.get("/users", userController.index);
router.post("/user/register/user", userController.registerUser);
router.post("/user/register/user_set_table", userController.user_set_table);
router.post("/coach/updateprofile", userController.updateProfile);
router.post("/coach/updateProfileTab2", userController.updateProfileTab2);
router.post("/coach/updateProfileTab3", userController.updateProfileTab3);
router.post("/user/updateprofile", userController.updateUserProfile);
router.post("/user/login", userController.login);
router.post("/user/getuserbyid", userController.getuserbyid);
router.post("/user/password/forgot", userController.forgotPassword);
router.post("/user/resetpassword", userController.resetPassword);
router.post("/user/userVerification", userController.userVerification);
router.post("/user/forgotpassword", userController.forgotPassword);
router.post("/user/setNewPassword", userController.setNewPassword);
router.get("/user/getCoachDetails", userController.getCoachDetails);
router.post("/user/getUserDetails", userController.getUserDetails);
router.post("/user/blockCoach", userController.blockCoach);
router.post("/user/blockUser", userController.blockUser);
router.post("/user/UnblockUser", userController.unBlockUser);
router.post("/user/deleteUser", userController.deleteUser);
router.get("/user/getreservation", userController.getUserReservation);
router.post("/user/cancelreservation", userController.cancelReservation);
router.post("/user/cancelreservations", userController.cancelReservations);

//social logins

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/auth/instagram", passportFacebook.authenticate("instagram"));

router.get(
  "/auth/facebook/callback",
  passportFacebook.authenticate("facebook", { failureRedirect: "/" }), //user userlogin route instead of /login
  function(req, res) {
    console.log("===========", res);
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/#!/OhMyTennis/AdminPanel/");
  }
);
router.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/login" }), //user userlogin route instead of /login
  function(req, res) {
    console.log("===========", res);
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

router.post(
  "/user/getallreservationcounts",
  userController.getallusercoursecount
);

// User account delete by email id
router.post("/user/accountdeletebyemail", userController.accountdeletebyemail);

module.exports = router;

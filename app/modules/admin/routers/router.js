"use strict";
const express = require("express");
const router = express.Router();
var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    //console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  }
});
var upload = multer({ storage: storage });

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
const cmsController = require("../controller/cms");
const menuController = require("../controller/menu");

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
//Content Management System

//-------------------------
router.post("/admin/cms/add", cmsController.create);
router.get("/admin/cms/getCms", cmsController.getCms);
router.get("/admin/cms/getcmsmenu", cmsController.getcmsmenu);
router.get("/admin/cms/getCmsData/:endpoint", cmsController.getCmsData);
router.post("/admin/cms/getCmsValue", cmsController.getCmsvalue);
router.post("/admin/cms/del", cmsController.delete);

router.post("/admin/cms/delmenu", cmsController.deleteMenu);

router.post("/admin/cms/update", cmsController.update);

router.post("/admin/cmsfileupload", upload.single("upload"), function(
  req,
  res,
  next
) {
  //console.log(req.file);
  //console.log(req.body.CKEditorFuncNum);
  if (!req.file) {
    res.status(500);
    return next(err);
  }
  //var message = "";
  //var CKEditorFuncNum = 0;
  var fileUrl = "http://192.168.1.32:3004/images/" + req.file.filename;
  //console.log(fileUrl);
  // var data =
  //   "window.parent.CKEDITOR.tools.callFunction(" +
  //   CKEditorFuncNum +
  //   ", " +
  //   fileUrl +
  //   ", " +
  //   message +
  //   ")";
  //res.send(data);
  res.json({ fileName: req.file.filename, uploaded: true, url: fileUrl });
});

router.get("/admin/menu", menuController.getAll);
router.post("/admin/menu/create/parent", menuController.createParent);
router.post("/admin/menu/create", menuController.create);

router.get("/admin/menu/view", menuController.view);

router.get("/admin/menu/toptree", menuController.topTree);

router.get("/admin/menu/bottomtree", menuController.bottomTree);

router.get("/admin/menu/getname", menuController.getname);

router.get("/admin/menu/list", menuController.list);

router.get("/admin/editmenu/:id", menuController.editmenu);

router.post("/admin/menu/createprimarymenu", menuController.createprimarymenu);

router.get("/admin/getprimarymenu/:id", menuController.getprimarymenu);

router.post("/admin/menu/menuDelete", menuController.menuDelete);

router.post(
  "/admin/menu/createsecondarymenu",
  menuController.createsecondarymenu
);

module.exports = router;

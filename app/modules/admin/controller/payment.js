const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const appConfig = require("../../../../config/appConfig");
const mail_template = require("../../MailTemplate/mailTemplate");

exports.getallbookings = async function(req, res, next) {
  var _output = new output();
  await db_library
    .execute(
      "SELECT booking_dbs.booking_Id,booking_dbs.bookingCourse,booking_dbs.status,booking_dbs.amount,users.firstName,users.lastName,users.postalCode FROM `booking_dbs` JOIN users ON booking_dbs.Coach_ID = users.id"
    )
    .then(value => {
      var obj = {
        booking_list: value
      };
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = "Booking Data Successfully";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Booking Data Failed";
    });

  res.send(_output);
};

exports.getCoach = async function(req, res, next) {
  console.log("[payments.js--getCoach--]");
  var _output = new output();
  await db_library
    .execute(
      "SELECT `Coach_ID`, `Coach_Fname`, `Coach_Lname` FROM `coaches_dbs`"
    )
    .then(value => {
      console.log("[payments.js--getCoach--]", value);
      var obj = {
        coach_list: value
      };
      console.log(obj);
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = "Get coach list Successfully";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get coach list Failed";
    });

  res.send(_output);
};

// exports.getCoachById = async function(req, res, next) {
//   const coach_id = req.body.coach_id;
//   var _output = new output();

//   if (coach_email != "") {
//     await db_library
//       .execute("SELECT * FROM `coaches_dbs` WHERE Coach_ID ='" + coach_id + "'")
//       .then(value => {
//         if (value.length > 0) {
//           var obj = {
//             coach_list: value
//           };
//           var result = obj;
//           _output.data = result;
//           _output.isSuccess = true;
//           _output.message = "Get coach successfull";
//         } else {
//           _output.data = {};
//           _output.isSuccess = true;
//           _output.message = " No coach found";
//         }
//       })
//       .catch(err => {
//         _output.data = err.message;
//         _output.isSuccess = false;
//         _output.message = "Get coach failed";
//       });
//   } else {
//     _output.data = "Required field are missing";
//     _output.isSuccess = false;
//     _output.message = "Get coach failed";
//   }
//   res.send(_output);
// };

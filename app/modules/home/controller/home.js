const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");

exports.searchindetailforcoach = async function(req, res, next) {
  var _output = new output();
  const city = req.body.city;
  const coursedate = req.body.searchDate;
  const session = req.body.session;
  var query_string =
    'SELECT *FROM coaches_dbs INNER JOIN availability_dbs ON coaches_dbs.Coach_ID = availability_dbs.Coach_id where coaches_dbs.Coach_City="' +
    city +
    '" and  CAST( "' +
    coursedate +
    '"  AS datetime) between CAST(availability_dbs.Start_Date AS datetime ) and CAST(availability_dbs.End_Date AS datetime) AND availability_dbs.' +
    session +
    ' = "Y"';

  await db_library
    .execute("SELECT")
    .then(value => {
      var result = value;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = "Coaches Get Successfull";
    })
    .catch(err => {
      _output.data = error.message;
      _output.isSuccess = false;
      _output.message = "No coaches available";
    });
};

exports.getallCourscount = async function(req, res, next) {
  var _output = new output();
  const Coach_id = req.body.Coach_ID;
  // console.log(Coach_id);
  var CoursIndividuel;
  var CoursCollectifOndemand;
  var CoursCollectifClub;
  var Stage;
  var Tournament;

  await db_library
    .execute(
      `select count(*) from booking_dbs s join users u on s.user_Id = u.id where bookingCourse = "CoursIndividuel" AND Coach_Id = ` +
        Coach_id
    )
    .then(value => {
      CoursIndividuel = value[0]["count(*)"];
    });
  await db_library
    .execute(
      `select count(*) from booking_dbs s join users u on s.user_Id = u.id where bookingCourse = "CoursCollectifOndemand" AND Coach_Id = ` +
        Coach_id
    )
    .then(value => {
      CoursCollectifOndemand = value[0]["count(*)"];
    });

  await db_library
    .execute(
      `select count(*) from booking_dbs s join users u on s.user_Id = u.id where bookingCourse = "CoursCollectifClub" AND Coach_Id = ` +
        Coach_id
    )
    .then(value => {
      CoursCollectifClub = value[0]["count(*)"];
    });

  await db_library
    .execute(
      `select count(*) from booking_dbs s join users u on s.user_Id = u.id where bookingCourse = "Stage" AND Coach_Id = ` +
        Coach_id
    )
    .then(value => {
      Stage = value[0]["count(*)"];
    });
  await db_library
    .execute(
      `select count(*) from booking_dbs s join users u on s.user_Id = u.id where bookingCourse = "Tournoi" AND Coach_Id = ` +
        Coach_id
    )
    .then(value => {
      Tournament = value[0]["count(*)"];
    });
  await db_library
    .execute(
      `select count(*) from booking_dbs s join users u on s.user_Id = u.id where bookingCourse = "TeamBuilding" AND Coach_Id = ` +
        Coach_id
    )
    .then(value => {
      TeamBuilding = value[0]["count(*)"];
    });

  await db_library
    .execute(
      `select count(*) from booking_dbs s join users u on s.user_Id = u.id where bookingCourse = "Animation" AND Coach_Id = ` +
        Coach_id
    )
    .then(value => {
      Animation = value[0]["count(*)"];
    });

  var obj = {
    CoursIndividuel: CoursIndividuel,
    CoursCollectifOndemand: CoursCollectifOndemand,
    CoursCollectifClub: CoursCollectifClub,
    Stage: Stage,
    Tournament: Tournament,
    TeamBuilding: TeamBuilding,
    Animation: Animation
  };
  _output.data = obj;
  _output.isSuccess = true;
  _output.message = "Get Successfull";
  res.send(_output);
};

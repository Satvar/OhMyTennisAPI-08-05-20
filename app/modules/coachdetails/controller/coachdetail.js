const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const mail_template = require("../../MailTemplate/mailTemplate");
const appConfig = require("../../../../config/appConfig");
const moment = require("moment");
const lang = require("../../../lang/language").franchContent;

function formatDate(date) {
  var formate_date = moment(date).format("YYYY-MM-DD");
  return formate_date;
}

exports.bookCourse = async function(req, res, next) {
  var _output = new output();
  const Coach_id = req.body.Coach_id;
  const user_Id = req.body.user_Id;
  const status = req.body.status;
  const booking_date = req.body.booking_date;
  const course = req.body.course;
  const amount = req.body.amount;
  const bookingEnd = req.body.bookingEnd;
  const reserve = req.body.reserve;

  if (
    user_Id != "" &&
    Coach_id != "" &&
    status != "" &&
    booking_date != "" &&
    bookingEnd != "" &&
    course != ""
  ) {
    if (amount == "" || amount == undefined) {
      var insert_qry =
        "INSERT INTO `booking_dbs`(`Coach_ID`, `user_Id`, `status`, `bookingDate`, `bookingEnd`, `bookingCourse`, `amount`) " +
        "VALUES (" +
        Coach_id +
        "," +
        user_Id +
        ",'" +
        status +
        "','" +
        formatDate(booking_date) +
        "','" +
        formatDate(bookingEnd) +
        "','" +
        course +
        "',0)";
      //console.log(insert_qry);
    } else {
      var insert_qry =
        "INSERT INTO `booking_dbs`(`Coach_ID`, `user_Id`, `status`, `bookingDate`, `bookingEnd`, `bookingCourse`, `amount`) " +
        "VALUES (" +
        Coach_id +
        "," +
        user_Id +
        ",'" +
        status +
        "','" +
        formatDate(booking_date) +
        "','" +
        formatDate(bookingEnd) +
        "','" +
        course +
        "'," +
        amount +
        ")";
    }

    var sel_qry = "SELECT * FROM `users` where `id` = " + Coach_id;
    await db_library
      .execute("SELECT * FROM `users` where `id` = " + user_Id)
      .then(async value => {
        if (value.length > 0) {
          user_details = value;
        }
      });

    if (course == "Stage") {
      await db_library
        .execute(insert_qry)
        .then(async value => {
          if (value.affectedRows > 0) {
            await db_library
              .execute(sel_qry)
              .then(async val => {
                if (val.length > 0) {
                  var mailTemplate = await mail_template.getMailTemplate(
                    appConfig.MailTemplate.CoachAcceoptance
                  );
                  const mailOption = require("../../_mailer/mailOptions");
                  let _mailOption = new mailOption();
                  _mailOption.to = val[0].email;
                  _mailOption.subject = lang.booking_request;
                  _mailOption.html = mailTemplate[0].template
                    .replace(
                      "{{username}}",
                      val[0].firstName + " " + val[0].lastName
                    )
                    .replace(
                      "{{user}}",
                      user_details[0].firstName + " " + user_details[0].lastName
                    )
                    .replace("{{date}}", formatDate(booking_date))
                    .replace("{{course}}", course);
                  var _mailer = require("../../_mailer/mailer");
                  _mailer.sendMail(_mailOption);
                  _output.data = {};
                  _output.isSuccess = true;
                  _output.message = "Réservation réussie";
                }
              })
              .catch(err => {
                //console.log(err);
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Réservation réussie";
              });
          }
        })
        .catch(err => {
          //console.log(err.message);
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "La réservation a échoué";
        });
    } else {
      await db_library
        .execute(insert_qry)
        .then(async value => {
          if (value.affectedRows > 0) {
            var comapny = "";
            var address = "";
            if (course != "Stage") {
              const {
                Coach_Id,
                User_Id,
                Course,
                Name_of_company,
                Email,
                Mobile,
                Date,
                Address,
                Postalcode,
                Level,
                Number_of_person
              } = reserve[0];
              comapny = Name_of_company;
              address = Address;
              if (Course !== "Tournament") {
                var reserve_qry =
                  "INSERT INTO `reserved_course`(`Coach_Id`, `User_Id`, `booking_Id`, `Course`, `Name_of_company`, `Email`, `Mobile`, `Date`, `Address`, `Postalcode`, `Level`, `Number_of_person`)" +
                  " VALUES (" +
                  Coach_Id +
                  "," +
                  user_Id +
                  "," +
                  value.insertId +
                  ",'" +
                  Course +
                  "',?,'" +
                  Email +
                  "','" +
                  Mobile +
                  "','" +
                  formatDate(Date) +
                  "',?," +
                  Postalcode +
                  ",'" +
                  Level +
                  "'," +
                  Number_of_person +
                  ")";
              } else {
                var reserve_qry =
                  "INSERT INTO `reserved_course`(`Coach_Id`, `User_Id`, `booking_Id`, `Course`, `Name_of_company`, `Email`, `Mobile`, `Date`,`Level`, `Number_of_person`)" +
                  " VALUES (" +
                  Coach_Id +
                  "," +
                  user_Id +
                  "," +
                  value.insertId +
                  ",'" +
                  Course +
                  "',?,'" +
                  Email +
                  "','" +
                  Mobile +
                  "','" +
                  formatDate(Date) +
                  "','" +
                  Level +
                  "'," +
                  Number_of_person +
                  ")";
              }
            }

            await db_library
              .execute("SELECT * FROM `users` where `id` = " + user_Id)
              .then(async value => {
                if (value.length > 0) {
                  user_details = value;
                }
              });
            await db_library
              .parameterexecute(reserve_qry, [comapny, address])
              .then(async values => {
                if (values.affectedRows > 0) {
                  await db_library
                    .execute(sel_qry)
                    .then(async val => {
                      if (val.length > 0) {
                        var mailTemplate = await mail_template.getMailTemplate(
                          appConfig.MailTemplate.CoachAcceoptance
                        );
                        const mailOption = require("../../_mailer/mailOptions");
                        let _mailOption = new mailOption();
                        _mailOption.to = val[0].email;
                        _mailOption.subject = lang.booking_request;
                        _mailOption.html = mailTemplate[0].template
                          .replace(
                            "{{username}}",
                            val[0].firstName + " " + val[0].lastName
                          )
                          .replace(
                            "{{user}}",
                            user_details[0].firstName +
                              " " +
                              user_details[0].lastName
                          )
                          .replace("{{date}}", booking_date)
                          .replace("{{course}}", course);
                        var _mailer = require("../../_mailer/mailer");
                        _mailer.sendMail(_mailOption);
                        _output.data = {};
                        _output.isSuccess = true;
                        _output.message = "Réservation réussie";
                      }
                    })
                    .catch(err => {
                      //console.log(err);
                      _output.data = {};
                      _output.isSuccess = false;
                      _output.message = "Courrier non envoyé";
                    });
                }
              })
              .catch(err => {
                //console.log(err.message);
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "La réservation a échoué";
              });
          }
        })
        .catch(err => {
          //console.log(err);
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "La réservation a échoué";
        });
    }
  } else {
    _output.data = "Le champ obligatoire est manquant";
    _output.isSuccess = false;
    _output.message = "La réservation a échoué";
  }

  res.send(_output);
};

exports.getCourseReservation = async function(req, res, next) {
  var _output = new output();
  const booking_id = req.query.booking_id;

  if (booking_id != "") {
    var query =
      "SELECT * FROM `reserved_course` Where `booking_Id` = '" +
      booking_id +
      "'";
    await db_library
      .execute(query)
      .then(value => {
        var obj = {
          booking: value
        };
        var result = obj;
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Réservation réussie";
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = "La réservation a échoué";
      });
  } else {
    _output.data = "Le champ obligatoire est manquant";
    _output.isSuccess = false;
    _output.message = "La réservation a échoué";
  }
  res.send(_output);
};

exports.search_for_event = async function(req, res, next) {
  const P_postalcode = req.query.P_postalcode;
  const P_date = req.query.P_date;
  const P_course = req.query.P_course;

  var _output = new output();
  // if (ville != "" && date != "") {
  if (P_course == "Stage") {
    var query =
      "SELECT * FROM `course_stage` WHERE (('" +
      P_date +
      "' BETWEEN `from_date` AND `to_date`) or '" +
      P_date +
      "' = '0000-00-00'or '" +
      P_date +
      "' = '' or '" +
      P_date +
      "' is null) AND (`Postalcode` = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' ='') and from_date >= '" +
      formatDate(new Date()) +
      "'";
  } else if (P_course == "Tournament") {
    var query =
      "SELECT * FROM `tournament` WHERE (('" +
      P_date +
      "' BETWEEN `from_date` AND `to_date`) or '" +
      P_date +
      "' = '0000-00-00'or '" +
      P_date +
      "' = '' or '" +
      P_date +
      "' is null) AND (`Postalcode` = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' ='') and from_date >= '" +
      formatDate(new Date()) +
      "'";
  } else if (P_course == "TeamBuilding") {
    var query =
      "SELECT t.* FROM `team_building` t inner JOIN users u ON t.Coach_Id =  u.id  WHERE t.Postalcode = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' =''";
    //console.log(query);
  } else {
    var query =
      "SELECT * FROM `animations` WHERE `Postalcode` = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' =''";
  }
  //console.log(query);
  await db_library
    .execute(query)
    .then(value => {
      if (value.length > 0) {
        var obj = {
          event_list: value
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Événement réussi";
      } else {
        var obj = {
          event_list: []
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = " Aucun événement trouvé";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "L'événement a échoué";
    });
  //console.log(_output);
  res.send(_output);
};

exports.search_for_event_top_3 = async function(req, res, next) {
  const P_postalcode = req.query.P_postalcode;
  const P_date = req.query.P_date;
  const P_course = req.query.P_course;

  var _output = new output();
  // if (ville != "" && date != "") {
  if (P_course == "Stage") {
    var query =
      "SELECT * FROM `course_stage` WHERE (('" +
      P_date +
      "' BETWEEN `from_date` AND `to_date`) or '" +
      P_date +
      "' = '0000-00-00'or '" +
      P_date +
      "' = '' or '" +
      P_date +
      "' is null) AND (`Postalcode` = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' ='') and from_date >= '" +
      formatDate(new Date()) +
      "' Limit 3";
  } else if (P_course == "Tournament") {
    var query =
      "SELECT * FROM `tournament` WHERE (('" +
      P_date +
      "' BETWEEN `from_date` AND `to_date`) or '" +
      P_date +
      "' = '0000-00-00'or '" +
      P_date +
      "' = '' or '" +
      P_date +
      "' is null) AND (`Postalcode` = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' ='') and from_date >= '" +
      formatDate(new Date()) +
      "'";
  } else if (P_course == "TeamBuilding") {
    var query =
      "SELECT t.* FROM `team_building` t inner JOIN users u ON t.Coach_Id =  u.id  WHERE `postalCode` = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' =''";
  } else {
    var query =
      "SELECT * FROM `animations` WHERE `Postalcode` = '" +
      P_postalcode +
      "' OR '" +
      P_postalcode +
      "' =''";
  }
  // console.log(query);
  await db_library
    .execute(query)
    .then(value => {
      if (value.length > 0) {
        var obj = {
          event_list: value
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Événement réussi";
      } else {
        var obj = {
          event_list: []
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = " Aucun événement trouvé";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "L'événement a échoué";
    });
  //console.log(_output);
  res.send(_output);
};

exports.getall_course = async function(req, res, next) {
  var _output = new output();
  const P_course = req.query.P_course;

  //console.log(formatDate(new Date()));
  var query;
  if (P_course == "Stage") {
    query =
      "SELECT * FROM `course_stage` where from_date >= '" +
      formatDate(new Date()) +
      "';";
  } else if (P_course == "Tournament") {
    query =
      "SELECT * FROM `tournament` where from_date >= '" +
      formatDate(new Date()) +
      "';";
  } else if (P_course == "Animation") {
    query =
      "SELECT id,Description,Location,Postalcode,Eventdetails,Price,filename,Plan,Coach_Id,Photo FROM `animations`;";
  } else {
    query = "SELECT * FROM `team_building`;";
  }

  //console.log("query", query);

  await db_library
    .execute(query)
    .then(value => {
      if (value.length > 0) {
        var obj = {
          event_list: value
        };
        console.log(obj);
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Événement réussi";
      } else {
        var obj = {
          event_list: []
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Aucun événement trouvé";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "L'événement a échoué";
    });
  res.send(_output);
};

exports.getAllCourses = async function(req, res, next) {
  var _output = new output();
  const P_course = req.query.P_course;
  const coach_id = req.query.coach_id;

  //console.log(req.query);
  var query;
  if (P_course == "Stage" && coach_id != "") {
    query =
      "SELECT c.Coach_ID, u.Id as userId, cs.* FROM coaches_dbs c inner join `users` u on c.Coach_Email = u.email inner join course_stage cs on u.id = cs.Coach_Id WHERE cs.from_date >= '" +
      formatDate(new Date()) +
      "' AND c.Coach_ID = '" +
      coach_id +
      "'";
  } else if (P_course == "Tournament" && coach_id != "") {
    query =
      "SELECT c.Coach_ID, u.Id as userId, t.* FROM coaches_dbs c inner join `users` u on c.Coach_Email = u.email inner join tournament t on u.id = t.Coach_Id WHERE t.from_date >= '" +
      formatDate(new Date()) +
      "' AND c.Coach_ID = '" +
      coach_id +
      "'";
  } else if (P_course == "Animation") {
    query =
      "SELECT id,Description,Location,Postalcode,Eventdetails,Price,filename,Plan,Coach_Id,Photo FROM `animations`;";
  } else {
    query = "SELECT * FROM `team_building`;";
  }

  //console.log("query", query);

  await db_library
    .execute(query)
    .then(value => {
      if (value.length > 0) {
        var obj = {
          event_list: value
        };
        //console.log(obj);
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Événement réussi";
      } else {
        var obj = {
          event_list: []
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Aucun événement trouvé";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "L'événement a échoué";
    });
  res.send(_output);
};

exports.getCoachbyevent = async function(req, res, next) {
  var _output = new output();
  const P_course = req.body.P_course;
  const P_CoachId = req.body.P_CoachId;

  if (P_course == "Stage") {
    var query =
      "select c.*,ci.coordonnees_gps from `course_stage` cs INNER JOIN `users` u on u.id = cs.Coach_Id INNER JOIN `coaches_dbs` c on c.Coach_Email = u.email INNER JOIN `cities` ci on ci.Code_postal = cs.Postalcode WHERE cs.Coach_Id = " +
      P_CoachId +
      ";";
  } else if (P_course == "Tournament") {
    var query =
      "select c.*,ci.coordonnees_gps from `tournament` cs INNER JOIN `users` u on u.id = cs.Coach_Id INNER JOIN `coaches_dbs` c on c.Coach_Email = u.email INNER JOIN `cities` ci on ci.Code_postal = cs.Postalcode WHERE cs.Coach_Id = " +
      P_CoachId +
      ";";
  } else if (P_course == "Animation") {
    var query =
      "select c.*,ci.coordonnees_gps from `animations` cs INNER JOIN `users` u on u.id = cs.Coach_Id INNER JOIN `coaches_dbs` c on c.Coach_Email = u.email INNER JOIN `cities` ci on ci.Code_postal = cs.Postalcode WHERE cs.Coach_Id = " +
      P_CoachId +
      ";";
  } else {
    // var query =
    //   "select c.*,ci.coordonnees_gps from `team_building` cs INNER JOIN `users` u on u.id = cs.Coach_Id INNER JOIN `coaches_dbs` c on c.Coach_Email = u.email INNER JOIN `cities` ci on ci.Code_postal = cs.Postalcode WHERE cs.Coach_Id = " +
    //   P_CoachId +
    //   ";";
    var query =
      "select c.*,ci.coordonnees_gps from `team_building` cs INNER JOIN `users` u on u.id = cs.Coach_Id INNER JOIN `coaches_dbs` c on c.Coach_Email = u.email INNER JOIN `cities` ci on ci.Code_postal = cs.Postalcode WHERE cs.Coach_Id = " +
      P_CoachId +
      ";";
  }
  // console.log(query);
  await db_library
    .execute(query)
    .then(value => {
      if (value.length > 0) {
        var obj = {
          coach_list: value
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Coach Get Successfull";
      } else {
        var obj = {
          coach_list: []
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Aucun entraîneur trouvé";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "L'entraîneur a échoué";
    });
  res.send(_output);
};

exports.getEventbyId = async function(req, res, next) {
  var _output = new output();
  const P_course = req.query.P_course;
  const P_CoachId = req.query.P_CoachId;
  const P_Eventid = req.query.P_Eventid;

  if (P_course == "Stage") {
    var query =
      "SELECT * FROM `course_stage` where `Coach_Id`=" +
      P_CoachId +
      " AND `id`=" +
      P_Eventid +
      ";";
  } else if (P_course == "Tournament") {
    var query =
      "SELECT * FROM `tournament` where `Coach_Id`=" +
      P_CoachId +
      " AND `id`=" +
      P_Eventid +
      ";";
  } else if (P_course == "Animation") {
    var query =
      "SELECT * FROM `animations` where `Coach_Id`=" +
      P_CoachId +
      " AND `id`=" +
      P_Eventid +
      ";";
  } else {
    var query =
      "SELECT * FROM `team_building` where `Coach_Id`=" +
      P_CoachId +
      " AND `id`=" +
      P_Eventid +
      ";";
  }

  await db_library
    .execute(query)
    .then(value => {
      if (value.length > 0) {
        var obj = {
          event_list: value
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Événement réussi";
      } else {
        var obj = {
          event_list: []
        };
        _output.data = obj;
        _output.isSuccess = true;
        _output.message = "Aucun événement trouvé";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "L'événement a échoué";
    });
  res.send(_output);
};

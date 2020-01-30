const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const mail_template = require("../../MailTemplate/mailTemplate");
const appConfig = require("../../../../config/appConfig");
const moment = require('moment');
const lang = require("../../../lang/language").franchContent;
const base64 = require("base-64");

exports.search_for_coach = async function (req, res, next) {
    const ville = req.query.ville;
    const date = req.query.date;
    var _output = new output();
    // if (ville != "" && date != "") {
    var query = "call filtercoach('" + ville + "','" + date + "','','')";
    await db_library
        .execute(query).then((value) => {
            if (value[0].length > 0) {
                var result = value[0];
                for (var i = 0; i < value[0].length; i++) {
                    result[i].Coach_Services = value[0][i].Coach_Services.split(',');
                }
                var obj = {
                    coach_list: result
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Coach Get Successfull";
            } else {
                var obj = {
                    coach_list: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = " No Coach Found";
            }

        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Coach Get Failed";
        });
    res.send(_output);
}


exports.getallavailabilityforCoachDetail = async function (req, res, next) {
    const coachId = req.query.coachId;
    var _output = new output();
    var query = "call CoachCalendarAvaiabilityForUser('" + coachId + "')";
    await db_library
        .execute(query).then((value) => {
            if (value[0].length > 0) {
                var result = value[0];
                var obj = {
                    coach_list: result
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = lang.coach_availability_success;
            } else {
                var obj = {
                    coach_list: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = " No Coach availability date Found";
            }

        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Coach availability date Get Failed";
        });
    // } else {
    //     _output.data = "Required Field are missing";
    //     _output.isSuccess = false;
    //     _output.message = "Coach Get Failed";
    // }
    res.send(_output);
}


exports.find_your_coach = async function (req, res, next) {
    const ville = req.query.ville;
    const date = req.query.date;
    const rayon = req.query.rayon;
    const course = req.query.course;
    var _output = new output();
    // if (ville != "" && date != "" && rayon != "" && course != "") {
    var query = "call filtercoach('" + ville + "','" + date + "','" + rayon + "','" + course + "')";
    //console.log(query);
    //var query = "SELECT * FROM users s inner join coaches_dbs c on c.Coach_Email = s.email INNER join cities ct on ct.id = s.cityId where c.Coach_Rayon = " + rayon + " AND ct.Nom_commune like '%" + ville + "%'";

    await db_library
        .execute(query).then((value) => {
            if (value.length > 0) {
                var result = value[0];
                for (var i = 0; i < value[0].length; i++) {
                    result[i].Coach_Services = value[0][i].Coach_Services.split(',');
                }
                var res = {
                    coach_list: result
                }
                _output.data = res;
                _output.isSuccess = true;
                _output.message = "Coach Get Successfull";
            } else {
                var obj = {
                    coach_list: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = " No Coach Found";
            }

        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Coach Get Failed";
        });
    // } else {
    //     _output.data = "Required Field are missing";
    //     _output.isSuccess = false;
    //     _output.message = "Coach Get Failed";
    // }
    res.send(_output);
}

// function decodeBase64Image(dataString) {
//   var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
//     response = {};

//   if (matches.length !== 3) {
//     return new Error("Invalid input string");
//   }

//   response.type = matches[1];
//   response.data = new Buffer(matches[2], "base64");

//   return response;
// }

exports.searchByCoach = async function (req, res, next) {
    //console.log("coach.js > searchbycoach > ", req.query)
    const ville = req.query.ville;
    const date = req.query.date;
    const rayon = req.query.rayon;
    const course = req.query.course;
    var _output = new output();

    // if (ville != "" && date != "" && rayon != "" && course != "") {
    //var query = "call filtercoach('" + ville + "','" + date + "','" + rayon + "','" + course + "')";
    //console.log(query);
    // var query = "SELECT * FROM users s inner join coaches_dbs c on c.Coach_Email = s.email INNER join cities ct on ct.id = s.cityId where c.Coach_Rayon = " + rayon + " AND ct.Nom_commune like '%" + ville + "%'";

    var where = "";
    if (ville !== "") {
        const postalCode = ville.trim();
        where += " AND u.postalCode = '" + postalCode + "'";
    }
    if (course !== "") {
        const courses = course.trim();
        where += " AND c.Coach_Services LIKE '%" + courses + "%'";
    }
    if (date) {
        where += " AND a.Date = '"+ date + "'"
    }
    
    var query =
      "SELECT DISTINCT c.Coach_Fname, c.Coach_ID, c.InstagramURL, c.TwitterURL,c.FacebookURL, c.Coach_Phone, c.Coach_Lname, c.Coach_Email, c.Coach_Price, c.Coach_PriceX10, c.Coach_Description, c.Coach_Services, u.Id FROM coaches_dbs c inner join users u on c.Coach_Email = u.email left join avaiablity a on u.id = a.CoachId WHERE u.roleId = 2 AND u.isActive = 1" +
      where;

    //console.log(query);
    await db_library
      .execute(query)
      .then(value => {
        //console.log(value)
        if (value.length > 0) {
          var result = value;
          for (var i = 0; i < value.length; i++) {
            result[i].Coach_Services = value[i].Coach_Services.split(",");

            // var encoded = value[i].Coach_Image.replace(/^data:image\/\w+;base64,/, "");
            // if (encoded != "") {
            //   var bytes = base64.decode(encoded);
            //   result[i].Coach_Image = utf8.decode(bytes);
            // } else {
            //   result[i].Coach_Image = "";
            // }

            //console.log(text);
          }
          var res = {
            coach_list: result
          };
          //console.log(res)
          _output.data = res;
          _output.isSuccess = true;
          _output.message = "Coach Get Successfull";
        } else {
          var obj = {
            coach_list: []
          };
          _output.data = obj;
          _output.isSuccess = true;
          _output.message = " No Coach Found";
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = "Coach Get Failed";
      });
    // } else {
    //     _output.data = "Required Field are missing";
    //     _output.isSuccess = false;
    //     _output.message = "Coach Get Failed";
    // }
    res.send(_output);
}

exports.getallcoaches = async function (req, res, next) {
    var _output = new output();
    var query = "SELECT `Coach_ID`, `Coach_Fname`, `Coach_Lname`, `Coach_Email`, `Coach_Phone`, `Coach_transport`, `Coach_City`, `Coach_Image`, `Coach_Status`, `Coach_Description`, `Coach_Experience`, `User_type` FROM `coaches_dbs` LIMIT 10";
    await db_library
        .execute(query).then((value) => {
            var obj = {
                coach_list: value
            }
            var result = obj;
            _output.data = result;
            _output.isSuccess = true;
            _output.message = "Coaches Get Successfull";
        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Coaches Get Failed";
        });
    res.send(_output);
}

exports.getcoachbyid = async function (req, res, next) {
    const coach_email = req.body.Coach_Email;
    var _output = new output();

    if (coach_email != "") {
        await db_library
            .execute("SELECT * FROM `coaches_dbs` WHERE Coach_Email='" + coach_email + "'").then((value) => {
                if (value.length > 0) {
                    var obj = {
                        coach_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Coach Get Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = " No Coach Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Coach Get Failed";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Coach Get Failed";
    }
    res.send(_output);
}

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth() + 1;
    var year = date.getFullYear();

    return year + '-' + monthIndex + '-' + day;
}

exports.getAvailability = async function (req, res, next) {
    var _output = new output();
    const Coach_id = req.query.Coach_ID;
    const Course = req.query.Course;
    const Start_Date = new Date(req.query.Start_Date);
    const End_Date = new Date(req.query.End_Date);

    if (Coach_id != "" && Course != "" && Start_Date != "" && End_Date != "") {

        var Qry = "SELECT * FROM `availability_dbs` where (`Start_Date` >= '" + Start_Date + "' and `Start_Date` <='" + End_Date + "') and `Course` = '" + Course + "' and Coach_Id = " + Coach_id + "";
        await db_library.execute(Qry).then(async (val) => {
            var result = val;
            if (result.length > 0) {
                _output.data = result;
                _output.isSuccess = true;
                _output.message = "Get Successfull";
            } else {
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "No records Found";
            }
        }).catch((err) => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Get Failed";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Get Failed";
    }
    res.send(_output)
}

exports.coachReservation = async function (req, res, next) {
    var _output = new output();

    const {
        bookArray
    } = req.body;

    var coach_details;
    if (bookArray.length > 0) {
        await db_library.execute("SELECT * FROM `users` where `id` = " + bookArray[0].P_CoachId).then(async (val) => {
            if (val.length > 0) {
                coach_details = val
            }
        })

        await db_library.execute("SELECT * FROM `users` where `id` = " + bookArray[0].P_UserId).then(async (value) => {
            if (value.length > 0) {
                user_details = value
            }
        })
        for (var i = 0; i < bookArray.length; i++) {
            const {
                P_CoachId,
                P_CourseId,
                P_Date,
                P_Hour,
                P_UserId,
                P_Amount,
                P_Remarks
            } = bookArray[i]

            var hour = P_Hour.replace(' ', '').replace('- ', '-');
            var amt = P_Amount
            if (P_Amount == "") {
                amt = 0;
            }
            var query = "call proc_ins_booking(" + P_CoachId + ",'" + P_CourseId + "','" + P_Date + "','" + P_Hour + "'," + P_UserId + "," + amt + ",'" + P_Remarks + "')";
            await db_library.execute(query).then(async (val) => {
                if (val) {

                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "Booking Successfully Inserted";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = "Booking Inserted Failed";
                }
            }).catch((err) => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Booking Inserted Failed";
            })
        }
        if (_output.message == "Booking Successfully Inserted") {
            var mailTemplate = await mail_template.getMailTemplate(appConfig.MailTemplate.CoachAcceoptance);
            const mailOption = require('../../_mailer/mailOptions');
            let _mailOption = new mailOption();
            _mailOption.to = coach_details[0].email;
            _mailOption.subject = lang.booking_request
            _mailOption.html = mailTemplate[0].template.replace('{{username}}', coach_details[0].firstName + " " + coach_details[0].lastName).replace('{{user}}', user_details[0].firstName + " " + user_details[0].lastName).replace('{{date}}', bookArray[0].P_Date).replace('{{course}}', bookArray[0].P_CourseId);
            var _mailer = require('../../_mailer/mailer');
            _mailer.sendMail(_mailOption);
        }
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Booking Inserted Failed";
    }
    res.send(_output);
}



exports.getReservation = async function (req, res, next) {
    var _output = new output();
    const Coach_id = req.query.Coach_ID;

    if (Coach_id != "") {
        var Qry = `select booking_Id,BookingTime,Coach_ID,amount,bookingCourse, d.CourseName,(select DATE_FORMAT(bookingDate, '%Y-%m-%d')) as bookingDate,discount_club,paymentStatus,payment_Id,status,user_Id, u.firstName, u.lastName,s.Remarks from booking_dbs s
        inner join course_dbs d on s.bookingCourse = d.Course_Shotname
        inner join users u on s.user_Id = u.id where Coach_Id = ` + Coach_id;
        await db_library.execute(Qry).then(async (val) => {
            var result = val;
            if (result.length > 0) {
                var obj = {
                    booking: result
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Get Successfull";
            } else {
                var obj = {
                    booking: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "No records Found";
            }
        }).catch((err) => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Get Failed";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Get Failed";
    }
    res.send(_output)
}

exports.getBookingDetail = async function (req, res, next) {
    var _output = new output();
    const booking_Id = req.query.booking_Id;
    if (booking_Id != "") {

        var Qry = "SELECT b.*,u.email FROM `booking_dbs` b LEFT JOIN `users` u on b.`user_Id` = u.id where  booking_Id  = " + booking_Id + "";
        await db_library.execute(Qry).then(async (val) => {
            var result = val;
            if (result.length > 0) {
                var obj = {
                    availabilty: result
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Get Successfull";
            } else {
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "No records Found";
            }
        }).catch((err) => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Get Failed";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Get Failed";
    }
    res.send(_output)
}

exports.setStatus = async function (req, res, next) {
    var _output = new output();
    const discount = req.body.discount;
    const Coach_id = req.body.Coach_ID;
    const user_Id = req.body.user_Id;
    const status = req.body.status;
    const booking_id = req.body.booking_id;
    const amount = req.body.amount;
    const booking_date = req.body.booking_date;
    const booking_time = req.body.booking_time;
    const course = req.body.course;

    if (Coach_id != "" && status != "" && booking_id != "" && booking_date != "" && course != "") {

        if (course == 'CoursCollectifOndemand') {
            var update_qry = "UPDATE `booking_dbs` SET `status`= '" + status + "' ,`discount_club`= '" + discount + "',`amount`= '" + amount + "' WHERE `Coach_id`=" + Coach_id + " AND `bookingDate`='" + booking_date + "' AND `bookingCourse`='" + course + "'";

            var sel_qry = "SELECT b.booking_id as booking_id,s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, c.firstName coachfirstname, c.lastName as CoachLastname FROM `booking_dbs` b INNER JOIN users s on b.user_id = s.id INNER JOIN users c on b.Coach_ID = c.id where b.bookingCourse='" + course + "' AND b.bookingDate ='" + booking_date + "' AND b.Coach_ID = " + Coach_id + " AND b.BookingTime = '" + booking_time + "'"
            // var sel_qry = "SELECT s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, c.firstName coachfirstname, c.lastName as CoachLastname FROM `booking_dbs` b INNER JOIN users s on b.user_id = s.id INNER JOIN users c on b.Coach_ID = c.id where b.booking_Id =" + booking_id + ""
        } else if (course == 'CoursIndividuel') {
            // var update_qry = "UPDATE `booking_dbs` SET `status`= '" + status + "' ,`discount_club`= '" + discount + "',`amount`= '" + amount + "' WHERE `Coach_id`=" + Coach_id + " AND `booking_id`=" + booking_id + "";
            var update_qry = "call proc_set_booking_status(" + booking_id + "," + amount + ",'" + status + "')"
            var sel_qry = "SELECT s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, c.firstName coachfirstname, c.lastName as CoachLastname FROM `booking_dbs` b INNER JOIN users s on b.user_id = s.id INNER JOIN users c on b.Coach_ID = c.id where b.booking_Id =" + booking_id + ""

        }
        else if (course == 'Stage' || course == 'Tournoi' || course == 'TeamBuilding' || course == 'Animation') {
            var update_qry = "UPDATE `booking_dbs` SET `status`= '" + status + "' ,`amount`= '" + amount + "' WHERE booking_id =" + booking_id + "";
            var sel_qry = "SELECT s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, c.firstName coachfirstname, c.lastName as CoachLastname FROM `booking_dbs` b INNER JOIN users s on b.user_id = s.id INNER JOIN users c on b.Coach_ID = c.id where b.booking_Id =" + booking_id + ""
        }
        else {
            var update_qry = "UPDATE `booking_dbs` SET `status`= '" + status + "' ,`discount_club`= '" + discount + "',`amount`= '" + amount + "' WHERE `Coach_id`=" + Coach_id + " AND `bookingDate`='" + booking_date + "' AND `bookingCourse`='" + course + "'";
            var sel_qry = "SELECT s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, c.firstName coachfirstname, c.lastName as CoachLastname FROM `booking_dbs` b INNER JOIN users s on b.user_id = s.id INNER JOIN users c on b.Coach_ID = c.id where b.booking_Id =" + booking_id + ""
        }

        await db_library
            .execute(update_qry).then(async (value) => {
                if (value.affectedRows > 0) {
                    await db_library.execute(sel_qry).then(async (val) => {
                        
                        if (val.length > 0) {
                            for (var i = 0; i < val.length; i++) {
                                //console.log('test',val[i].booking_id)
                                if (status != 'C' && status != 'S') {

                                    var mailTemplate = await mail_template.getMailTemplate(appConfig.MailTemplate.BookingSuccess);
                                    const mailOption = require('../../_mailer/mailOptions');
                                    let _mailOption = new mailOption();
                                    _mailOption.to = val[i].UserEmail;
                                    _mailOption.subject = lang.booking_approved;
                                    _mailOption.html = mailTemplate[0].template.replace('{{username}}', val[i].UserFirstname + " " + val[i].UserLastname).replace('{{bookingid}}', val[i].booking_id).replace('{{amount}}', amount);
                                    var _mailer = require('../../_mailer/mailer');
                                    _mailer.sendMail(_mailOption);
                                    _output.data = {};
                                    _output.isSuccess = true;
                                    _output.message = "Status Update Successfull";
                                } else if (status == 'S') {
                                    var query = "INSERT INTO `balance`(`User_Id`, `Coach_Id`, `Course`, `BalanceAmt`) VALUES ("+user_Id+","+Coach_id+",'"+course+"',"+amount+")";
                                    await db_library.execute(query).then(async (update) => {
                                        if (update.affectedRows > 0) {
                                            var mailTemplate = await mail_template.getMailTemplate(appConfig.MailTemplate.Reschedule);
                                            const mailOption = require('../../_mailer/mailOptions');
                                            let _mailOption = new mailOption();
                                            _mailOption.to = val[i].UserEmail;
                                            _mailOption.subject = lang.booking_reshedule
                                            _mailOption.html = mailTemplate[0].template.replace('{{username}}', val[i].UserFirstname + " " + val[i].UserLastname).replace('{{course}}', course).replace('{{book_date}}', booking_date).replace('{{coach}}', val[i].coachfirstname + " " + val[i].CoachLastname);
                                            var _mailer = require('../../_mailer/mailer');
                                            _mailer.sendMail(_mailOption);
                                            _output.data = {};
                                            _output.isSuccess = true;
                                            _output.message = "Status Update Successfull";
                                        }
                                    }).catch((err) => {
                                        _output.data = {};
                                        _output.isSuccess = false;
                                        _output.message = "Reschedule Booking Failed"
                                    })
                                }
                                else {
                                    var mailTemplate = await mail_template.getMailTemplate(appConfig.MailTemplate.BookingCancel);
                                    const mailOption = require('../../_mailer/mailOptions');
                                    let _mailOption = new mailOption();
                                    _mailOption.to = val[i].UserEmail;
                                    _mailOption.subject = lang.booking_cancelled
                                    _mailOption.html = mailTemplate[0].template.replace('{{username}}', val[i].UserFirstname + " " + val[i].UserLastname).replace('{{course}}', course).replace('{{book_date}}', booking_date).replace('{{coach}}', val[i].coachfirstname + " " + val[i].CoachLastname);
                                    var _mailer = require('../../_mailer/mailer');
                                    _mailer.sendMail(_mailOption);
                                    _output.data = {};
                                    _output.isSuccess = true;
                                    _output.message = "Status Update Successfull";
                                }
                            }

                        }
                    }).catch((err) => {
                        _output.data = {};
                        _output.isSuccess = false;
                        _output.message = "Mail Not Sent"
                    })
                }
            }).catch((err) => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Status Update Failed"
            })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Status Update Failed";
    }

    res.send(_output);
}

exports.getTime_slot = async function (req, res, next) {
    const Coach_ID = req.query.Coach_ID;
    const Start_Date = req.query.Start_Date;
    const Course = req.query.Course;
    if (Coach_ID != "" && Start_Date != "" && Course != "") {

        var _output = new output();
        var query = "call getdaybyavaiablity('" + Start_Date + "','" + Course + "'," + Coach_ID + ")";
        await db_library
            .execute(query).then((value) => {
                if (value.length > 0) {
                    var result = value;
                    var obj = {
                        availabilty: result[0]
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Time Slot Get Successfull";
                } else {
                    var obj = {
                        availabilty: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = " No Time Slot Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Time Slot Get Failed";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Time Slot Get Failed";
    }
    res.send(_output);
}


exports.setpayment = async function (req, res, next) {
    var _output = new output();
    const status = req.body.status;
    const booking_id = req.body.booking_id;
    const amount = req.body.amount;

    if (status != "" && booking_id != "") {

        var update_qry = "call proc_set_booking_status(" + booking_id + "," + amount + ",'" + status + "')"

        await db_library
            .execute(update_qry).then(async (value) => {
                if (value.affectedRows > 0) {
                    await db_library.execute("SELECT u.*, b.* FROM `users` u INNER JOIN `booking_dbs` b on u.id = b.user_Id where b.`booking_id`=" + booking_id + "").then(async (val) => {
                        if (val.length > 0) {
                            var mailTemplate = await mail_template.getMailTemplate(appConfig.MailTemplate.PaymentSuccess);
                            const mailOption = require('../../_mailer/mailOptions');
                            let _mailOption = new mailOption();
                            _mailOption.to = val[0].email;
                            _mailOption.subject = lang.payment_successful;
                            _mailOption.html = mailTemplate[0].template.replace('{{username}}', val[0].firstName + " " + val[0].lastName).replace('{{course}}', val[0].bookingCourse);
                            var _mailer = require('../../_mailer/mailer');
                            _mailer.sendMail(_mailOption);
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = lang.payment_successful;
                        }
                    }).catch((err) => {
                        _output.data = {};
                        _output.isSuccess = false;
                        _output.message = "Payment Failed"
                    })
                }
            }).catch((err) => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Payment Update Failed"
            })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Payment Update Failed";
    }
    res.send(_output);
}

exports.getDemandAvailability = async function (req, res, next) {
    var _output = new output();
    const idss = req.query.Coach_ID;
    const slot = req.query.slot;
    const date = req.query.date;

    if (idss != "" && slot != "" && date != "") {
        // call GetDayByAvaiablityForDemand('" + Start_Date + "','" + Course + "'," + Coach_ID + ")
        var query = "select s.* from booking_dbs bk inner join users s on bk.user_Id = s.id" +
            " where bk.bookingDate = '" + date + "' and bk.BookingTime = '" + slot + "' and bk.Coach_ID = '" + idss + "' and bk.bookingCourse = 'CoursCollectifOndemand'"

        await db_library.execute(query).then(async (value) => {
            if (value.length > 0) {
                var obj = {
                    availabilty: value
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "CourseCollectiveDemand Slot Get successfully";
            } else {
                var obj = {
                    availabilty: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "No records Found";
            }
        }).catch((err) => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "CourseCollectiveDemand Slot get Failed";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "CourseCollectiveDemand Slot get Failed";
    }
    res.send(_output);
}

exports.getslotAvailability = async function (req, res, next) {
    var _output = new output();
    const cochid = req.query.Coach_ID;
    const slot = req.query.slot;
    const people = req.query.people;

    if (cochid != "" && slot != "" && people != "") {
        await db_library
            .execute("select * from booking_dbs bd inner join bookingcourse_slot bs on BookedId = booking_Id inner join users us on bd.user_Id = us.id where Coach_ID =" + cochid + " and Slot = '" + slot + "' and NoofPeople = " + people + "").then(async (value) => {
                if (value.length > 0) {
                    var result = value;
                    var obj = {
                        availabilty: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "CourseCollectiveDemand Slot availabilty successfully";
                } else {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "No records Found";
                }
            }).catch((err) => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "CourseCollectiveDemand Slot availabilty get Failed";
            })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "CourseCollectiveDemand Slot availabilty get Failed";
    }
    res.send(_output);
}

exports.setClubavailability = async function (req, res, next) {
    var _output = new output();

    const {
        Coach_id,
        Mon_mor,
        Mon_af,
        Mon_eve,
        Tue_mor,
        Tue_af,
        Tue_eve,
        Wed_mor,
        Wed_af,
        Wed_eve,
        Thu_mor,
        Thu_af,
        Thu_eve,
        Fri_mor,
        Fri_af,
        Fri_eve,
        Sat_mor,
        Sat_af,
        Sat_eve,
        Sun_mor,
        Sun_af,
        Sun_eve,
        year,
        Week_Number,
        Course,
        Coach_Flag
    } = req.body;

    if (Coach_id != "" && Mon_mor != "" && Mon_af != "" && Mon_eve != "" && Tue_mor != "" && Tue_af != "" && Tue_eve != "" && Wed_mor != "" &&
        Wed_af != "" && Wed_eve != "" && Thu_mor != "" && Thu_af != "" && Thu_eve != "" && Fri_mor != "" && Fri_af != "" && Fri_eve != "" &&
        Sat_mor != "" && Sat_af != "" && Sat_eve != "" && Sun_mor != "" && Sun_af != "" && Sun_eve != "" && Week_Number != "" &&
        Course != "" && Coach_Flag != "" && year != "") {

        var yr = year.split(' ');
        var end = new Date(yr[2], 5, 01);
        var date = new Date(end);
        date.setDate(date.getDate());
        date.setMonth(date.getMonth() + 1);
        date.setFullYear(date.getFullYear() - 1);
        var start = date;



        var query = "INSERT INTO `availability_dbs` (`Coach_Id`, `Course`, `Mon_mor`, `Mon_af`, `Mon_eve`, `Tue_mor`, `Tue_af`," +
            " `Tue_eve`, `Wed_mor`, `Wed_af`, `Wed_eve`, `Thu_mor`, `Thu_af`, `Thu_eve`, `Fri_mor`, `Fri_af`, `Fri_eve`, " +
            "`Sat_mor`, `Sat_af`, `Sat_eve`, `Sun_mor`, `Sun_af`, `Sun_eve`, `Week_Number`, `Start_Date`, `End_Date`, `Coach_Flag`," +
            " `createdAt`, `updatedAt`) VALUES ('" + Coach_id + "','" + Course + "', '" + Mon_mor + "', '" + Mon_af + "', '" + Mon_eve + "', '" + Tue_mor + "', '" + Tue_af + "'," +
            " '" + Tue_eve + "', '" + Wed_mor + "', '" + Wed_af + "', '" + Wed_eve + "', '" + Thu_mor + "', '" + Thu_af + "', '" + Thu_eve + "', '" + Fri_mor + "', " +
            "'" + Fri_af + "', '" + Fri_eve + "', '" + Sat_mor + "', '" + Sat_af + "', '" + Sat_eve + "', '" + Sun_mor + "', '" + Sun_af + "', '" + Sun_eve + "', '" + Week_Number + "'," +
            " '" + formatDate(start) + "', '" + formatDate(end) + "', '" + Coach_Flag + "', NOW(), NOW());"

        var upt_query = "UPDATE `availability_dbs` SET `Course` = '" + Course + "', `Mon_mor`='" + Mon_mor + "', `Mon_af`='" + Mon_af + "', `Mon_eve`='" + Mon_eve + "', `Tue_mor`= '" + Tue_mor + "', `Tue_af`='" + Tue_af + "'," +
            " `Tue_eve`= '" + Tue_eve + "', `Wed_mor` = '" + Wed_mor + "', `Wed_af`='" + Wed_af + "', `Wed_eve`='" + Wed_eve + "', `Thu_mor`='" + Thu_mor + "', `Thu_af`='" + Thu_af + "', `Thu_eve`='" + Thu_eve + "', `Fri_mor`='" + Fri_mor + "', `Fri_af` = '" + Fri_af + "', `Fri_eve` ='" + Fri_eve + "'," +
            "`Sat_mor`='" + Sat_mor + "', `Sat_af`='" + Sat_af + "', `Sat_eve`='" + Sat_eve + "', `Sun_mor`='" + Sun_mor + "', `Sun_af`='" + Sun_af + "', `Sun_eve`='" + Sun_eve + "', `Week_Number`='" + Week_Number + "', `Coach_Flag`='" + Coach_Flag + "'," +
            " `createdAt`=NOW(), `updatedAt`=NOW() WHERE Coach_Id=" + Coach_id + " and course = '" + Course + "' and Start_Date = '" + formatDate(start) + "'";

        await db_library
            .execute("SELECT * FROM `availability_dbs` WHERE Coach_Id=" + Coach_id + " and course = '" + Course + "' and Start_Date = '" + formatDate(start) + "'").then(async (value) => {
                var result = value;
                if (result.length > 0) {
                    await db_library.execute(upt_query).then(async (val) => {
                        var res = val;
                        _output.data = {};
                        _output.isSuccess = true;
                        _output.message = "Disponibilité mise à jour avec succès";
                    }).catch((err) => {
                        _output.data = {};
                        _output.isSuccess = false;
                        _output.message = "La mise à jour de disponibilité a échoué";
                    })
                } else {
                    await db_library.execute(query).then(async (val) => {
                        var res = val;
                        _output.data = {};
                        _output.isSuccess = true;
                        _output.message = "Disponibilité insérée avec succès";
                    }).catch((err) => {
                        _output.data = {};
                        _output.isSuccess = false;
                        _output.message = "Disponibilité insérée a échoué";
                    })
                }
            }).catch(err => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Erreur dans la mise à jour de disponibilité";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Erreur dans la mise à jour de disponibilité";
    }
    res.send(_output);
}

exports.getClubTime_slot = async function (req, res, next) {
    const Coach_ID = req.query.Coach_ID;
    const Start_Date = req.query.Start_Date;
    const Course = req.query.Course;

    if (Coach_ID != "" && Start_Date != "" && Course != "") {
        var _output = new output();
        var query = "call GetDayByAvaiablityForClub('" + Start_Date + "','" + Course + "'," + Coach_ID + ")";

        await db_library
            .execute(query).then((value) => {
                if (value.length > 0) {
                    var result = value;
                    var obj = {
                        availabilty: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Time Slot Get Successfull";
                } else {
                    var obj = {
                        availabilty: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = " No Time Slot Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Time Slot Get Failed";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Time Slot Get Failed";
    }
    res.send(_output);
}

exports.insertAvailability = async function (req, res, next) {
    var _output = new output();
    const {
        availability
    } = req.body;
    //console.log('availability ----', req.body);
    if (availability.length > 0) {

        var start = new Date(availability[0].Start_Date);
        var end = new Date(availability[0].End_Date);
        var date = new Date(availability[0].Start_Date);
        start.setDate(start.getDate())
        end.setDate(end.getDate());
        var query = "SELECT COUNT(1) as count FROM `avaiablity` where `Date` BETWEEN '" + formatDate(start) + "' and '" + formatDate(end) + "' and `CourseId`is NOT null and `CoachId`=" + availability[0].Coach_Id + "";
        await db_library.execute(query).then(async (data) => {
            if (data[0].count == 0) {
                /**
                 * Getting number of days between start and end date
                 */
                var dateDifference = moment.duration(moment(end).diff(start)).asDays() + 1;
                /**
                 * Saving data for each date from start to end
                 */
                for (let i = 0; i < dateDifference; i++) {

                    for (var j = 0; j <= 6; j++) {
                        /**
                         * Finding days of the week in number for the current date
                         */
                        var daysInNumber = moment(date).day() - 1;
                        daysInNumber = daysInNumber == -1 ? 6 : daysInNumber

                        if ((parseInt(daysInNumber) == parseInt(j))) {

                            const {
                                h8,
                                h9,
                                h10,
                                h11,
                                h12,
                                h13,
                                h14,
                                h15,
                                h16,
                                h17,
                                h18,
                                h19,
                                h20,
                                h21,
                                Coach_Id,

                            } = availability[j];


                            var query = "call ins_upd_avaiablity('" + h8 + "','" + h9 + "','" + h10 + "','" + h11 + "','" + h12 + "','" + h13 + "','" + h14 + "','" + h15 + "','" + h16 + "'," +
                                "'" + h17 + "','" + h18 + "','" + h19 + "','" + h20 + "','" + h21 + "','" + Coach_Id + "','" + moment(date, "DD-MM-YYYY").format("YYYY-MM-DD") + "','" + formatDate(start) + "','" + formatDate(end) + "')"

                            await db_library.execute(query).then(async (data) => {
                                _output.data = {};
                                _output.isSuccess = true;
                                _output.message = lang.insert_coach;
                            }).catch((err) => {
                                _output.data = err;
                                _output.isSuccess = false;
                                _output.message = "Coach Availability insertion failed";
                            });
                            break;

                        }


                    }
                    /**
                     * Getting next date for saving
                     */
                    date = moment(date).add(1, 'days');
                }
            }
            else {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Slot Currently no available";
            }
        })

    } else {
        _output.data = {};
        _output.isSuccess = false;
        _output.message = "Data Missing";
    }
    res.send(_output);
}

exports.getDemandPrice = async function (req, res, next) {
    var _output = new output();
    const CoachId = req.query.CoachId;
    const TotalPeople = req.query.TotalPeople;
    const P_Date = req.query.P_Date;

    if (CoachId != "" && TotalPeople != "" && P_Date != "") {
        // call GetDayByAvaiablityForDemand('" + Start_Date + "','" + Course + "'," + Coach_ID + ")
        var query = "call get_demand_course_price(" + CoachId + "," + TotalPeople + ",'" + P_Date + "')"

        await db_library.execute(query).then(async (value) => {
            if (value.length > 0) {
                var obj = {
                    price: value
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "CourseCollectiveDemand Price Get successfully";
            } else {
                var obj = {
                    availabilty: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "No records Found";
            }
        }).catch((err) => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "CourseCollectiveDemand Price get Failed";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "CourseCollectiveDemand Price get Failed";
    }
    res.send(_output);
}
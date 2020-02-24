const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
//const bcrypt = require("bcrypt");
const mail_template = require("../../MailTemplate/mailTemplate");
const appConfig = require("../../../../config/appConfig");
const moment = require('moment');
const lang = require("../../../lang/language").franchContent;
//const base64 = require("base-64");
const calculateLocationRadius = require('../../_helpers/calculateRadiusDistance');

async function setStatusBookingSlotDbs(booking_id, status) {
    try {
        const Query = "UPDATE `booking_slot_dbs` SET `status`= '" + status + "' WHERE `booking_Id`= '" + booking_id + "'";
        return await db_library.execute(Query).then(async data => {
            return data;
        });
    } catch (error) {
        return error;
    }
}

async function setStatusAvaiablity(arrayData) {
    try {
        const { coach_id, user_id, status, booking_date, booking_course, booking_time } = arrayData;
        const Query = "UPDATE `avaiablity` SET `Status`= '" + status + "' WHERE `CoachId`= '" + coach_id + "' AND `UserId`= '" + user_id + "' AND `Date`= '" + formatDate(booking_date) + "' AND `CourseId`= '" + booking_course + "' AND `Hour`= '" + booking_time + "'";
        return await db_library.execute(Query).then(async data => {
            return data;
        });
    } catch (error) {
        return error;
    }
}

async function getStatusBookingSlotData(id) {
    try {
        const Query = "SELECT * FROM `booking_slot_dbs` WHERE `booking_Id`= '" + id + "'";
        return await db_library.execute(Query).then(async data => {
            return data;
        });
    } catch (error) {
        return error;
    }
}

async function getRemainingTen(coach_id, user_id, booking_course) {
    try {
        const arrData = []
        const query = "SELECT * FROM `booking_dbs` WHERE `Coach_ID` = '" + coach_id + "' AND `user_Id` = '" + user_id + "' AND `bookingCourse` = '" + booking_course + "' AND `remaingSlotStatus` = 'Yes'";
        return await db_library.execute(query).then(async data => {
            for (let i = 0; i < data.length; i++) {
                const bookingSlotData = await getStatusBookingSlotData(data[i].booking_Id)
                const obj = {
                    booking_id: data[i].booking_Id,
                    coach_id: parseInt(data[i].Coach_ID),
                    user_id: parseInt(data[i].user_Id),
                    amount: data[i].amount,
                    booking_course: data[i].bookingCourse,
                    remaingSlot: data[i].remaingSlot,
                    remaingSlotStatus: data[i].remaingSlotStatus,
                    slot: bookingSlotData
                }
                arrData.push(obj)
            }
            return arrData;
        });
    } catch (error) {
        return error;
    }
}

exports.get_remaining_slot = async function (req, res, next) {
    const coach_id = req.params.coach_id;
    const user_id = req.params.user_id;
    const booking_course = req.params.booking_course;
    var _output = new output();
    const data = await getRemainingTen(coach_id, user_id, booking_course);
    if (data.length > 0) {     
        _output.data = data;
        _output.isSuccess = true;
        _output.message = "Get remaining data successful";
    } else {
        _output.data = data;
        _output.isSuccess = true;
        _output.message = " No Found";
    }
    res.send(_output);
}

async function check_avail_ten_is_or_not(id, date) {
    try {
        const Query = "SELECT count(id) AS total FROM `avaiablity` WHERE `CoachId`= '" + id + "' AND `Status`= 'Y' AND `Date` >= '" + date + "'";
        return await db_library.execute(Query).then(async data => {
            return data;
        });
    } catch (error) {
        return error;
    }
}

exports.get_avail_ten_is_or_not = async function (req, res, next) {
    const coach_id = req.params.coach_id;
    const date = req.params.date;
    var _output = new output();
    const data = await check_avail_ten_is_or_not(coach_id, date);
    if (data[0].total >= 10) {
        _output.data = { "ten": true };
        _output.isSuccess = true;
        _output.message = "Get remaining data successful";
    } else {
        _output.data = {"ten" : false};
        _output.isSuccess = true;
        _output.message = " No Found";
    }
    res.send(_output);
}

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
                _output.message = "L'entraîneur réussit";
            } else {
                var obj = {
                    coach_list: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Aucun entraîneur trouvé";
            }

        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "L'entraîneur a échoué";
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
                _output.message = "Aucune date de disponibilité de coach trouvée";
            }

        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Date de disponibilité de l'entraîneur";
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
                _output.message = "L'entraîneur réussit";
            } else {
                var obj = {
                    coach_list: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Aucun entraîneur trouvé";
            }

        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "L'entraîneur a échoué";
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

// exports.searchByCoach = async function (req, res, next) {
//     //console.log("coach.js > searchbycoach > ", req.query)
//     const ville = req.query.ville;
//     const date = req.query.date;
//     const rayon = req.query.rayon;
//     const course = req.query.course;
//     var _output = new output();

//     // if (ville != "" && date != "" && rayon != "" && course != "") {
//     //var query = "call filtercoach('" + ville + "','" + date + "','" + rayon + "','" + course + "')";
//     //console.log(query);
//     // var query = "SELECT * FROM users s inner join coaches_dbs c on c.Coach_Email = s.email INNER join cities ct on ct.id = s.cityId where c.Coach_Rayon = " + rayon + " AND ct.Nom_commune like '%" + ville + "%'";

//     var where = "";
//     if (ville !== "") {
//         const postalCode = ville.trim();
//         where += " AND u.postalCode = '" + postalCode + "'";
//     }
//     if (course !== "") {
//         const courses = course.trim();
//         where += " AND c.Coach_Services LIKE '%" + courses + "%'";
//     }
//     //console.log(date)
//     if (date != "" && date != 'null') {
//         //const date = date.trim();
//         where += " AND a.Date = '" + date + "' GROUP BY a.Date"
//     }
    
//     var query =
//       "SELECT DISTINCT c.Coach_Fname, c.Coach_ID, c.InstagramURL, c.TwitterURL,c.FacebookURL, c.Coach_Phone, c.Coach_Lname, c.Coach_Email, c.Coach_Price, c.Coach_PriceX10, c.Coach_Description, c.Coach_Services, u.Id FROM coaches_dbs c inner join users u on c.Coach_Email = u.email left join avaiablity a on u.id = a.CoachId WHERE u.roleId = 2 AND u.isActive = 1" +
//       where;

//     //console.log(query);
//     await db_library
//       .execute(query)
//       .then(value => {
//         //console.log(value)
//         if (value.length > 0) {
//           var result = value;
//           for (var i = 0; i < value.length; i++) {
//             result[i].Coach_Services = value[i].Coach_Services.split(",");

//             // var encoded = value[i].Coach_Image.replace(/^data:image\/\w+;base64,/, "");
//             // if (encoded != "") {
//             //   var bytes = base64.decode(encoded);
//             //   result[i].Coach_Image = utf8.decode(bytes);
//             // } else {
//             //   result[i].Coach_Image = "";
//             // }

//             //console.log(text);
//           }
//           var res = {
//             coach_list: result
//           };
//           //console.log(res)
//           _output.data = res;
//           _output.isSuccess = true;
//           _output.message = "Coach Get Successfull";
//         } else {
//           var obj = {
//             coach_list: []
//           };
//           _output.data = obj;
//           _output.isSuccess = true;
//           _output.message = " No Coach Found";
//         }
//       })
//       .catch(err => {
//         _output.data = err.message;
//         _output.isSuccess = false;
//         _output.message = "Coach Get Failed";
//       });
//     // } else {
//     //     _output.data = "Required Field are missing";
//     //     _output.isSuccess = false;
//     //     _output.message = "Coach Get Failed";
//     // }
//     res.send(_output);
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




    //SDKAT - START
    var where = "";
    var query = "";
    // if (course !== "") {
    //     const courses = course.trim();
    //     where += " AND c.Coach_Services LIKE '%" + courses + "%'";
    // }
    // if (date != "" && date != 'null') {
    //     //const date = date.trim();
    //     where += " AND a.Date = '" + date + "' GROUP BY a.Date"
    // }

    // Checking for the Rayon is Empty
    if (rayon == "0") {
        if (ville !== "") {
            const postalCode = ville.trim();
            where += " AND u.postalCode = '" + postalCode + "'";
        }
        if (course !== "") {
            const courses = course.trim();
            where += " AND c.Coach_Services LIKE '%" + courses + "%'";
        }
        if (date != "" && date != 'null') {
            //const date = date.trim();
            where += " AND a.Date = '" + date + "' GROUP BY a.Date"
        }

        var query = "SELECT DISTINCT (c.Coach_ID), c.Coach_Fname, c.InstagramURL, c.TwitterURL,c.FacebookURL, c.Coach_Phone, c.Coach_Lname, c.Coach_Email, c.Coach_Price, c.Coach_PriceX10, c.Coach_Description, c.Coach_Services, u.Id FROM coaches_dbs c inner join users u on c.Coach_Email = u.email left join avaiablity a on u.id = a.CoachId WHERE u.roleId = 2 AND u.isActive = 1" + where;
        console.log('Either Rayon or Ville is Empty');
    }// End of rayon=='null' || rayon=='0'
    else {
        if (course !== "") {
            //const courses = course.trim();
            where += " AND coaches_dbs.Coach_Services LIKE '%" + course + "%'";
        }
        if (date != "" && date != 'null') {
            //const date = date.trim();
            where += " AND avaiablity.Date = '" + date + "' GROUP BY avaiablity.Date"
        }
        var query_internal = "SELECT Code_postal,coordonnees_gps FROM cities WHERE `Code_postal`=" + ville;
        await db_library
            .execute(query_internal)
            .then(async results => {
                if (results.length > 0) {
                    // If Results Greater than 0 Process the Code postal along with latitude and Longitude
                    let Code_postal = results[0].Code_postal;
                    let coordonnees_gps = results[0].coordonnees_gps;
                    let lat_long = coordonnees_gps.split(',');
                    let longitude = lat_long[0];
                    let latitude = lat_long[1];
                    const postal_codes_list = await calculateLocationRadius(longitude, latitude, Code_postal, rayon);
                    console.log(postal_codes_list);
                    if (postal_codes_list.length > 0) {
                        query = "SELECT DISTINCT(coaches_dbs.Coach_ID),coaches_dbs.Coach_Fname,coaches_dbs.Coach_Lname,coaches_dbs.InstagramURL,coaches_dbs.TwitterURL,coaches_dbs.FacebookURL,coaches_dbs.Coach_Phone, coaches_dbs.Coach_Email,coaches_dbs.Coach_Price, coaches_dbs.Coach_PriceX10, coaches_dbs.Coach_Description,coaches_dbs.Coach_Services,users.id FROM users JOIN coaches_dbs ON users.email = coaches_dbs.Coach_Email LEFT JOIN avaiablity ON users.id=avaiablity.CoachId WHERE users.postalCode IN (" + postal_codes_list + ") AND users.roleId='2' AND users.isActive='1'" + where;
                    }
                    else {
                        console.log("If the Post Codes Are Not Found for the Rayon");
                        query = "SELECT DISTINCT(coaches_dbs.Coach_ID),coaches_dbs.Coach_Fname,coaches_dbs.Coach_Lname,coaches_dbs.InstagramURL,coaches_dbs.TwitterURL,coaches_dbs.FacebookURL,coaches_dbs.Coach_Phone, coaches_dbs.Coach_Email,coaches_dbs.Coach_Price, coaches_dbs.Coach_PriceX10, coaches_dbs.Coach_Description,coaches_dbs.Coach_Services,users.id FROM users JOIN coaches_dbs ON users.email = coaches_dbs.Coach_Email LEFT JOIN avaiablity ON users.id=avaiablity.CoachId WHERE users.postalCode IN ('') AND users.roleId='2' AND users.isActive='1'" + where;
                    }// End of Postal_codes.length <0
                    //return;
                }// End of results.length > 0
                else {
                    console.log("If the Post Codes Are Not Found for the Given Postal Code");
                    query = "SELECT Code_postal,coordonnees_gps FROM cities WHERE `Code_postal`=" + ville;
                }// End of results.length < 0
            });// End of async results
    }// End of rayon!='null' || rayon!='0'




    //return;
    // if (ville !== "") {
    //     const postalCode = ville.trim();
    //     where += " AND u.postalCode = '" + postalCode + "'";
    // }
    // if (course !== "") {
    //     const courses = course.trim();
    //     where += " AND c.Coach_Services LIKE '%" + courses + "%'";
    // }
    // //console.log(date)
    // if (date != "" && date != 'null') {
    //     //const date = date.trim();
    //     where += " AND a.Date = '" + date + "' GROUP BY a.Date"
    // }

    // var query =
    //   "SELECT DISTINCT c.Coach_Fname, c.Coach_ID, c.InstagramURL, c.TwitterURL,c.FacebookURL, c.Coach_Phone, c.Coach_Lname, c.Coach_Email, c.Coach_Price, c.Coach_PriceX10, c.Coach_Description, c.Coach_Services, u.Id FROM coaches_dbs c inner join users u on c.Coach_Email = u.email left join avaiablity a on u.id = a.CoachId WHERE u.roleId = 2 AND u.isActive = 1" +
    //   where;
    console.log("Query O/P : " + query);
    //return
    await db_library
        .execute(query)
        .then(value => {
            console.log("Query Executed");
            console.log(query);
            console.log("Output Length");
            console.log(value.length);
            if (value.length > 0) {
                var result = value;
                //console.log(result);
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
                //console.log(res);
                //return
                _output.data = res;
                _output.isSuccess = true;
                _output.message = "L'entraîneur réussit";
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
    // } else {
    //     _output.data = "Required Field are missing";
    //     _output.isSuccess = false;
    //     _output.message = "Coach Get Failed";
    // }
    res.send(_output);
}


// New get coach list by postal code - mobile 

exports.getCoachByPostalcode = async function (req, res, next) {
    var _output = new output();
    const code = req.params.code;

    async function checkCourseIndividual(id) {
        try {
            const Query = "SELECT 1 FROM `individualcourses` WHERE `Coach_Id`= '" + id + "'";
        return await db_library.execute(Query).then(async data => {
            return data.length > 0 ? true : false;
        });
        } catch (error) {
        return error;
        }
    }

    async function checkOndemand(id) {
        try {
            const Query = "SELECT 1 FROM `course_collective_if_demand` WHERE `Coach_Id`= '" + id + "'";
        return await db_library.execute(Query).then(async data => {
            return data.length > 0 ? true : false;
        });
        } catch (error) {
        return error;
        }
    }
    async function checkClub(id) {
        try {
            const Query = "SELECT 1 FROM `couse_collective_if_club` WHERE `Coach_Id`= '" + id + "'";
        return await db_library.execute(Query).then(async data => {
            return data.length > 0 ? true : false;
        });
        } catch (error) {
        return error;
        }
    }
    async function checkStage(id) {
        try {
            const Query = "SELECT 1 FROM `course_stage` WHERE `Coach_Id`= '" + id + "'";
        return await db_library.execute(Query).then(async data => {
            return data.length > 0 ? true : false;
        });
        } catch (error) {
        return error;
        }
    }
    async function checkAnimation(id) {
        try {
            const Query = "SELECT 1 FROM `animations` WHERE `Coach_Id`= '" + id + "'";
        return await db_library.execute(Query).then(async data => {
            return data.length > 0 ? true : false;
        });
        } catch (error) {
        return error;
        }
    }
    async function checkTeamBuilding(id) {
        try {
            const Query = "SELECT 1 FROM `team_building` WHERE `Coach_Id`= '" + id + "'";
        return await db_library.execute(Query).then(async data => {
            return data.length > 0 ? true : false;
        });
        } catch (error) {
        return error;
        }
    }
    async function checkTournament(id) {
        try {
            const Query = "SELECT 1 FROM `tournament` WHERE `Coach_Id`= '" + id + "'";
            return await db_library.execute(Query).then(async data => {
                return data.length > 0 ? true : false;
            });
        } catch (error) {
            return error;
        }
    }
    var query =
        "SELECT DISTINCT c.Coach_Fname, c.Coach_ID, c.InstagramURL, c.Coach_Image, c.TwitterURL,c.FacebookURL, c.Coach_Phone, c.Coach_Lname, c.Coach_Email, c.Coach_Price, c.Coach_PriceX10, c.Coach_Description, c.Coach_Services, u.Id FROM coaches_dbs c inner join users u on c.Coach_Email = u.email left join avaiablity a on u.id = a.CoachId WHERE u.roleId = 2 AND u.isActive = 1 AND u.postalCode = '" + code + "'";
    await db_library
        .execute(query)
        .then(async value => {
            if (value.length > 0) {
                var result = [];
                var indiv = false;
                var ondemand = false;
                var club = false;
                var stage = false;
                var animation = false;
                var teambuilding = false;
                var tournament = false;
                for (var i = 0; i < value.length; i++) {
                    value[i].Coach_Services = value[i].Coach_Services.split(",");
                    if (value[i].Coach_Services[0].length > 0) {
                        if (value[i].Coach_Services.includes('CoursIndividuel')) {  
                            indiv = true;
                        } else if (value[i].Coach_Services.includes('CoursCollectifOndemand')) {
                            ondemand = true;
                        } else if (value[i].Coach_Services.includes('CoursCollectifClub')) {
                            club = true;
                        } else if (value[i].Coach_Services.includes('Stage')) {
                            stage = true;
                        } else if (value[i].Coach_Services.includes('Animation')) {
                            animation = true;
                        } else if (value[i].Coach_Services.includes('TeamBuilding')) {
                            teambuilding = true;
                        } else if (value[i].Coach_Services.includes('Tournament')) {
                            tournament = true;
                        }
                        
                        if (indiv === true || ondemand === true || club === true || stage === true || animation === true || teambuilding === true || tournament === true) {
                            const checkCheckIndividual = await checkCourseIndividual(value[i].Id);
                            const checkCheckOndemand = await checkOndemand(value[i].Id);
                            const checkCheckClub = await checkClub(value[i].Id);
                            const checkCheckStage = await checkStage(value[i].Id);
                            const checkCheckAnimation = await checkAnimation(value[i].Id);
                            const checkCheckTeamBuilding = await checkTeamBuilding(value[i].Id);
                            const checkCheckTournament = await checkTournament(value[i].Id);

                            // if (checkCheckIndividual === true) {
                            //     value[i].Coach_Services.push('CoursIndividuel')
                            // }
                            if (checkCheckIndividual === true || checkCheckOndemand === true || checkCheckClub === true || checkCheckStage === true || checkCheckAnimation === true || checkCheckTeamBuilding === true || checkCheckTournament === true) {
                                result.push(value[i])
                            }
                        }                        
                    }                    
                }
                var res = {
                    coach_list: result
                };
                _output.data = res;
                _output.isSuccess = true;
                _output.message = "L'entraîneur réussit";
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
}

exports.getcoachdetailbyid = async function (req, res, next) {
    const { id } = req.body;
    //console.log(id)
    var _output = new output();

    var query =
        "SELECT DISTINCT c.Coach_Fname, c.Coach_ID, c.InstagramURL, c.Coach_Image, c.TwitterURL,c.FacebookURL, c.Coach_Phone, c.Coach_Lname, c.Coach_Email, c.Coach_Price, c.Coach_PriceX10, c.Coach_Description, c.Coach_Services, u.Id FROM coaches_dbs c inner join users u on c.Coach_Email = u.email left join avaiablity a on u.id = a.CoachId WHERE u.roleId = 2 AND u.isActive = 1 AND c.Coach_ID = '" + id + "'";
    
    if (id != "") {
        await db_library
            .execute(query).then((value) => {
                //console.log(value)
                if (value.length > 0) {
                    var obj = {
                        coach_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "L'entraîneur réussit";
                } else {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "Aucun entraîneur trouvé";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "L'entraîneur a échoué";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "L'entraîneur a échoué";
    }
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
            _output.message = "L'entraîneur réussit";
        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Les entraîneurs ont échoué";
        });
    res.send(_output);
}

exports.getcoachbyid = async function (req, res, next) {
    const coach_email = req.body.Coach_Email;
    //console.log("coach.js-447-", coach_email)
    var _output = new output();

    if (coach_email != "") {
        await db_library
            .execute("SELECT * FROM `coaches_dbs` WHERE Coach_Email='" + coach_email + "'").then((value) => {
                if (value.length > 0) {
                    //console.log("coach.js-454-", value)
                    var obj = {
                        coach_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "L'entraîneur réussit";
                } else {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "Aucun entraîneur trouvé";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Les entraîneurs ont échoué";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "L'entraîneur a échoué";
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
                _output.message = "Soyez réussi";
            } else {
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "Aucun enregistrement trouvé";
            }
        }).catch((err) => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Échec";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec";
    }
    res.send(_output)
}

async function bookedFun(arr, remaingSlotStatus, totalAmt) {
    try {
        console.log("[coach.js - line - 788]", arr);
        const { P_CoachId, P_UserId, P_Date, P_CourseId, P_Hour, P_Remarks } = arr;
        const Query = "Insert into `booking_dbs` (`Coach_ID`,`user_Id`,`payment_Id`,`status`,`bookingDate`,`bookingCourse`,`amount`,`BookingTime`,`Remarks`,`remaingSlotStatus`) values ('" + P_CoachId + "','" + P_UserId + "','0','R','" + P_Date + "','" + P_CourseId + "','" + totalAmt + "','" + P_Hour + "','" + P_Remarks + "','" + remaingSlotStatus + "')";
        
        return await db_library.execute(Query).then(async data => {
            if (data.insertId) {
                return data.insertId;
            }            
        });
    } catch (error) {
        return error;
    }
}

async function bookedSlotFun(bookArray, bookingID) {
    try {
        console.log("[coach.js - line - 805]", bookArray);
        const {
                    P_CoachId,
                    P_CourseId,
                    P_Date,
                    P_Hour,
                    P_UserId,
                    P_Amount,
                    P_Remarks
                } = bookArray
        const Query = "Insert into `booking_slot_dbs` (`coach_id`, `user_id`, `booking_id`, `status`, `booking_date`, `booking_course`, `amount`, `booking_time`, `remarks`) values ('" + P_CoachId + "','" + P_UserId + "','" + bookingID + "','R','" + P_Date + "','" + P_CourseId + "','" + P_Amount + "','" + P_Hour + "','" + P_Remarks + "')";

        return await db_library.execute(Query).then(async data => {            
            return data;
        });
    } catch (error) {
        return error;
    }
}

async function availUpdateFun(bookArray) {
    try {
        const {
            P_CoachId,
            P_CourseId,
            P_Date,
            P_Hour,
            P_UserId,
            P_Amount,
        } = bookArray
        const Query = "UPDATE `avaiablity` SET `Status`= 'R' , `UserId` = '" + P_UserId + "', CourseId = '" + P_CourseId + "', Price = '" + P_Amount + "', TotalSeat = '1' WHERE `CoachId`= '" + P_CoachId + "' AND `Date`= '" + P_Date + "' AND `Hour`= '" + P_Hour + "'";
        
        return await db_library.execute(Query).then(async data => {
            return data;
        });
    } catch (error) {
        return error;
    }
}

exports.coachReservationFun = async function (req, res, next) {
    var _output = new output();

    const {
        bookArray
    } = req.body;
    console.log("[coach.js - line 850]", req.body)
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
        var P_TotalAmt = req.body.totalAmt;
        var P_RemaingTenStatus = req.body.remaingStatus;
        const lastInsertId = await bookedFun(bookArray[0],P_RemaingTenStatus, P_TotalAmt);
        console.log("[coach.js - line - 867]",lastInsertId);
        var dateArr = []
        for (var i = 0; i < bookArray.length; i++) {
            await bookedSlotFun(bookArray[i], lastInsertId);
            if (bookArray[i].P_CourseId === 'CoursIndividuel') {
                await availUpdateFun(bookArray[i]);
            }
            dateArr.push(bookArray[i].P_Date)
        }

        var dateString = dateArr.join();
        console.log("[coach.js - line - 878]", dateArr)
        // if (_output.message == "Booking Successfully Inserted") {
            var mailTemplate = await mail_template.getMailTemplate(appConfig.MailTemplate.CoachAcceoptance);
            const mailOption = require('../../_mailer/mailOptions');
            let _mailOption = new mailOption();
            _mailOption.to = coach_details[0].email;
            _mailOption.subject = lang.booking_request
        _mailOption.html = mailTemplate[0].template.replace('{{username}}', coach_details[0].firstName + " " + coach_details[0].lastName).replace('{{user}}', user_details[0].firstName + " " + user_details[0].lastName).replace('{{date}}', dateString).replace('{{course}}', bookArray[0].P_CourseId);
            var _mailer = require('../../_mailer/mailer');
            _mailer.sendMail(_mailOption);
        // }
        console.log("[coach.js - line - 889]")
        _output.data = {};
        _output.isSuccess = true;
        _output.message = "Réservation réussie";
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "La réservation a échoué";
    }
    res.send(_output);
}

exports.coachReservation = async function (req, res, next) {
    var _output = new output();

    const {
        bookArray        
    } = req.body;
    console.log("[coach.js - line 735]", req.body)
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
        var P_TotalAmt = req.body.totalAmt;
        var P_RemaingTenStatus = req.body.remaingStatus;
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
            var query = "call proc_ins_booking_dbs(" + P_CoachId + ",'" + P_CourseId + "','" + P_Date + "','" + P_Hour + "'," + P_UserId + "," + amt + ",'" + P_Remarks + "','" + P_TotalAmt + "','" + P_RemaingTenStatus + "')";
            await db_library.execute(query).then(async (val) => {
                console.log("[coach.js - line 826]", val)
                if (val) {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "Réservation réussie";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = "La réservation a échoué";
                }
            }).catch((err) => {
                console.log("[coach.js - line 837]", err)
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "La réservation a échoué";
            })
        }
        if (_output.message == "Réservation réussie") {
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
        _output.message = "La réservation a échoué";
    }
    res.send(_output);
}

exports.getReservations = async function (req, res, next) {
    var _output = new output();
    const Coach_id = req.query.Coach_ID;
    async function getBookingSlotTime(id) {
        try {
            const Query = "SELECT * FROM `booking_slot_dbs` WHERE `booking_id`= '" + id + "'";
            return await db_library.execute(Query).then(async data => {
                return data;
            });
        } catch (error) {
            return error;
        }
    }
    if (Coach_id != "") {
        var Qry = `select booking_Id,BookingTime,Coach_ID,amount,bookingCourse, d.CourseName,(select DATE_FORMAT(bookingDate, '%Y-%m-%d')) as bookingDate,discount_club,paymentStatus,payment_Id,status,user_Id, u.firstName, u.lastName,s.Remarks from booking_dbs s
        inner join course_dbs d on s.bookingCourse = d.Course_Shotname
        inner join users u on s.user_Id = u.id where Coach_Id = ` + Coach_id;
        await db_library.execute(Qry).then(async (val) => {            
            var result = val;
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    const slot = await getBookingSlotTime(result[i].booking_Id);
                    result[i].slot = slot;
                }
                var obj = {
                    booking: result
                }                
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Soyez réussi";
            } else {
                var obj = {
                    booking: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Aucun enregistrement trouvé";
            }
        }).catch((err) => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Échec";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec";
    }
    res.send(_output)
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
                _output.message = "Soyez réussi";
            } else {
                var obj = {
                    booking: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Aucun enregistrement trouvé";
            }
        }).catch((err) => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Échec";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec";
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
                _output.message = "Soyez réussi";
            } else {
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "Aucun enregistrement trouvé";
            }
        }).catch((err) => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Échec";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec";
    }
    res.send(_output)
}

async function getSlotDetailsByBookingId(booking_id) {
    try {
        const Query =
            "SELECT * FROM `booking_slot_dbs` where `booking_id` = " + booking_id;
        return await db_library.execute(Query).then(async data => {
            return data;
        });
    } catch (error) {
        return error;
    }
}


async function updateSlotDetailsByBookingId(Coach_id, user_Id, booking_date, course, booking_time) {
    try {
        const Query =
            "UPDATE `avaiablity` SET `Status`= 'Y' WHERE `CoachId`= '" +
            Coach_id +
            "' AND `UserId`= '" +
            user_Id +
            "' AND `Date`= '" +
            booking_date +
            "' AND `Hour`= '" +
            booking_time +
            "' AND `CourseId`= '" +
            course +
            "'";
        return await db_library.execute(Query).then(async data => {
            return data;
        });
    } catch (error) {
        return error;
    }
}

async function setCancelStatusAvaiablity(Coach_id, user_Id, booking_date, course, booking_id) {
    try {
        const getSlotBookingId = await getSlotDetailsByBookingId(booking_id);
        console.log(getSlotBookingId);
        for (let i = 0; i < getSlotBookingId.length; i++) {
            //const element = array[i];
            await updateSlotDetailsByBookingId(Coach_id, user_Id, booking_date, course, getSlotBookingId[i].booking_time);
        }
        return true;
        
    } catch (error) {
        return error;
    }
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

            var sel_qry = "SELECT b.booking_id as booking_id,s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, c.firstName coachfirstname, c.lastName as CoachLastname FROM `booking_dbs` b INNER JOIN users s on b.user_id = s.id INNER JOIN users c on b.Coach_ID = c.id where b.bookingCourse='" + course + "' AND b.bookingDate ='" + booking_date + "' AND b.Coach_ID = " + Coach_id;
            // var sel_qry = "SELECT s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, c.firstName coachfirstname, c.lastName as CoachLastname FROM `booking_dbs` b INNER JOIN users s on b.user_id = s.id INNER JOIN users c on b.Coach_ID = c.id where b.booking_Id =" + booking_id + ""
        } else if (course == 'CoursIndividuel') {
            // var update_qry = "UPDATE `booking_dbs` SET `status`= '" + status + "' ,`discount_club`= '" + discount + "',`amount`= '" + amount + "' WHERE `Coach_id`=" + Coach_id + " AND `booking_id`=" + booking_id + "";
            // var update_qry = "call proc_set_booking_status(" + booking_id + "," + amount + ",'" + status + "')"

            var update_qry = "UPDATE `booking_dbs` SET `status`= '" + status + "' ,`amount`= '" + amount + "' WHERE `booking_Id`= '" + booking_id + "'";
            
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
                                    console.log('coach.js - line 766',discount);
                                    var discountAmount = (discount != "" ? discount : amount);
                                    console.log('coach.js - line 768', discountAmount);
                                    var mailTemplate = await mail_template.getMailTemplate(appConfig.MailTemplate.BookingSuccess);
                                    const mailOption = require('../../_mailer/mailOptions');
                                    let _mailOption = new mailOption();
                                    _mailOption.to = val[i].UserEmail;
                                    _mailOption.subject = lang.booking_approved;
                                    _mailOption.html = mailTemplate[0].template.replace('{{username}}', val[i].UserFirstname + " " + val[i].UserLastname).replace('{{bookingid}}', booking_id).replace('{{amount}}', discountAmount);
                                    var _mailer = require('../../_mailer/mailer');
                                    _mailer.sendMail(_mailOption);
                                    _output.data = {};
                                    _output.isSuccess = true;
                                    _output.message = "Mise à jour du statut réussie";
                                    console.log('[coach.js - line 780]',_output);
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
                                            _output.message = "Mise à jour du statut réussie";
                                        }
                                    }).catch((err) => {
                                        _output.data = {};
                                        _output.isSuccess = false;
                                        _output.message = "Replanifier la réservation a échoué"
                                    })
                                }
                                else {
                                    console.log("[coach.js - line 1086]", Coach_id, user_Id, status, booking_date, course, booking_id)
                                    await setCancelStatusAvaiablity(Coach_id, user_Id, booking_date, course, booking_id);
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
                                    _output.message = "Mise à jour du statut réussie";
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
                _output.message = "Échec de la mise à jour du statut"
            })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec de la mise à jour du statut";
    }

    res.send(_output);
}

exports.getTime_slot = async function (req, res, next) {
    const Coach_ID = req.query.Coach_ID;
    const Start_Date = req.query.Start_Date;
    const Course = req.query.Course;
    if (Coach_ID != "" && Start_Date != "" && Course != "") {
        console.log(req.query)
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
                    _output.message = "Intervalle de temps réussi";
                } else {
                    var obj = {
                        availabilty: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Aucun créneau horaire trouvé";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Échec de la plage horaire";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec de la plage horaire";
    }
    res.send(_output);
}


exports.setpayment = async function (req, res, next) {
    var _output = new output();
    console.log(req.body)
    const status = req.body.status;
    const booking_id = req.body.booking_id;
    const amount = req.body.amount;

    if (status != "" && booking_id != "") {

        //var update_qry = "call proc_set_booking_status(" + booking_id + "," + amount + ",'" + status + "')"
        var update_qry = "UPDATE `booking_dbs` SET `status`= '" + status + "' ,`amount`= '" + amount + "' WHERE `booking_Id`= '" + booking_id + "'";
        //var update_qry = 
        await db_library
            .execute(update_qry).then(async (value) => {
                //console.log("line - 886", value)
                if (value.affectedRows > 0) {
                    const setStatusBookingSlotData = await setStatusBookingSlotDbs(booking_id, status);

                    const getBookingSlotData = await getStatusBookingSlotData(booking_id);
                    console.log("[coach.js - line 1064", getBookingSlotData)
                    if (getBookingSlotData.length > 0) {
                        for (let i = 0; i < getBookingSlotData.length; i++) {
                            await setStatusAvaiablity(getBookingSlotData[i]);                            
                        }
                    }

                    console.log("[coach.js - line 1064", setStatusBookingSlotData)
                    await db_library.execute("SELECT u.*, b.* FROM `users` u INNER JOIN `booking_dbs` b on u.id = b.user_Id where b.`booking_id`=" + booking_id + "").then(async (val) => {
                        if (val.length > 0) {
                            //console.log("line - 890", val)
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
                        _output.message = "Paiement échoué"
                    })
                }
            }).catch((err) => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Paiement échoué"
            })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Paiement échoué";
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
                _output.message = "CourseCollectiveDemand Slot Obtenez avec succès";
            } else {
                var obj = {
                    availabilty: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Aucun enregistrement trouvé";
            }
        }).catch((err) => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Échec de l'emplacement CourseCollectiveDemand";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec de l'emplacement CourseCollectiveDemand";
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
                    _output.message = "CourseCollectiveDemand Slot disponible avec succès";
                } else {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "Aucun enregistrement trouvé";
                }
            }).catch((err) => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Échec de l'emplacement CourseCollectiveDemand";
            })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec de l'emplacement CourseCollectiveDemand";
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
                    _output.message = "Intervalle de temps réussi";
                } else {
                    var obj = {
                        availabilty: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Aucun créneau horaire trouvé";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Échec de la plage horaire";
            });
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec de la plage horaire";
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
                                _output.message = "Échec de l'insertion de la disponibilité du coach";
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
                _output.message = "Emplacement actuellement non disponible";
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
                _output.message = "CourseCollectiveDemand Prix Obtenez avec succès";
            } else {
                var obj = {
                    availabilty: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Aucun enregistrement trouvé";
            }
        }).catch((err) => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Échec du cours CourseCollectiveDemand";
        })
    } else {
        _output.data = lang.required_field;
        _output.isSuccess = false;
        _output.message = "Échec du cours CourseCollectiveDemand";
    }
    res.send(_output);
}

exports.geolocationByPostalCode = async function (req, res, next) {
    var _output = new output();
    console.log('Req Params : ' + req.params.id);
    const postalCode = req.params.id;
    console.log(postalCode);
    //return;
    if (postalCode != "") {
        var query = "SELECT * FROM cities WHERE Code_postal=" + postalCode;
        await db_library
            .execute(query)
            .then(async (value) => {
                console.log(value);
                //return;
                if (value.length > 0) {
                    var obj = {
                        coordonnees_gps: value[0].coordonnees_gps
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Coordonnées GPS trouvées";
                }// End of value.length > 0
                else {
                    var obj = {
                        coordonnees_gps: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Coordonnées GPS introuvables";
                }// End of value.length < 0
            }).catch((err) => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Coordonnées GPS introuvables";
            })
    }
    else {
        _output.data = {};
        _output.isSuccess = false;
        _output.message = "Postal Code is not present";
    }
    res.send(_output);
}
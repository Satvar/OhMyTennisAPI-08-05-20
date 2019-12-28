const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const moment = require('moment');

exports.insertIndividualCourse = async function (req, res, next) {
    var _output = new output();
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Price_min,
        Price_max,
        Technical_provided,
        Video,
        Mode_of_Transport,
        Plan
    } = req.body;

    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Price_min != "" && Price_max != "" && Technical_provided != "" && Video != "" && Mode_of_Transport != "" && Plan != "") {
        var insert_query = "INSERT INTO `individualcourses` (`Coach_Id`, `Mode_of_Transport`, `Description`, `Price_min`, `Price_max`," +
            " `Technical_provided`, `Video`, `Plan`, `createdAt`, `updatedAt`,`Postalcode`,`Location`) VALUES " +
            "(?,?,?,?,?,?,?,?,Now(),Now(),?,?);";

        var update_query = "Update `individualcourses` set `Mode_of_Transport`=?, `Description`=?, `Price_min`=?," +
            "`Price_max`=?, `Technical_provided`=?, `Video` =?, `Plan` =?, `Location` =?, `Postalcode` =?,  `updatedAt` = NOW() where `Coach_Id` = ?";

        await db_library
            .execute("SELECT * FROM `individualcourses` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
                if (value.length > 0) {
                    await db_library
                        .parameterexecute(update_query, [Mode_of_Transport, Description, Price_min, Price_max, Technical_provided, Video, Plan, Location, Postalcode, Coach_Id]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "individual course updated successfully";

                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "individual course update Failed";
                        });
                } else {
                    await db_library
                        .parameterexecute(insert_query, [Coach_Id, Mode_of_Transport, Description, Price_min, Price_max, Technical_provided, Video, Plan, Postalcode, Location]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "individual course added successfully";
                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "individual course added Failed";
                        });
                }
            }).catch(err => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Error in Individual Course Insert or Update";
            });
        res.send(_output);
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "individual course added Failed";
    }
}

exports.getIndividualCourse = async function (req, res, next) {
    var _output = new output();
    const id = req.query.coachId;

    if (id != "") {
        var query = "select * from individualcourses where Coach_Id = " + id;
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Individual course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Individual course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Individual course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Individual course get Failed";
    }
    res.send(_output);
}

exports.setcouseCollectiveDemanad = async function (req, res, next) {
    var _output = new output();
    const {
        Coach_Id,
        Min_People,
        Max_People,
        Description,
        Location,
        Postalcode,
        Mode_of_transport,
        Price_2pl_1hr,
        Price_2pl_10hr,
        Price_3pl_1hr,
        Price_3pl_10hr,
        Price_4pl_1hr,
        Price_4pl_10hr,
        Price_6pl_1hr,
        Price_5pl_1hr,
        Price_6pl_10hr,
        Plan,
        Price_Mon,
        Price_Tue,
        Price_Wed,
        Price_Thr,
        Price_Fri,
        Price_Sat,
        Price_Sun,
    } = req.body;

    var insert_query = "INSERT INTO `course_collective_if_demand`(`Coach_Id`,`Min_People`, `Max_People`, `Description`, `Location`, `Mode_of_transport`, `Price_2pl_1hr`, `Price_2pl_10hr`, `Price_3pl_1hr`, `Price_3pl_10hr`,`Price_4pl_1hr`,`Price_4pl_10hr`,`Price_5pl_1hr`,`Price_6pl_1hr`,`Price_6pl_10hr`, `Plan`, `createdAt`,Price_Mon,Price_Tue,Price_Wed,Price_Thr,Price_Fri,Price_Sat,Price_Sun,Postalcode) VALUES" +
        "(?,?,?,?,?,?,?, " + 0 + ",?, " + 0 + ",?, " + 0 + ",?,?, " + 0 + ",?, NOW(),?,?,?,?,?,?,?,?);";

    var update_query = "Update `course_collective_if_demand` set `Min_People`=?, `Max_People`=?, `Description`=?," +
        "`Location`=?,`Postalcode`=?, `Mode_of_transport`=?, `Price_2pl_1hr` =?, `Price_2pl_10hr` =" + 0 + "," +
        " `Price_3pl_1hr` =?, `Price_3pl_10hr` =" + 0 + ", `Price_4pl_1hr` =?, `Price_4pl_10hr` =" + 0 + ",`Price_5pl_1hr` =?, `Price_6pl_1hr` =?, `Price_6pl_10hr` =" + 0 + ", `Plan` =?, `createdAt` = NOW(), Price_Mon = ? , Price_Tue =?, Price_Wed =?, Price_Thr = ?, Price_Fri =?, Price_Sat =?, Price_Sun =?,Postalcode=? where `Coach_Id` = ?";

    await db_library
        .execute("SELECT * FROM `course_collective_if_demand` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
            if (value.length > 0) {
                await db_library
                    .parameterexecute(update_query, [Min_People, Max_People, Description, Location, Postalcode, Mode_of_transport, Price_2pl_1hr, Price_3pl_1hr, Price_4pl_1hr, Price_5pl_1hr, Price_6pl_1hr, Plan, Price_Mon, Price_Tue, Price_Wed, Price_Thr, Price_Fri, Price_Sat, Price_Sun, Postalcode, Coach_Id]).then((value) => {
                        var result = {};
                        _output.data = result;
                        _output.isSuccess = true;
                        _output.message = "Couse Collectice Demanad updated successfully";

                    }).catch(err => {
                        _output.data = err.message;
                        _output.isSuccess = false;
                        _output.message = "Couse Collectice Demanad updated Failed";
                    });
            } else {
                await db_library
                    .parameterexecute(insert_query, [Coach_Id, Min_People, Max_People, Description, Location, Mode_of_transport, Price_2pl_1hr, Price_3pl_1hr, Price_4pl_1hr, Price_5pl_1hr, Price_6pl_1hr, Plan, Price_Mon, Price_Tue, Price_Wed, Price_Thr, Price_Fri, Price_Sat, Price_Sun, Postalcode]).then((value) => {
                        _output.data = {};
                        _output.isSuccess = true;
                        _output.message = "Couse Collectice Demanad added successfully";
                    }).catch(err => {
                        _output.data = err.message;
                        _output.isSuccess = false;
                        _output.message = "Couse Collectice Demanad added Failed";
                    });
            }
        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Couse Collectice Demanad does not Exist";
        });
    res.send(_output);
}

exports.getcouseCollectiveDemanad = async function (req, res, next) {
    var _output = new output();
    const Coach_Id = req.query.Coach_ID;

    if (Coach_Id != "") {
        await db_library
            .execute("SELECT * FROM `course_collective_if_demand` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
                if (value.length > 0) {
                    var result = value;
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "couseCollectiveDemanad Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "No record found";
                }

            }).catch((err) => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "couseCollectiveDemanad get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "couseCollectiveDemanad get Failed";
    }
    res.send(_output);
}

exports.setCourseCollectiveClub = async function (req, res, next) {
    var _output = new output();
    const {
        Coach_Id,
        Description,
        Photo,
        Technical_Provided,
        Video,
        Mode_of_Transport,
        Plan,
        Club_Name,
        Place,
        Postalcode,
        availablity
    } = req.body;
    // const Coach_Id = req.body.Coach_Id;

    if (Coach_Id != "" && Description != "" && Photo != "" && Technical_Provided != "" && Postalcode != "" && Video != "" && Mode_of_Transport != "" && Plan != "" && Club_Name != "" && Place != "") {

        var insert_query = "INSERT INTO `couse_collective_if_club` (`Coach_Id`, `Mode_of_Transport`, `Description`, `Photo`," +
            " `Technical_Provided`, `Video`, `Plan`, `createdAt`,Club_Name,Place,Postalcode) VALUES " +
            "(?,?,?,?,?,?,?, NOW(),?,?,?);";

        var update_query = "Update `couse_collective_if_club` set `Mode_of_Transport`=?, `Description`=?," +
            "`Photo`=?, `Technical_Provided`=?, `Video` = ?, `Plan` =?,  `createdAt` = NOW(), `Club_Name` = ?, `Place` =?, `Postalcode` =? where `Coach_Id` = ?";

        await db_library
            .execute("SELECT * FROM `couse_collective_if_club` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
                if (value.length > 0) {
                    await db_library
                        .parameterexecute(update_query, [Mode_of_Transport, Description, Photo, Technical_Provided, Video, Plan, Club_Name, Place, Postalcode, Coach_Id]).then(async (value) => {
                            if (value.affectedRows > 0) {
                                for (var i = 0; i < availablity.length; i++) {
                                    const {
                                        CoachId,
                                        Weekday,
                                        StartTime,
                                        EndTime,
                                        MaxCount,
                                        Price,
                                        Course,
                                        Id,
                                    } = availablity[i];
                                    if (Id == "") {
                                        var insert_availablity = "call inst_upd_clubavailablity(" + Coach_Id + ",'" + Weekday + "','" + StartTime + "','" + EndTime + "'," + MaxCount + "," + Price + ",'" + Course + "',0 )"
                                    } else {
                                        var insert_availablity = "call inst_upd_clubavailablity(" + Coach_Id + ",'" + Weekday + "','" + StartTime + "','" + EndTime + "'," + MaxCount + "," + Price + ",'" + Course + "'," + Id + ")"
                                    }
                                    await db_library
                                        .execute(insert_availablity).then(async (res) => {
                                            _output.data = {};
                                            _output.isSuccess = true;
                                            _output.message = "CourseCollectiveClub Updated successfully";
                                        }).catch(err => {
                                            _output.data = err.message;
                                            _output.isSuccess = false;
                                            _output.message = "CourseCollectiveClub Update Failed";
                                        })
                                }
                            }
                        }).catch(err => {
                            _output.data = err.message;
                            _output.isSuccess = false;
                            _output.message = "CourseCollectiveClub updated Failed";
                        });
                } else {
                    await db_library
                        .parameterexecute(insert_query, [Coach_Id, Mode_of_Transport, Description, Photo, Technical_Provided, Video, Plan, Club_Name, Place, Postalcode]).then(async (value) => {
                            if (value.affectedRows > 0) {
                                for (var i = 0; i < availablity.length; i++) {
                                    const {
                                        CoachId,
                                        Weekday,
                                        StartTime,
                                        EndTime,
                                        MaxCount,
                                        Price,
                                        Course,
                                        Id,
                                    } = availablity[i];
                                    if (Id == "") {
                                        var insert_availablity = "call inst_upd_clubavailablity(" + Coach_Id + ",'" + Weekday + "','" + StartTime + "','" + EndTime + "'," + MaxCount + "," + Price + ",'" + Course + "',0 )"
                                    } else {
                                        var insert_availablity = "call inst_upd_clubavailablity(" + Coach_Id + ",'" + Weekday + "','" + StartTime + "','" + EndTime + "'," + MaxCount + "," + Price + ",'" + Course + "'," + Id + ")"
                                    }
                                    await db_library
                                        .execute(insert_availablity).then(async (res) => {
                                            _output.data = {};
                                            _output.isSuccess = true;
                                            _output.message = "CourseCollectiveClub added successfully";
                                        }).catch(err => {
                                            _output.data = err.message;
                                            _output.isSuccess = false;
                                            _output.message = "CourseCollectiveClub added Failed";
                                        })
                                }
                            }
                        }).catch(err => {
                            _output.data = err.message;
                            _output.isSuccess = false;
                            _output.message = "CourseCollectiveClub added Failed";
                        });
                }
            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "CourseCollectiveClub does not Exist";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "couseCollectiveDemanad get Failed";
    }
    res.send(_output);
}

exports.deleteClubAvailablity = async function (req, res, next) {
    var _output = new output();
    const CoachId = req.body.CoachId;
    const Id = req.body.Id;

    if (CoachId != "" && Id != "") {
        await db_library
            .execute("DELETE FROM `courseclub_availablity` WHERE CoachId=" + CoachId + " AND Id = " + Id + "").then(async (value) => {
                if (value.affectedRows > 0) {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "Club Availability Delete Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = true;
                    _output.message = "No record found";
                }

            }).catch((err) => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Club Availability Delete Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Club Availability Delete Failed";
    }
    res.send(_output);
}

exports.getCourseCollectiveClub = async function (req, res, next) {
    var _output = new output();
    const ids = req.query.coachId;

    if (ids != "") {
        await db_library
            .execute("SELECT * FROM `couse_collective_if_club` WHERE Coach_Id=" + ids + "").then(async (value) => {
                await db_library.execute("SELECT * FROM `courseclub_availablity` WHERE CoachId = " + ids + "").then((res) => {
                    if (value.length > 0 && res.length > 0) {
                        var obj = {
                            course: value,
                            availablity: res
                        }
                        _output.data = obj;
                        _output.isSuccess = true;
                        _output.message = "CourseCollectiveClub Get successfully";
                    } else if (value.length > 0 && res.length == 0) {
                        var obj = {
                            course: value,
                            availablity: [{
                                Id: "",
                                CoachId: "",
                                Weekday: "",
                                MaxCount: "",
                                StartTime: "",
                                EndTime: "",
                                Price: "",
                                Course: ""
                            }]
                        }
                        _output.data = obj;
                        _output.isSuccess = true;
                        _output.message = "CourseCollectiveClub Get successfully";
                    } else {
                        var obj = {
                            course: [],
                            availablity: []
                        }
                        _output.data = obj;
                        _output.isSuccess = true;
                        _output.message = "No records Found";
                    }
                })
            }).catch((err) => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "CourseCollectiveClub get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "CourseCollectiveClub get Failed";
    }
    res.send(_output);
}

exports.getYear = async function (req, res, next) {
    var _output = new output();

    await db_library
        .execute("SELECT * FROM `courseclub_year`").then(async (value) => {
            if (value.length > 0) {
                var result = value;
                var obj = {
                    year: result
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Year Get successfully";
            } else {
                var obj = {
                    course: []
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "No records Found";
            }
        }).catch((err) => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Year get Failed";
        })
    res.send(_output);
}

exports.setStageCourse = async function (req, res, next) {
    var _output = new output();
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Price,
        Photo,
        from_date,
        to_date,
        Eventname,
        Eventdetails,
        Mode_of_transport,
        Plan,
        filename
    } = req.body;

    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Photo != "" && from_date != "" && Mode_of_transport != "" && Plan != "" && to_date != "" && Eventdetails != "" && Eventname != "") {
        var insert_query = "INSERT INTO `course_stage` (`Coach_Id`, `Mode_of_transport`, `Description`, `Price`, `Photo`," +
            " `from_date`, `Plan`,`filename`,`Postalcode`,`Location`,`to_date`,`Eventname`,`Eventdetails`) VALUES " +
            "(?,?,?,?,?,?,?,?,?,?,?,?,?);";

        var update_query = "Update `course_stage` set `Mode_of_transport`=?, `Description`=?, `filename`=?, `Price`=?," +
            "`Photo`=?, `from_date`=?, `Plan` =?, `Location` =?, `to_date` =?, `Eventname` =?, `Eventdetails` =?, `Postalcode` =? where `Coach_Id` = ?";

        await db_library
            .execute("SELECT * FROM `course_stage` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
                if (value.length > 0) {
                    await db_library
                        .parameterexecute(update_query, [Mode_of_transport, Description, filename, Price, Photo, from_date, Plan, Location, to_date, Eventname, Eventdetails, Postalcode, Coach_Id]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Stage course updated successfully";

                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Stage course update Failed";
                        });
                } else {
                    await db_library
                        .parameterexecute(insert_query, [Coach_Id, Mode_of_transport, Description, Price, Photo, from_date, Plan, filename, Postalcode, Location, to_date, Eventname, Eventdetails]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Stage course added successfully";
                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Stage course added Failed";
                        });
                }
            }).catch(err => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Error in Stage Course Insert or Update";
            });
        
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage course added Failed";
    }
    res.send(_output);
    console.log(output)
}

exports.getStageCourse = async function (req, res, next) {
    var _output = new output();
    const id = req.query.coachId;

    if (id != "") {
        var query = "SELECT * FROM `course_stage` WHERE `Coach_Id` = " + id;
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Stage course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Stage course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Stage course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage course get Failed";
    }
    res.send(_output);
}

exports.setTournamentCourse = async function (req, res, next) {
    var _output = new output();
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Price,
        Photo,
        from_date,
        to_date,
        Tournamentname,
        Eventdetails,
        Plan,
        filename
    } = req.body;
    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Photo != "" && from_date != "" 
    && Plan != "" && to_date != "" && Eventdetails != "" && Tournamentname != "") {
        var insert_query = "INSERT INTO `tournament` (`Coach_Id`, `Description`, `Price`, `Photo`," +
            " `from_date`, `Plan`,`Postalcode`,`Location`,`to_date`,`Tournamentname`,`Eventdetails`,`filename`) VALUES " +
            "(?,?,?,?,?,?,?,?,?,?,?,?);";

        var update_query = "Update `tournament` set `filename`=?, `Description`=?, `Price`=?," +
            "`Photo`=?, `from_date`=?, `Plan` =?, `Location` =?, `to_date` =?, `Tournamentname` =?, `Eventdetails` =?, `Postalcode` =? where `Coach_Id` = ?";
            console.log(update_query);
        await db_library
            .execute("SELECT * FROM `tournament` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
                if (value.length > 0) {
                    await db_library
                        .parameterexecute(update_query, [filename, Description, "0", Photo, from_date, Plan, Location, to_date, Tournamentname, Eventdetails, Postalcode, Coach_Id]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Tournament course updated successfully";
                        }).catch(err => {
                            console.log(err);
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Tournament course update Failed";
                        });
                } else {
                    await db_library
                        .parameterexecute(insert_query, [Coach_Id, Description, "0", Photo, from_date, Plan, Postalcode, Location, to_date, Tournamentname, Eventdetails, filename]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Tournament course added successfully";
                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Tournament course added Failed";
                        });
                }
            }).catch(err => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Error in Tournament Course Insert or Update";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Tournament course added Failed";
    }
    res.send(_output);
}

exports.getTournamentCourse = async function (req, res, next) {
    var _output = new output();
    const id = req.query.coachId;

    if (id != "") {
        var query = "select * from tournament where Coach_Id = " + id;
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Tournament course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Tournament course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Tournament course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Tournament course get Failed";
    }
    res.send(_output);
}


// New Code Start

exports.getStage = async function (req, res, next) {
    var _output = new output();
    const Coach_id = req.query.coachId;
    const id = req.query.id;

    if (id != "" && Coach_id != "") {
        // var query = "select * from course_stage where Coach_Id = " + Coach_id + " AND id = " + id + "";
        var query = "select course_stage.*,users.* from course_stage JOIN users ON  course_stage.Coach_Id = users.id where Coach_Id = " + Coach_id + " AND id = " + id + "";
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Stage course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Stage course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Stage course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage course get Failed";
    }
    res.send(_output);
}

exports.setStageCourseUpdate = async function (req, res, next) {
    var _output = new output();
    const {
        id,
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Price,
        Photo,
        from_date,
        to_date,
        Eventname,
        Eventdetails,
        Mode_of_transport,
        Plan,
        filename
    } = req.body;

    if (id != "" && Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Price != "" && Photo != "" && from_date != "" && Mode_of_transport != "" && Plan != "" && to_date != "" && Eventdetails != "" && Eventname != "") {

        // var insert_query = "INSERT INTO `course_stage` (`Coach_Id`, `Mode_of_transport`, `Description`, `Price`, `Photo`," +
        //     " `from_date`, `Plan`,`filename`,`Postalcode`,`Location`,`to_date`,`Eventname`,`Eventdetails`) VALUES " +
        //     "(?,?,?,?,?,?,?,?,?,?,?,?,?);";

        var update_query = "Update `course_stage` set `Mode_of_transport`=?, `Description`=?, `filename`=?, `Price`=?, `Photo`=?, `from_date`=?, `Plan` =?, `Location` =?, `to_date` =?, `Eventname` =?, `Eventdetails` =?, `Postalcode` =? where `Coach_Id` = ? AND `id`=?";

        // var insert_query = "INSERT INTO `course_stage` (`Coach_Id`, `Mode_of_transport`, `Description`, `Price`, `Photo`, `from_date`, `Plan`,`filename`,`Postalcode`,`Location`,`to_date`,`Eventname`,`Eventdetails`) VALUES ('" + Coach_Id + "','" + Mode_of_transport + "','" + Description + "','" + Price + "','" + Photo + "','" + from_date + "','" + Plan + "','" + filename + "','" + Postalcode + "','" + Location + "','" + to_date + "','" + Eventname + "','" + Eventdetails + "')"

        // await db_library
        //     .execute("SELECT * FROM `course_stage` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
        //         if (value.length > 0) {
        await db_library
            .parameterexecute(update_query, [Mode_of_transport, Description, filename, Price, Photo, formatDate(from_date), Plan, Location, formatDate(to_date), Eventname, Eventdetails, Postalcode, Coach_Id, id]).then((value) => {
                var result = value;
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "Stage course updated successfully";

            }).catch(err => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Stage course update Failed";
            });
        // } else {
        // await db_library
        //     .execute(insert_query).then((value) => {
        //         var result = value;
        //         _output.data = {};
        //         _output.isSuccess = true;
        //         _output.message = "Stage course added successfully";
        //     }).catch(err => {
        //         _output.data = {};
        //         _output.isSuccess = false;
        //         _output.message = "Stage course added Failed";
        //     });
        //     }
        // }).catch(err => {
        //     _output.data = "";
        //     _output.isSuccess = false;
        //     _output.message = "Error in Stage Course Insert or Update";
        // });
        res.send(_output);
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage course update Failed";
    }
}

exports.setStageCourseInsert = async function (req, res, next) {
    var _output = new output();    
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Price,
        Photo,
        from_date,
        to_date,
        Eventname,
        Eventdetails,
        Mode_of_transport,
        Plan,
        filename
    } = req.body;

    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Price != "" && Photo != "" && from_date != "" && Mode_of_transport != "" && Plan != "" && to_date != "" && Eventdetails != "" && Eventname != "") {
//console.log("request--- ", req.body)
        // var insert_query = "INSERT INTO `course_stage` (`Coach_Id`, `Mode_of_transport`, `Description`, `Price`, `Photo`,`from_date`, `Plan`,`filename`,`Postalcode`,`Location`,`to_date`,`Eventname`,`Eventdetails`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);";

        // var update_query = "Update `course_stage` set `Mode_of_transport`=?, `Description`=?, `filename`=?, `Price`=?," +
        //     "`Photo`=?, `from_date`=?, `Plan` =?, `Location` =?, `to_date` =?, `Eventname` =?, `Eventdetails` =?, `Postalcode` =? where `Coach_Id` = ?";

        var insert_query = "INSERT INTO `course_stage` (`Coach_Id`, `Mode_of_transport`, `Description`, `Price`, `Photo`, `from_date`, `Plan`,`filename`,`Postalcode`,`Location`,`to_date`,`Eventname`,`Eventdetails`) VALUES ('" + Coach_Id + "','" + Mode_of_transport + "','" + Description + "','" + Price + "','" + Photo + "','" + formatDate(from_date) + "','" + Plan + "','" + filename + "','" + Postalcode + "','" + Location + "','" + formatDate(to_date) + "','" + Eventname + "','" + Eventdetails + "')"

        // await db_library
        //     .execute("SELECT * FROM `course_stage` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
        //         if (value.length > 0) {
        //     await db_library
        //         .parameterexecute(update_query, [Mode_of_transport, Description, filename, Price, Photo, formatDate(from_date), Plan, Location, formatDate(to_date), Eventname, Eventdetails, Postalcode, Coach_Id]).then((value) => {
        //             var result = value;
        //             _output.data = {};
        //             _output.isSuccess = true;
        //             _output.message = "Stage course updated successfully";

        //         }).catch(err => {
        //             _output.data = {};
        //             _output.isSuccess = false;
        //             _output.message = "Stage course update Failed";
        //         });
        // } else {

        //[Coach_Id, Mode_of_transport, Description, Price, Photo, formatDate(from_date), Plan, filename, Postalcode, Location, formatDate(to_date), Eventname, Eventdetails]
        await db_library
            .execute(insert_query).then((value) => {
                var result = value;
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "Stage course added successfully";
            }).catch(err => {
                //console.log(err)
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Stage course added Failed";
            });
        //     }
        // }).catch(err => {
        //     _output.data = "";
        //     _output.isSuccess = false;
        //     _output.message = "Error in Stage Course Insert or Update";
        // });
        res.send(_output);
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage course added Failed";
        res.send(_output);
    }
}

exports.setTournamentCourseUpdate = async function (req, res, next) {
    var _output = new output();
    const {
        id,
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Price,
        Photo,
        from_date,
        to_date,
        Tournamentname,
        Eventdetails,
        Plan,
        filename
    } = req.body;
    if (id != "" && Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Photo != "" && from_date != "" && Plan != "" && to_date != "" && Eventdetails != "" && Tournamentname != "") {


        var update_query = "Update `tournament` set `filename`=?, `Description`=?, `Price`=?," +
            "`Photo`=?, `from_date`=?, `Plan` =?, `Location` =?, `to_date` =?, `Tournamentname` =?, `Eventdetails` =?, `Postalcode` =? where `Coach_Id` = ? AND `id`=?";
        //console.log(update_query);
        await db_library
            .execute("SELECT * FROM `tournament` WHERE Coach_Id=" + Coach_Id + " AND id=" + id + "").then(async (value) => {
                if (value.length > 0) {
                    await db_library
                        .parameterexecute(update_query, [filename, Description, "0", Photo, from_date, Plan, Location, to_date, Tournamentname, Eventdetails, Postalcode, Coach_Id, id]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Tournament course updated successfully";
                        }).catch(err => {
                            //console.log(err);
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Tournament course update Failed";
                        });
                }
                // else {
                //     await db_library
                //         .parameterexecute(insert_query, [Coach_Id, Description, "0", Photo, from_date, Plan, Postalcode, Location, to_date, Tournamentname, Eventdetails, filename]).then((value) => {
                //             var result = value;
                //             _output.data = {};
                //             _output.isSuccess = true;
                //             _output.message = "Tournament course added successfully";
                //         }).catch(err => {
                //             _output.data = {};
                //             _output.isSuccess = false;
                //             _output.message = "Tournament course added Failed";
                //         });
                // }
            }).catch(err => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Error in Tournament Course Insert or Update";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Tournament course added Failed";
    }
    res.send(_output);
}


exports.setTournamentCourseInsert = async function (req, res, next) {
    var _output = new output();
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Price,
        Photo,
        from_date,
        to_date,
        Tournamentname,
        Eventdetails,
        Plan,
        filename
    } = req.body;
    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Photo != "" && from_date != ""
        && Plan != "" && to_date != "" && Eventdetails != "" && Tournamentname != "") {
        // var insert_query = "INSERT INTO `tournament` (`Coach_Id`, `Description`, `Price`, `from_date`, `Plan`,`Postalcode`,`Location`,`to_date`,`Tournamentname`,`Eventdetails`,`filename`) VALUES " +
        //     "(?,?,?,?,?,?,?,?,?,?,?,?);";

        var insert_query = "INSERT INTO `tournament` (`Coach_Id`, `Description`, `Price`, `Photo`,`from_date`, `Plan`,`Postalcode`,`Location`,`to_date`,`Tournamentname`,`Eventdetails`,`filename`) VALUES ('" + Coach_Id + "','" + Description + "','" + Price + "','" + Photo + "','" + from_date + "','" + Plan + "','" + Postalcode + "','" + Location + "','" + to_date + "','" + Tournamentname + "','" + Eventdetails + "','" + filename + "')"

        //console.log(insert_query)

        await db_library
            .execute(insert_query).then((value) => {
                var result = value;
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "Tournament course added successfully";
            }).catch(err => {
                console.log(err)
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Tournament course added Failed";
            });

    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Tournament course added Failed";
    }
    res.send(_output);
}


exports.getTournament = async function (req, res, next) {
    var _output = new output();
    //console.log('query', req.query)
    const Coach_id = req.query.coachId;
    const id = req.query.id;

    if (id != "" && Coach_id != "") {
        var query = "select * from tournament where Coach_Id = " + Coach_id + " AND id = " + id + "";
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Tournament course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Tournament course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Tournament course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Tournament course get Failed";
    }
    res.send(_output);
}

exports.setAnimationInsert = async function (req, res, next) {
    var _output = new output();
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Photo,
        Eventdetails,
        Plan,
        Price,
        filename
    } = req.body;

    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Photo != "" && Plan != "" && Eventdetails != "") {

        var insert_query = "INSERT INTO `animations` (`Coach_Id`, `Description`, `Photo`," +
            "`Plan`,`Postalcode`,`Location`,`Eventdetails`,`filename`,`Price`) VALUES ('" + Coach_Id + "','" + Description + "','" + Photo + "','" + Plan + "','" + Postalcode + "','" + Location + "','" + Eventdetails + "','" + filename + "','" + Price + "')"

        // var insert_query = "INSERT INTO `animations` (`Coach_Id`, `Description`, `Photo`," +
        //     "`Plan`,`Postalcode`,`Location`,`Eventdetails`,`filename`,`Price`) VALUES " +
        //     "(?,?,?,?,?,?,?,?,?);";

        // var update_query = "Update `animations` set `Description`=?, `filename`=?," +
        //     "`Photo`=?, `Plan` =?, `Location` =?, `Eventdetails` =?, `Postalcode` =?, `Price` =? where `Coach_Id` =?";

        // await db_library
        //     .execute("SELECT * FROM `animations` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
        //         if (value.length > 0) {
        //             await db_library
        //                 .parameterexecute(update_query, [Description, filename, Photo, Plan, Location, Eventdetails, Postalcode, Price, Coach_Id]).then((value) => {
        //                     var result = value;
        //                     _output.data = {};
        //                     _output.isSuccess = true;
        //                     _output.message = "Animation course updated successfully";

        //                 }).catch(err => {
        //                     _output.data = {};
        //                     _output.isSuccess = false;
        //                     _output.message = "Animation course update Failed";
        //                 });
        //         } else {
        await db_library
            .execute(insert_query).then((value) => {
                var result = value;
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "Animation course added successfully";
            }).catch(err => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Animation course added Failed";
            });
        //     }
        // }).catch(err => {
        //     _output.data = "";
        //     _output.isSuccess = false;
        //     _output.message = "Error in Animation Course Insert or Update";
        // });
        res.send(_output);
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage Animation added Failed";
    }
}


exports.setAnimationUpdate = async function (req, res, next) {
    var _output = new output();
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Photo,
        Eventdetails,
        Plan,
        Price,
        filename,
        id
    } = req.body;

    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Photo != "" && Plan != "" && Eventdetails != "") {

        // var insert_query = "INSERT INTO `animations` (`Coach_Id`, `Description`, `Photo`," +
        //     "`Plan`,`Postalcode`,`Location`,`Eventdetails`,`filename`,`Price`) VALUES " +
        //     "(?,?,?,?,?,?,?,?,?);";

        var update_query = "Update `animations` set `Description`=?, `filename`=?," +
            "`Photo`=?, `Plan` =?, `Location` =?, `Eventdetails` =?, `Postalcode` =?, `Price` =? where `Coach_Id` =? AND `id`=?";

        // await db_library
        //     .execute("SELECT * FROM `animations` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
        //         if (value.length > 0) {
        await db_library
            .parameterexecute(update_query, [Description, filename, Photo, Plan, Location, Eventdetails, Postalcode, Price, Coach_Id, id]).then((value) => {
                var result = value;
                _output.data = {};
                _output.isSuccess = true;
                _output.message = "Animation course updated successfully";

            }).catch(err => {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Animation course update Failed";
            });
        //         } else {
        // await db_library
        //     .execute(insert_query).then((value) => {
        //         var result = value;
        //         _output.data = {};
        //         _output.isSuccess = true;
        //         _output.message = "Animation course added successfully";
        //     }).catch(err => {
        //         _output.data = {};
        //         _output.isSuccess = false;
        //         _output.message = "Animation course added Failed";
        //     });
        //     }
        // }).catch(err => {
        //     _output.data = "";
        //     _output.isSuccess = false;
        //     _output.message = "Error in Animation Course Insert or Update";
        // });
        res.send(_output);
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage Animation added Failed";
    }
}

/**
 * New Code End
 */

exports.setAnimationCourse = async function (req, res, next) {
    var _output = new output();
    const {
        Location,
        Postalcode,
        Coach_Id,
        Description,
        Photo,
        Eventdetails,
        Plan,
        Price,
        filename
    } = req.body;

    if (Coach_Id != "" && Location != "" && Postalcode != "" && Description != "" && Photo != "" && Plan != "" && Eventdetails != "") {
        var insert_query = "INSERT INTO `animations` (`Coach_Id`, `Description`, `Photo`," +
            "`Plan`,`Postalcode`,`Location`,`Eventdetails`,`filename`,`Price`) VALUES " +
            "(?,?,?,?,?,?,?,?,?);";

        var update_query = "Update `animations` set `Description`=?, `filename`=?," +
            "`Photo`=?, `Plan` =?, `Location` =?, `Eventdetails` =?, `Postalcode` =?, `Price` =? where `Coach_Id` =?";

        await db_library
            .execute("SELECT * FROM `animations` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
                if (value.length > 0) {
                    await db_library
                        .parameterexecute(update_query, [Description, filename, Photo, Plan, Location, Eventdetails, Postalcode, "0", Coach_Id]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Animation course updated successfully";

                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Animation course update Failed";
                        });
                } else {
                    await db_library
                        .parameterexecute(insert_query, [Coach_Id, Description, Photo, Plan, Postalcode, Location, Eventdetails, filename, "0"]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Animation course added successfully";
                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Animation course added Failed";
                        });
                }
            }).catch(err => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Error in Animation Course Insert or Update";
            });
       
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Stage Animation added Failed";
    }
    res.send(_output);
}

exports.getAnimationCourse = async function (req, res, next) {
    var _output = new output();
    const id = req.query.coachId;

    if (id != "") {
        var query = "select * from animations where Coach_Id = " + id;
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Animation course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Animation course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Animation course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Animation course get Failed";
    }
    res.send(_output);
}

exports.getAnimation = async function (req, res, next) {    
    var _output = new output();
    const Coach_id = req.query.coachId;
    const id = req.query.id;

    if (id != "" && Coach_id != "") {
        var query = "select * from animations where Coach_Id = " + Coach_id + " AND id = " + id + "";

    // const id = req.query.coachId;

    // if (id != "") {
    //     var query = "select * from animations where Coach_Id = " + id;
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Animation course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Animation course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Animation course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Animation course get Failed";
    }
    res.send(_output);
}

exports.setTeambuildingCourse = async function (req, res, next) {
    var _output = new output();
    const {
        Coach_Id,
        Description,
        Photo,
        Eventdetails,
        Mode_of_transport,
        Plan,
        Price,
        filename
    } = req.body;

    if (Coach_Id != "" && Description != "" && Photo != "" && Mode_of_transport != "" && Plan != "" && Eventdetails != "") {
        var insert_query = "INSERT INTO `team_building` (`Coach_Id`, `Mode_of_transport`, `Description`, `Photo`," +
            "`Plan`,`Eventdetails`,`filename`,`Price`) VALUES (?,?,?,?,?,?,?,?);";

        var update_query = "Update `team_building` set `Mode_of_transport`=?, `Description`=?, `filename`=?,`Photo`=?, `Plan` =?, `Eventdetails` =?, `Price` =? where `Coach_Id` = ?";

        await db_library
            .execute("SELECT * FROM `team_building` WHERE Coach_Id=" + Coach_Id + "").then(async (value) => {
                if (value.length > 0) {
                    await db_library
                        .parameterexecute(update_query, [Mode_of_transport, Description, filename, Photo, Plan, Eventdetails, "0", Coach_Id]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Teambuilding course updated successfully";

                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Teambuilding course update Failed";
                        });
                } else {
                    await db_library
                        .parameterexecute(insert_query, [Coach_Id, Mode_of_transport, Description, Photo, Plan, Eventdetails, filename, "0"]).then((value) => {
                            var result = value;
                            _output.data = {};
                            _output.isSuccess = true;
                            _output.message = "Teambuilding course added successfully";
                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Teambuilding course added Failed";
                        });
                }
            }).catch(err => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Error in Teambuilding Course Insert or Update";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Teambuilding course added Failed";
    }
    res.send(_output);

}

exports.getTeambuildingCourse = async function (req, res, next) {
    var _output = new output();
    const id = req.query.coachId;

    if (id != "") {
        var query = "select * from team_building where Coach_Id = " + id;
        await db_library
            .execute(query).then(async (value) => {
                var result = value;
                if (value.length > 0) {
                    var obj = {
                        course: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Teambuilding course Get successfully";
                } else {
                    var obj = {
                        course: []
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Teambuilding course Not Found";
                }
            }).catch((err) => {
                _output.data = "";
                _output.isSuccess = false;
                _output.message = "Teambuilding course get Failed";
            })
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Teambuilding course get Failed";
    }
    res.send(_output);
}

function formatDate(date) {
    var formate_date = moment(date).format('YYYY-MM-DD');
    return formate_date;
}

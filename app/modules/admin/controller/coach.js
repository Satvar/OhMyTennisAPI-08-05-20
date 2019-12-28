const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const mail_template = require("../../MailTemplate/mailTemplate");
const appConfig = require("../../../../config/appConfig");
const moment = require('moment');

exports.getallcoaches = async function (req, res, next) {
    var _output = new output();
    var query = "SELECT `Coach_ID`, `Coach_Fname`, `Coach_Lname`, `Coach_Email`, `Coach_Phone`, `Coach_transport`, `Coach_City`, `Coach_Image`, `Coach_Status`, `Coach_Description`, `Coach_Experience`, `Active_Status`, `User_type` FROM `coaches_dbs`";
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
    const Coach_id = req.body.Coach_id;
    var _output = new output();

    if (Coach_id != "") {
        await db_library
            .execute("SELECT * FROM `coaches_dbs` WHERE Coach_ID='" + Coach_id + "'").then((value) => {
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
                    _output.isSuccess = false;
                    _output.message = " No Coach Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Coach Get Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Coach Get Failed";
    }
    res.send(_output);
}

exports.updatecoachProfile = async function(req, res, next) {
    var _output = new output();
    const {
        Coach_Fname,
        Coach_Lname,
        Coach_Email,
        Coach_Phone,
        InstagramURL,
        TwitterURL,
        FacebookURL,
        Coach_Description,
        Coach_transport,
        Coach_Price,
        Coach_PriceX10,
        Coach_Services,
        Coach_payment_type,
        Coach_Bank_Name,
        Branch_Code,
        Coach_Bank_ACCNum,
        Coach_Bank_City,
        Coach_Rayon,
        Coach_Image,
        Coach_Resume,
        ResumeName
    } = req.body;

    if (Coach_Fname != "" && InstagramURL != "" && TwitterURL != "" && FacebookURL != "" && Coach_Lname != "" && Coach_Email != "" && Coach_Phone != "" && Coach_Description != "" && Coach_transport != "" &&
        Coach_Price != "" && Coach_PriceX10 != "" && Coach_Services != "" && Coach_payment_type != "" && Coach_Bank_Name != "" && Branch_Code != "" &&
        Coach_Bank_ACCNum != "" && Coach_Bank_City != "" && Coach_Rayon != "" && Coach_Image != "" && Coach_Resume != "") {

        var coach_query = "UPDATE `coaches_dbs` SET `Coach_Fname` = '" + Coach_Fname + "', `Coach_Lname`='" + Coach_Lname + "', `Coach_Phone`='" + Coach_Phone + "', `InstagramURL`='" + InstagramURL + "', `TwitterURL`='" + TwitterURL + "', `FacebookURL`='" + FacebookURL + "',`Coach_Description`='" + Coach_Description + "',`Coach_transport`='" + Coach_transport + "',`Coach_Price`='" + Coach_Price + "',`Coach_PriceX10`='" + Coach_PriceX10 + "',`Coach_Services`='" + Coach_Services + "'," +
            "`Coach_payment_type`='" + Coach_payment_type + "',`Coach_Bank_Name`='" + Coach_Bank_Name + "',`Branch_Code`='" + Branch_Code + "',`Coach_Bank_ACCNum`='" + Coach_Bank_ACCNum + "',`Coach_Bank_City`='" + Coach_Bank_City + "',`Coach_Image`='" + Coach_Image + "',`Coach_Resume`='" + Coach_Resume + "',`Coach_Rayon`='" + Coach_Rayon + "',`ResumeName`='" + ResumeName + "' WHERE `Coach_Email`='" + Coach_Email + "';";


        await db_library.execute(coach_query).then((value) => {
            _output.data = {};
            _output.isSuccess = true;
            _output.message = "Update Successfully";
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Update failed";
        });

    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Update failed";
    }
    res.send(_output);
}

exports.getcoachbooking = async function (req, res, next) {
    var _output = new output();
    var query = "SELECT `Coach_ID`, `Coach_Fname`, `Coach_Lname`, `Coach_Email`, `Coach_Phone`, `Coach_transport`, `Coach_City`, `Coach_Image`, `Coach_Status`, `Coach_Description`, `Coach_Experience`, `User_type` FROM `coaches_dbs`";
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

exports.coachstatustoactive = async function (req, res, next) {
    const Coach_id = req.body.Coach_id;
    var _output = new output();

    if (Coach_id != "") {
        await db_library
            .execute("UPDATE `coaches_dbs` SET `Active_Status` = 'No' WHERE Coach_ID='" + Coach_id + "'").then((value) => {
                if (value.affectedRows == 1) {
                    var obj = {
                        coach_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Coach Status Update Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = " No Coach Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Coach Status Update Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Coach Status Update Failed";
    }
    res.send(_output);
}

exports.coachstatustoinactive = async function (req, res, next) {
    const Coach_id = req.body.Coach_id;
    var _output = new output();

    if (Coach_id != "") {
        await db_library
            .execute("UPDATE `coaches_dbs` SET `Active_Status` = 'Yes' WHERE Coach_ID='" + Coach_id + "'").then((value) => {
                if (value.affectedRows == 1) {
                    var obj = {
                        coach_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Coach Status Update Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = " No Coach Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Coach Status Update Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Coach Status Update Failed";
    }
    res.send(_output);
}
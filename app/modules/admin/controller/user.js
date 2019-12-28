const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const appConfig = require("../../../../config/appConfig")
const mail_template = require("../../MailTemplate/mailTemplate");

exports.index = async function(req, res, next) {
    var _output = new output();
    await db_library
        .execute("SELECT * FROM `users` where roleId = 1 ").then((value) => {
            var obj = {
                user_list : value
            }
            var result = obj;
            _output.data = result;
            _output.isSuccess = true;
            _output.message = "User Get Successfully";
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "User Get Failed";
        });

    res.send(_output);
}

exports.getuserbyid = async function(req, res, next) {
    const User_id = req.body.User_id;
    var _output = new output();

    if (User_id != "") {
        await db_library
            .execute("SELECT * FROM `users` WHERE id='" + User_id + "'").then((value) => {
                if (value.length > 0) {
                    var obj = {
                        User_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "User Get Successfull";
                } else {
                    var obj = {
                        User_list: {}
                    }
                    var result = obj;
                    _output.isSuccess = true;
                    _output.message = " No User Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "User Get Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "User Get Failed";
    }
    res.send(_output);
}

exports.userstatustoactive = async function (req, res, next) {
    const User_id = req.body.User_id;
    var _output = new output();

    if (User_id != "") {
        await db_library
            .execute("UPDATE `users` SET `isActive` = 0 WHERE id='" + User_id + "'").then((value) => {
                if (value.affectedRows == 1) {
                    var obj = {
                        user_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "User Status Update Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = " No User Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "User Status Update Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "User Status Update Failed";
    }
    res.send(_output);
}

exports.userstatustoinactive = async function (req, res, next) {
    const User_id = req.body.User_id;
    var _output = new output();
    
    if (User_id != "") {
        await db_library
            .execute("UPDATE `users` SET `isActive` = 1 WHERE id='" + User_id + "'").then((value) => {
               
                if (value.affectedRows == 1) {
                    var obj = {
                        coach_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "User Status Update Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = " No User Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "User Status Update Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "User Status Update Failed";
    }
    res.send(_output);

}

exports.updateUserProfile = async function(req, res, next) {
    var _output = new output();
    const {
        id,
        firstName,
        lastName,
        email,
        mobile,
        User_Location,
        User_Level,
        User_Team,
        address,
        User_Image,
    } = req.body;

    // if (firstName != "" && lastName != "" && email != "" && mobile != "" && User_Location != "" && User_Level != "" && User_Team != "" && address != "" &&
    //     User_Image != "") {

        var user_query = "UPDATE `users` SET `firstName` = '" + firstName + "', `lastName`='" + lastName + "', `email`='" + email + "', `mobile`='" + mobile + "'," +
            " `User_Location`='" + User_Location + "', `User_Level`='" + User_Level + "',`User_Team`='" + User_Team + "',`address`='" + address + "',`User_Image`='" + User_Image + "' WHERE `id`='" + id + "';";
console.log(user_query);
        await db_library.execute(user_query).then((value) => {
            _output.data = {};
            _output.isSuccess = true;
            _output.message = "Update Successfully";
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Update failed";
        });

    // } else {
    //     _output.data = "Required Field are missing";
    //     _output.isSuccess = false;
    //     _output.message = "Update failed";
    // }
    res.send(_output);
}
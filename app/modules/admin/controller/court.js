const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const appConfig = require("../../../../config/appConfig")
const mail_template = require("../../MailTemplate/mailTemplate");


exports.insertcourt = async function(req, res, next) {
    var _output = new output();
    const {
        court_name,
        incharge_name,
        court_email,
        court_phone,
        court_postal_code,
        court_address,
        courtfile
    } = req.body;
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var newdate = date+' '+time;
    
    if (court_name != "" && incharge_name != "" && court_email != "" && court_phone != "" && court_postal_code != "" && court_address != "") {
        
        var query = "INSERT INTO `tenniscourt`(`court_name`, `incharge_name`, `court_email`, `court_phone`, `court_postal_code`, `court_address`,`courtfile`, `created_time`)" +
            " VALUES ('" + court_name + "','" + incharge_name + "','" + court_email + "','" + court_phone + "','" + court_postal_code + "','" + court_address + "','"+ courtfile + "','" + newdate + "')";

        await db_library
        
            .execute("SELECT * FROM `tenniscourt` WHERE court_email='" + court_email + "'").then(async(value) => {
            var result = value;
           
            if (result.length == 0) {
                try {
                    // let res = exports.insertAdmin(query);
                    
                    await db_library.execute(query).then((val) => {
                        _output.data = val;
                        _output.isSuccess = true;
                        _output.message = "Register Successfully";
                    }).catch(err => {
                        _output.data = {};
                        _output.isSuccess = false;
                        _output.message = "Register failed";
                    });
                    
                } catch (error) {
                    _output.data = error;
                    _output.isSuccess = false;
                    _output.message = "Register Failed";
                }

            } else {
                _output.data = {};
                _output.isSuccess = false;
                _output.message = "Email already Exist";
            }
        }).catch(err => {
            _output.data = err.message;
            _output.isSuccess = false;
            _output.message = "Register Failed";
        });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Register Failed";
    }

    res.send(_output);
};

exports.updatecourt = async function(req, res, next) {
    var _output = new output();
    const {
        court_id,
        court_name,
        incharge_name,
        court_email,
        court_phone,
        court_postal_code,
        court_address,
        courtfile
    } = req.body;
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var updateddate = date+' '+time;
    
    if (court_name != "" && incharge_name != "" && court_email != "" && court_phone != "" && court_postal_code != "" && court_address != "") {
        
        var query = "UPDATE `tenniscourt` SET `court_name` = '" + court_name + "', `incharge_name`='" + incharge_name + "', `court_email`='" + court_email + "', `court_phone`='" + court_phone + "'," +
            " `court_postal_code`='" + court_postal_code + "', `courtfile`='" + courtfile + "',`court_address`='" + court_address + "',`updated_time`='" + updateddate + "' WHERE `court_id`='" + court_id + "';";

        
           
                try {
                    // let res = exports.insertAdmin(query);
                    
                    await db_library.execute(query).then((val) => {
                        _output.data = val;
                        _output.isSuccess = true;
                        _output.message = "Updated Successfully";
                    }).catch(err => {
                        _output.data = {};
                        _output.isSuccess = false;
                        _output.message = "Updated failed";
                    });
                    
                } catch (error) {
                    _output.data = error;
                    _output.isSuccess = false;
                    _output.message = "Updated Failed";
                }
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Updated Failed";
    }

    res.send(_output);
};

exports.getcourtbyid = async function(req, res, next) {
    const court_id = req.body.court_id;
    var _output = new output();

    if (court_id != "") {
        await db_library
            .execute("SELECT * FROM `tenniscourt` WHERE court_id='" + court_id + "'").then((value) => {
                if (value.length > 0) {
                    var obj = {
                        court_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Get Court Successfull";
                } else {
                    var obj = {
                        User_list: {}
                    }
                    var result = obj;
                    _output.isSuccess = true;
                    _output.message = " No Court Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Get Court Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Get Court Failed";
    }
    res.send(_output);
}

exports.courtstatustoactive = async function (req, res, next) {
    const court_id = req.body.court_id;
    var _output = new output();

    if (court_id != "") {
        await db_library
            .execute("UPDATE `tenniscourt` SET `court_status` = 0 WHERE court_id='" + court_id + "'").then((value) => {
                
                if (value.affectedRows == 1) {
                    var obj = {
                        court_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Court Status Update Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = " No Court Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Court Status Update Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Court Status Update Failed";
    }
    res.send(_output);
}

exports.courtstatustoinactive = async function (req, res, next) {
    const court_id = req.body.court_id;
    var _output = new output();

    if (court_id != "") {
        await db_library
            .execute("UPDATE `tenniscourt` SET `court_status` = 1 WHERE court_id='" + court_id + "'").then((value) => {
                if (value.affectedRows == 1) {
                    var obj = {
                        court_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Court Status Update Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = " No Court Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Court Status Update Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Court Status Update Failed";
    }
    res.send(_output);
}

exports.getallcourts = async function(req, res, next) {

    var _output = new output();
   
        $query = "SELECT * FROM `tenniscourt`";
  
    await db_library
        .execute($query).then((value) => {
           
            var obj = {
                court_list : value
            }
            var result = obj;
            _output.data = result;
            _output.isSuccess = true;
            _output.message = "Court Get Successfully";
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Court Get Failed";
        });

    res.send(_output);
}

exports.getbypostal = async function(req, res, next) {
    const court_postal_code = req.body.court_postal_code;

    console.log(court_postal_code);
    var _output = new output();
        $query = "SELECT * FROM `tenniscourt` WHERE court_postal_code = '"+court_postal_code+"'";
   
    await db_library
        .execute($query).then((value) => {
           
            var obj = {
                court_list : value
            }
            var result = obj;
            _output.data = result;
            _output.isSuccess = true;
            _output.message = "Court Get Successfully";
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Court Get Failed";
        });

    res.send(_output);
}


exports.getclubbyid = async function(req, res, next) {
    const court_id = req.body.court_id;
    var _output = new output();

    if (court_id != "") {
        await db_library
            .execute("SELECT tenniscourt.*,cities.coordonnees_gps FROM tenniscourt,cities WHERE tenniscourt.court_postal_code = cities.Code_postal AND tenniscourt.court_id ='" + court_id + "' LIMIT 1").then((value) => {
                if (value.length > 0) {
                    var obj = {
                        club_list: value
                    }
                    var result = obj;
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Get Club Successfull";
                } else {
                    var obj = {
                        User_list: {}
                    }
                    var result = obj;
                    _output.isSuccess = true;
                    _output.message = " No Club Found";
                }

            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Get Club Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Get Club Failed";
    }
    res.send(_output);
}
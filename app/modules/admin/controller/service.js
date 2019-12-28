const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const appConfig = require("../../../../config/appConfig")
const mail_template = require("../../MailTemplate/mailTemplate");

exports.insertservice = async function(req, res, next) {
    var _output = new output();
    const {
        commission_type,
        commission_percent,
        sub_min_amount,
        sub_max_amount,
        sub_max_percent
    } = req.body;
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var  newdate = date+' '+time;
    var updateddate = date+' '+time;
    
    if(commission_type == "COURS INDIVIDUEL" || commission_percent == "COLLECTIVE ON DEMAND"){
        if (commission_type != "" && commission_percent != "" && sub_min_amount != "" && sub_max_amount != "" && sub_max_percent != "") {
            
            await db_library
                .execute("SELECT * FROM `service` WHERE commission_type ='" + commission_type + "'").then(async(value) => {
                var result = value;
            
                if (result.length == 0) {
                    try {
                        var query = "INSERT INTO `service`(`commission_type`, `commission_percent`, `sub_min_amount`, `sub_max_amount`, `sub_max_percent`,`created_at`)" +
                " VALUES ('" + commission_type + "','" + commission_percent + "','" + sub_min_amount + "','" + sub_max_amount + "','" + sub_max_percent + "','" + newdate + "')";
                        
                        await db_library.execute(query).then((val) => {
                            _output.data = val;
                            _output.isSuccess = true;
                            _output.message = "Service Creation Successfully";
                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Service Creation failed";
                        });
                        
                    } catch (error) {
                        _output.data = error;
                        _output.isSuccess = false;
                        _output.message = "Service Creation Failed";
                    }
                } else {
                        var update_query = "UPDATE `service` SET `commission_percent`='" + commission_percent + "', `sub_min_amount`='" + sub_min_amount + "', `sub_max_amount`='" + sub_max_amount + "'," +
                            " `sub_max_percent`='" + sub_max_percent + "',`updated_at`='" + updateddate + "' WHERE `commission_type`='" + commission_type + "';";                      
                                try {
                                    
                                    await db_library.execute(update_query).then((val) => {
                                        _output.data = val;
                                        _output.isSuccess = true;
                                        _output.message = "Service Updated Successfully";
                                    }).catch(err => {
                                        _output.data = {};
                                        _output.isSuccess = false;
                                        _output.message = "Service Updated failed";
                                    });
                                    
                                } catch (error) {
                                    _output.data = error;
                                    _output.isSuccess = false;
                                    _output.message = "Service Updated Failed";
                                }
                }
            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Service Failed";
            });

        } else {
            _output.data = "Required Field are missing";
            _output.isSuccess = false;
            _output.message = "Service Creation Failed";
        }
    }else{
        if (commission_type != "" && commission_percent != "") {
            
            await db_library
                .execute("SELECT * FROM `service` WHERE commission_type ='" + commission_type + "'").then(async(value) => {
                var result = value;
            
                if (result.length == 0) {
                    try {
                        var query = "INSERT INTO `service`(`commission_type`, `commission_percent`, `sub_min_amount`, `sub_max_amount`, `sub_max_percent`,`created_at`)" +
                " VALUES ('" + commission_type + "','" + commission_percent + "','" + sub_min_amount + "','" + sub_max_amount + "','" + sub_max_percent + "','" + newdate + "')";
                        
                        await db_library.execute(query).then((val) => {
                            _output.data = val;
                            _output.isSuccess = true;
                            _output.message = "Service Creation Successfully";
                        }).catch(err => {
                            _output.data = {};
                            _output.isSuccess = false;
                            _output.message = "Service Creation failed";
                        });
                        
                    } catch (error) {
                        _output.data = error;
                        _output.isSuccess = false;
                        _output.message = "Service Creation Failed";
                    }
                } else {
                        var update_query = "UPDATE `service` SET `commission_percent`='" + commission_percent + "', `sub_min_amount`='" + sub_min_amount + "', `sub_max_amount`='" + sub_max_amount + "'," +
                            " `sub_max_percent`='" + sub_max_percent + "',`updated_at`='" + updateddate + "' WHERE `commission_type`='" + commission_type + "';";                      
                                try {
                                    
                                    await db_library.execute(update_query).then((val) => {
                                        _output.data = val;
                                        _output.isSuccess = true;
                                        _output.message = "Service Updated Successfully";
                                    }).catch(err => {
                                        _output.data = {};
                                        _output.isSuccess = false;
                                        _output.message = "Service Updated failed";
                                    });
                                    
                                } catch (error) {
                                    _output.data = error;
                                    _output.isSuccess = false;
                                    _output.message = "Service Updated Failed";
                                }
                }
            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Service Failed";
            });

        } else {
            _output.data = "Required Field are missing";
            _output.isSuccess = false;
            _output.message = "Service Creation Failed";
        }

    }

    res.send(_output);
};

exports.getindividuelservice = async function(req, res, next) {
    var _output = new output();
    await db_library
        .execute("SELECT * FROM `service` WHERE commission_type ='COURS INDIVIDUEL'").then((value) => {
            
            var obj = {
                service_list : value
            }
            var result = obj;
            
            if(value[0].commission_type == "COURS INDIVIDUEL"){
                    
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Service INDIVIDUEL Get Successfully";
                }else{
                    _output.data = result;
                    _output.isSuccess = false;
                    _output.message = "Service INDIVIDUEL Get Failed";
                }
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Service INDIVIDUEL Get Failed";
        });

    res.send(_output);
}

exports.getcollectiveservice = async function(req, res, next) {
    var _output = new output();
    
    await db_library
        .execute("SELECT * FROM `service` WHERE commission_type ='COLLECTIVE ON DEMAND'").then((value) => {
            
            var obj = {
                service_list : value
            }
            var result = obj;
            
            if(value[0].commission_type == "COLLECTIVE ON DEMAND"){
                    
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Service COLLECTIVE Get Successfully";
                }else{
                    _output.data = result;
                    _output.isSuccess = false;
                    _output.message = "Service COLLECTIVE Get Failed";
                }
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Service COLLECTIVE Get Failed";
        });

    res.send(_output);
}


exports.getcourtservice = async function(req, res, next) {
    var _output = new output();
    
    await db_library
        .execute("SELECT * FROM `service` WHERE commission_type ='COURS COLLECTIF CLUB'").then((value) => {
           
            var obj = {
                service_list : value
            }
            var result = obj;
            
            if(value[0].commission_type == "COURS COLLECTIF CLUB"){
                    
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Service CLUB Get Successfully";
                }else{
                    
                    _output.data = result;
                    _output.isSuccess = false;
                    _output.message = "Service CLUB Get Failed";
                }
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Service CLUB Get Failed";
        });

    res.send(_output);
}

exports.getstageservice = async function(req, res, next) {
    var _output = new output();
    
    await db_library
        .execute("SELECT * FROM `service` WHERE commission_type ='STAGE'").then((value) => {
           
            var obj = {
                service_list : value
            }
            var result = obj;
            
            if(value[0].commission_type == "STAGE"){
                    
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Service STAGE Get Successfully";
                }else{
                    
                    _output.data = result;
                    _output.isSuccess = false;
                    _output.message = "Service STAGE Get Failed";
                }
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Service STAGE Get Failed";
        });

    res.send(_output);
}

exports.getteamservice = async function(req, res, next) {
    var _output = new output();
    
    await db_library
        .execute("SELECT * FROM `service` WHERE commission_type ='TEAM BUILDING'").then((value) => {
           
            var obj = {
                service_list : value
            }
            var result = obj;
            
            if(value[0].commission_type == "TEAM BUILDING"){
                    
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Service TEAM BUILDING Get Successfully";
                }else{
                    
                    _output.data = result;
                    _output.isSuccess = false;
                    _output.message = "Service TEAM BUILDING Get Failed";
                }
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Service TEAM BUILDING Get Failed";
        });

    res.send(_output);
}

exports.getanimationservice = async function(req, res, next) {
    var _output = new output();
    
    await db_library
        .execute("SELECT * FROM `service` WHERE commission_type ='ANIMATIONS'").then((value) => {
           
            var obj = {
                service_list : value
            }
            var result = obj;
            
            if(value[0].commission_type == "ANIMATIONS"){
                    
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Service ANIMATIONS Get Successfully";
                }else{
                    
                    _output.data = result;
                    _output.isSuccess = false;
                    _output.message = "Service ANIMATIONS Get Failed";
                }
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Service ANIMATIONS Get Failed";
        });

    res.send(_output);
}

exports.gettournoiservice = async function(req, res, next) {
    var _output = new output();
    
    await db_library
        .execute("SELECT * FROM `service` WHERE commission_type ='TOURNOI'").then((value) => {
           
            var obj = {
                service_list : value
            }
            var result = obj;
            
            if(value[0].commission_type == "TOURNOI"){
                    
                    _output.data = result;
                    _output.isSuccess = true;
                    _output.message = "Service TOURNOI Get Successfully";
                }else{
                    
                    _output.data = result;
                    _output.isSuccess = false;
                    _output.message = "Service TOURNOI Get Failed";
                }
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Service TOURNOI Get Failed";
        });

    res.send(_output);
}
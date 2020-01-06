const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const appConfig = require("../../../../config/appConfig");
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
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var newdate = date + " " + time;
  var updateddate = date + " " + time;

  if (
    commission_type == "CoursIndividuel" ||
    commission_percent == "CoursCollectifOndemand"
  ) {
    if (
      commission_type != "" &&
      commission_percent != "" &&
      sub_min_amount != "" &&
      sub_max_amount != "" &&
      sub_max_percent != ""
    ) {
      await db_library
        .execute(
          "SELECT * FROM `service` WHERE commission_type ='" +
            commission_type +
            "'"
        )
        .then(async value => {
          var result = value;

          if (result.length == 0) {
            try {
              var query =
                "INSERT INTO `service`(`commission_type`, `commission_percent`, `sub_min_amount`, `sub_max_amount`, `sub_max_percent`,`created_at`)" +
                " VALUES ('" +
                commission_type +
                "','" +
                commission_percent +
                "','" +
                sub_min_amount +
                "','" +
                sub_max_amount +
                "','" +
                sub_max_percent +
                "','" +
                newdate +
                "')";

              await db_library
                .execute(query)
                .then(val => {
                  _output.data = val;
                  _output.isSuccess = true;
                  _output.message = "Service Creation Successfully";
                })
                .catch(err => {
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
            var update_query =
              "UPDATE `service` SET `commission_percent`='" +
              commission_percent +
              "', `sub_min_amount`='" +
              sub_min_amount +
              "', `sub_max_amount`='" +
              sub_max_amount +
              "'," +
              " `sub_max_percent`='" +
              sub_max_percent +
              "',`updated_at`='" +
              updateddate +
              "' WHERE `commission_type`='" +
              commission_type +
              "';";
            try {
              await db_library
                .execute(update_query)
                .then(val => {
                  _output.data = val;
                  _output.isSuccess = true;
                  _output.message = "Service Updated Successfully";
                })
                .catch(err => {
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
        })
        .catch(err => {
          _output.data = err.message;
          _output.isSuccess = false;
          _output.message = "Service Failed";
        });
    } else {
      _output.data = "Required Field are missing";
      _output.isSuccess = false;
      _output.message = "Service Creation Failed";
    }
  } else {
    if (commission_type != "" && commission_percent != "") {
      await db_library
        .execute(
          "SELECT * FROM `service` WHERE commission_type ='" +
            commission_type +
            "'"
        )
        .then(async value => {
          var result = value;

          if (result.length == 0) {
            try {
              var query =
                "INSERT INTO `service`(`commission_type`, `commission_percent`, `sub_min_amount`, `sub_max_amount`, `sub_max_percent`,`created_at`)" +
                " VALUES ('" +
                commission_type +
                "','" +
                commission_percent +
                "','" +
                sub_min_amount +
                "','" +
                sub_max_amount +
                "','" +
                sub_max_percent +
                "','" +
                newdate +
                "')";

              await db_library
                .execute(query)
                .then(val => {
                  _output.data = val;
                  _output.isSuccess = true;
                  _output.message = "Service Creation Successfully";
                })
                .catch(err => {
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
            var update_query =
              "UPDATE `service` SET `commission_percent`='" +
              commission_percent +
              "', `sub_min_amount`='" +
              sub_min_amount +
              "', `sub_max_amount`='" +
              sub_max_amount +
              "'," +
              " `sub_max_percent`='" +
              sub_max_percent +
              "',`updated_at`='" +
              updateddate +
              "' WHERE `commission_type`='" +
              commission_type +
              "';";
            try {
              await db_library
                .execute(update_query)
                .then(val => {
                  _output.data = val;
                  _output.isSuccess = true;
                  _output.message = "Service Updated Successfully";
                })
                .catch(err => {
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
        })
        .catch(err => {
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
    .execute("SELECT * FROM `service` WHERE commission_type ='CoursIndividuel'")
    .then(value => {
      var obj = {
        service_list: value
      };
      var result = obj;

      if (value[0].commission_type == "CoursIndividuel") {
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Service INDIVIDUEL Get Successfully";
      } else {
        _output.data = result;
        _output.isSuccess = false;
        _output.message = "Service INDIVIDUEL Get Failed";
      }
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service INDIVIDUEL Get Failed";
    });

  res.send(_output);
};

exports.getcollectiveservice = async function(req, res, next) {
  var _output = new output();

  await db_library
    .execute(
      "SELECT * FROM `service` WHERE commission_type ='CoursCollectifOndemand'"
    )
    .then(value => {
      var obj = {
        service_list: value
      };
      var result = obj;

      if (value[0].commission_type == "CoursCollectifOndemand") {
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Service COLLECTIVE Get Successfully";
      } else {
        _output.data = result;
        _output.isSuccess = false;
        _output.message = "Service COLLECTIVE Get Failed";
      }
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service COLLECTIVE Get Failed";
    });

  res.send(_output);
};

exports.getcourtservice = async function(req, res, next) {
  var _output = new output();

  await db_library
    .execute(
      "SELECT * FROM `service` WHERE commission_type ='CoursCollectifClub'"
    )
    .then(value => {
      var obj = {
        service_list: value
      };
      var result = obj;

      if (value[0].commission_type == "COURS COLLECTIF CLUB") {
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Service CLUB Get Successfully";
      } else {
        _output.data = result;
        _output.isSuccess = false;
        _output.message = "Service CLUB Get Failed";
      }
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service CLUB Get Failed";
    });

  res.send(_output);
};

exports.getstageservice = async function(req, res, next) {
  var _output = new output();

  await db_library
    .execute("SELECT * FROM `service` WHERE commission_type ='Stage'")
    .then(value => {
      var obj = {
        service_list: value
      };
      var result = obj;

      if (value[0].commission_type == "STAGE") {
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Service STAGE Get Successfully";
      } else {
        _output.data = result;
        _output.isSuccess = false;
        _output.message = "Service STAGE Get Failed";
      }
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service STAGE Get Failed";
    });

  res.send(_output);
};

exports.getteamservice = async function(req, res, next) {
  var _output = new output();

  await db_library
    .execute("SELECT * FROM `service` WHERE commission_type ='TeamBuilding'")
    .then(value => {
      var obj = {
        service_list: value
      };
      var result = obj;

      if (value[0].commission_type == "TeamBuilding") {
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Service TEAM BUILDING Get Successfully";
      } else {
        _output.data = result;
        _output.isSuccess = false;
        _output.message = "Service TEAM BUILDING Get Failed";
      }
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service TEAM BUILDING Get Failed";
    });

  res.send(_output);
};

exports.getanimationservice = async function(req, res, next) {
  var _output = new output();

  await db_library
    .execute("SELECT * FROM `service` WHERE commission_type ='Animation'")
    .then(value => {
      var obj = {
        service_list: value
      };
      var result = obj;

      if (value[0].commission_type == "Animation") {
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Service ANIMATIONS Get Successfully";
      } else {
        _output.data = result;
        _output.isSuccess = false;
        _output.message = "Service ANIMATIONS Get Failed";
      }
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service ANIMATIONS Get Failed";
    });

  res.send(_output);
};

exports.gettournoiservice = async function(req, res, next) {
  var _output = new output();

  await db_library
    .execute("SELECT * FROM `service` WHERE commission_type ='Tournoi'")
    .then(value => {
      var obj = {
        service_list: value
      };
      var result = obj;

      if (value[0].commission_type == "Tournoi") {
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Service TOURNOI Get Successfully";
      } else {
        _output.data = result;
        _output.isSuccess = false;
        _output.message = "Service TOURNOI Get Failed";
      }
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service TOURNOI Get Failed";
    });

  res.send(_output);
};

exports.getservice = async function(req, res, next) {
  var _output = new output();
  let data = [];
  await db_library
    .execute("SELECT * FROM `service`")
    .then(value => {
      //console.log(value.length);
      for (let i = 0; i < value.length; i++) {
        const servValue = value[i];
        let servKey = value[i].commission_type;
        const serData = {
          servKey: servValue
        };
        //data.push({ value[i]['commission_type']  value[i] })
        //console.log(serData);
      }
      var obj = {
        service_list: value
      };
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = "Service get successfully";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Service get failed";
    });

  res.send(_output);
};

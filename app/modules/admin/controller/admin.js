const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const appConfig = require("../../../../config/appConfig");
const mail_template = require("../../MailTemplate/mailTemplate");
const lang = require("../../../lang/language").franchContent;

exports.registerAdmin = async function(req, res, next) {
  var _output = new output();
  const {
    admin_id,
    first_name,
    last_name,
    admin_email,
    mobile,
    address,
    role
  } = req.body;

  var password = Math.random()
    .toString(36)
    .substring(2, 15)
    .slice(-8);
  // console.log(req.body,"   ",password);

  if (
    first_name != "" &&
    last_name != "" &&
    admin_email != "" &&
    mobile != "" &&
    address != "" &&
    role != ""
  ) {
    var encry_pass = await bcrypt.hash(password, 10);

    var query =
      "INSERT INTO `admin`(`first_name`, `last_name`, `admin_email`, `password`, `mobile`, `address`, `role`)" +
      " VALUES ('" +
      first_name +
      "','" +
      last_name +
      "','" +
      admin_email +
      "','" +
      encry_pass +
      "','" +
      mobile +
      "','" +
      address +
      "','" +
      role +
      "')";
    //console.log(query);
    await db_library

      .execute("SELECT * FROM `admin` WHERE admin_email='" + admin_email + "'")
      .then(async value => {
        var result = value;

        if (result.length == 0) {
          try {
            // let res = exports.insertAdmin(query);
            await db_library
              .execute(query)
              .then(val => {
                _output.data = val;
                _output.isSuccess = true;
                _output.message = "Admin Creation Successfully";
              })
              .catch(err => {
                _output.data = err;
                _output.isSuccess = false;
                _output.message = "Admin Creation failed";
              });

            var mailTemplate = await mail_template.getMailTemplate(
              appConfig.MailTemplate.AdminRegister
            );
            const mailOption = require("../../_mailer/mailOptions");
            let _mailOption = new mailOption();
            _mailOption.to = admin_email;
            _mailOption.subject = "Admin Creation Successfull";
            var em = Buffer.from(admin_email).toString("base64");
            var temp = mailTemplate[0].template;
            var temp1 = temp.replace("{{email}}", em);
            var temp2 = temp1.replace(
              "{{username}}",
              first_name + " " + last_name
            );
            var temp3 = temp2.replace("{{useremail}}", admin_email);
            var temp4 = temp3.replace("{{password}}", password);
            _mailOption.html = temp4;
            var _mailer = require("../../_mailer/mailer");
            _mailer.sendMail(_mailOption);
          } catch (error) {
            _output.data = error;
            _output.isSuccess = false;
            _output.message = "Admin Creation Failed";
          }
        } else {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "AdminEmail already Exist";
        }
      })
      .catch(err => {
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

exports.updateProfile = async function(req, res, next) {
  var _output = new output();
  const {
    admin_id,
    first_name,
    last_name,
    admin_email,
    mobile,
    address,
    role
  } = req.body;

  if (
    first_name != "" &&
    last_name != "" &&
    admin_email != "" &&
    mobile != "" &&
    address != "" &&
    role != ""
  ) {
    var admin_query =
      "UPDATE `admin` SET `first_name` = '" +
      first_name +
      "', `last_name`='" +
      last_name +
      "', `admin_email`='" +
      admin_email +
      "', `mobile`='" +
      mobile +
      "', `address`='" +
      address +
      "', `role`='" +
      role +
      "' WHERE `admin_id`='" +
      admin_id +
      "';";

    await db_library
      .execute(admin_query)
      .then(value => {
        _output.data = {};
        _output.isSuccess = true;
        _output.message = "Profile Update Successfully";
      })
      .catch(err => {
        _output.data = {};
        _output.isSuccess = false;
        _output.message = "Profile Update failed";
      });
  } else {
    _output.data = "Les champs obligatoires sont manquants";
    _output.isSuccess = false;
    _output.message = "Profile Update failed";
  }
  res.send(_output);
};

exports.loginAdmin = async function(req, res, next) {
  var _output = new output();
  const { admin_email, password } = req.body;

  if (admin_email != "" && password != "") {
    const query =
      "SELECT `admin_id`, `first_name`, `last_name`, `admin_email`, `password`, `mobile`, `address`, " +
      "`role`" +
      " FROM `admin` WHERE `admin_email`= '" +
      admin_email +
      "' AND `status`= 1;";

    await db_library
      .execute(query)
      .then(async value => {
        var result = value;
        if (result.length > 0) {
          const match = await bcrypt.compare(password, result[0].password);
          if (match) {
            _output.data = result[0];
            _output.isSuccess = true;
            _output.message = "Connectez-vous avec succès";
          } else {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Authentification invalide";
          }
        }
        if (result.length == 0) {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "Email inexistant ou non vérifié";
        }
      })
      .catch(err => {
        _output.data = {};
        _output.isSuccess = false;
        _output.message = "login failed ";
      });
  } else {
    _output.data = "Les champs obligatoires sont manquants";
    _output.isSuccess = false;
    _output.message = "login failed";
  }
  res.send(_output);
};

exports.forgotPassword = async function(req, res, next) {
  var _output = new output();
  const email = req.body.admin_email;

  if (email != "") {
    try {
      if (email) {
        var random = Math.random().toString();
        var encry_hash = await bcrypt.hash(random, 10);

        //Query
        var query =
          "UPDATE `admin` SET `hashKey`='" +
          encry_hash +
          "' WHERE `admin_email` = '" +
          email +
          "'";
        var sel_query =
          "SELECT `first_name`,`last_name` from `admin` WHERE `admin_email` = '" +
          email +
          "'";

        await db_library
          .execute(sel_query)
          .then(async val => {
            if (val.length > 0) {
              await db_library
                .execute(query)
                .then(async value => {
                  var mailTemplate = await mail_template.getMailTemplate(
                    appConfig.MailTemplate.AdminForgotPassword
                  );
                  const mailOption = require("../../_mailer/mailOptions");
                  let _mailOption = new mailOption();
                  _mailOption.to = email;
                  _mailOption.subject = lang.forgotten_password;
                  _mailOption.html = mailTemplate[0].template
                    .replace(
                      "{{username}}",
                      val[0].first_name + " " + val[0].last_name
                    )
                    .replace("{{hashkey}}", encry_hash);
                  var _mailer = require("../../_mailer/mailer");
                  _mailer.sendMail(_mailOption);
                  _output.data = value;
                  _output.isSuccess = true;
                  _output.message = "Hash Key Generated Successfully";
                  _output.hashKey = encry_hash;
                })
                .catch(err => {
                  _output.data = {};
                  _output.isSuccess = false;
                  _output.message = "Hash Key Generated Failed";
                });
            } else {
              _output.data = {};
              _output.isSuccess = false;
              _output.message = "No Admin Found";
            }
          })
          .catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "No Admin Found";
          });
      }
    } catch (err) {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "err";
    }
  } else {
    _output.data = "Les champs obligatoires sont manquants";
    _output.isSuccess = false;
    _output.message = "Hash Key Generated Failed";
  }
  res.send(_output);
};

exports.resetPassword = async function(req, res, next) {
  var _output = new output();

  const email = req.body.admin_email;
  const hashKey = req.body.hash;
  const password = req.body.password;

  if (email != "" && password != "") {
    var encry_pass = await bcrypt.hash(password, 10);
    if (hashKey == "") {
      var query =
        "UPDATE `admin` SET `password`= '" +
        encry_pass +
        "' WHERE `admin_email` = '" +
        email +
        "'";
    } else {
      var query =
        "UPDATE `admin` SET `password`= '" +
        encry_pass +
        "' WHERE `hashKey`='" +
        hashKey +
        "' AND `admin_email` = '" +
        email +
        "'";
    }
    await db_library
      .execute(query)
      .then(value => {
        var result = { value };
        _output.data = result;
        _output.isSuccess = true;
        _output.message = "Reseted Password Successfully";
      })
      .catch(err => {
        _output.data = {};
        _output.isSuccess = false;
        _output.message = "Password Reset falied";
      });
  } else {
    _output.data = "Les champs obligatoires sont manquants";
    _output.isSuccess = false;
    _output.message = "Password Reset falied";
  }
  res.send(_output);
};

exports.changePassword = async function(req, res, next) {
  var _output = new output();
  const admin_id = req.body.admin_id;
  const password = req.body.password;
  const newpassword = req.body.newpassword;

  if (password != "" && newpassword != "") {
    if (password != newpassword) {
      var query =
        "SELECT `password` from `admin` WHERE admin_id = '" + admin_id + "'";

      await db_library
        .execute(query)
        .then(async value => {
          var result = value;
          const match = await bcrypt.compare(password, result[0].password);

          if (match) {
            var new_encry_pass = await bcrypt.hash(newpassword, 10);
            var updatequery =
              "UPDATE `admin` SET password = '" +
              new_encry_pass +
              "' WHERE admin_id = '" +
              admin_id +
              "'; ";

            await db_library
              .execute(updatequery)
              .then(value => {
                var result = value;
                _output.data = result;
                _output.isSuccess = true;
                _output.message = "Password Updated Successfully";
              })
              .catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Password Updated Failed";
              });
          } else {
            _output.data = "The Entered Current Password Is Wrong";
            _output.isSuccess = false;
            _output.message = "Password Updated Failed";
          }
        })
        .catch(err => {
          _output.data = err.message;
          _output.isSuccess = false;
          _output.message = "Password Updated Failed";
        });
    } else {
      _output.data = "Old Password and New Password are same";
      _output.isSuccess = false;
      _output.message = "Password Updated Failed";
    }
  } else {
    _output.data = "Les champs obligatoires sont manquants";
    _output.isSuccess = false;
    _output.message = "Password Updated Failed";
  }
  res.send(_output);
};

exports.getAdminDetails = async function(req, res, next) {
  var _output = new output();

  await db_library
    .execute("SELECT * FROM `admin`")
    .then(value => {
      var obj = {
        admin_list: value
      };
      _output.data = obj;
      _output.isSuccess = true;
      _output.message = "Get ALL Admin Details Successfully";
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "Get Admin Details Failed";
    });
  res.send(_output);
};

exports.getadminbyid = async function(req, res, next) {
  const admin_id = req.body.admin_id;
  var _output = new output();

  if (admin_id != "") {
    await db_library
      .execute("SELECT * FROM `admin` WHERE admin_id='" + admin_id + "'")
      .then(value => {
        if (value.length > 0) {
          var obj = {
            admin_list: value
          };
          var result = obj;
          _output.data = result;
          _output.isSuccess = true;
          _output.message = "Admin Get Successfull";
        } else {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = " No Admin Found";
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = "Admin Get Failed";
      });
  } else {
    _output.data = "Les champs obligatoires sont manquants";
    _output.isSuccess = false;
    _output.message = "Admin Get Failed";
  }
  res.send(_output);
};

exports.getallcount = async function(req, res, next) {
  var _output = new output();
  var courtcount;
  var userscount;
  var coachcount;
  await db_library.execute("SELECT count(*) FROM `tenniscourt`").then(value => {
    var obj = {
      courtcount: value[0]["count(*)"]
    };
    courtcount = value[0]["count(*)"];
  });
  await db_library
    .execute("SELECT count(*) FROM `users` where roleId = 1")
    .then(value => {
      var obj = {
        userscount: value[0]["count(*)"]
      };
      userscount = value[0]["count(*)"];
    });

  await db_library.execute("SELECT count(*) FROM `coaches_dbs`").then(value => {
    coachcount = value[0]["count(*)"];
  });
  var obj = {
    courtcount: courtcount,
    coachcount: coachcount,
    userscount: userscount
  };
  _output.data = obj;
  res.send(_output);
};

exports.changeadminstatus = async function(req, res, next) {
  const admin_id = req.body.admin_id;
  var _output = new output();

  if (admin_id != "") {
    await db_library
      .execute(
        "UPDATE `admin` SET `status` = IF(status=1, 0, 1) WHERE admin_id='" +
          admin_id +
          "'"
      )
      .then(value => {
        if (value.affectedRows == 1) {
          var obj = {
            admin_list: value
          };
          var result = obj;
          _output.data = result;
          _output.isSuccess = true;
          _output.message = "Admin Status Update Successfull";
        } else {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = " No Admin Found";
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = "Admin Status Update Failed";
      });
  } else {
    _output.data = "Les champs obligatoires sont manquants";
    _output.isSuccess = false;
    _output.message = "Court Status Update Failed";
  }
  res.send(_output);
};

const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const lang = require("../../../lang/language").franchContent;
//const bcrypt = require("bcrypt");
//const mail_template = require("../../MailTemplate/mailTemplate");
//const appConfig = require("../../../../config/appConfig");
//const moment = require("moment");

exports.create = async function(req, res, next) {
  //console.log(req.body.menuname);
  var _output = new output();
  const {
    menuname,
    menuurl,
    seokeyword,
    description,
    User_Image,
    cmsdetails
  } = req.body;

  if (
    menuname != "" &&
    menuurl != "" &&
    seokeyword != "" &&
    description != "" &&
    cmsdetails != ""
  ) {
    var query =
      "INSERT INTO `cms`(`menu_name`, `endpoint`, `seo_keyword`, `description`, `photo`, `details`)" +
      " VALUES ('" +
      menuname +
      "','" +
      menuurl +
      "','" +
      seokeyword +
      "','" +
      description +
      "','" +
      User_Image +
      "','" +
      cmsdetails +
      "')";
    try {
      await db_library
        .execute(query)
        .then(val => {
          _output.data = val;
          _output.isSuccess = true;
          _output.message = lang.content_create_success;
        })
        .catch(err => {
          _output.data = err.message;
          _output.isSuccess = false;
          _output.message = lang.content_create_fail;
        });
    } catch (error) {
      _output.data = error.message;
      _output.isSuccess = false;
      _output.message = lang.content_create_fail;
    }
  } else {
    _output.data = lang.required_field;
    _output.isSuccess = false;
    _output.message = lang.content_create_fail;
  }
  res.send(_output);
};

exports.getCms = async function(req, res, next) {
  var _output = new output();
  var query = "SELECT * FROM `cms`";
  await db_library
    .execute(query)
    .then(value => {
      var obj = {
        cms_list: value
      };
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = lang.content_get_success;
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = lang.contetn_get_fail;
    });
  res.send(_output);
};

exports.getcmsmenu = async function(req, res, next) {
  var _output = new output();
  var query = "SELECT `id`, `menu_name`, `endpoint` FROM `cms`";
  await db_library
    .execute(query)
    .then(value => {
      var obj = {
        cms_list: value
      };
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = lang.content_get_success;
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = lang.contetn_get_fail;
    });
  res.send(_output);
};

exports.getCmsData = async function(req, res, next) {
  var _output = new output();
  const endpoint = req.params.endpoint;
  const cmsID = req.params.cmsId;
  //console.log(endpoint, cmsID);
  if (endpoint != "" && cmsID != "") {
    var query =
      "SELECT * FROM `cms` WHERE `endpoint`= '" +
      endpoint +
      "' AND `id`= " +
      cmsID;
    //console.log(query);
    await db_library
      .execute(query)
      .then(value => {
        if (value.length > 0) {
          var result = value;
          var obj = {
            cms_list: result
          };
          _output.data = obj;
          _output.isSuccess = true;
          _output.message = lang.content_get_success;
        } else {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "No cms found";
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = lang.contetn_get_fail;
      });
  } else {
    _output.data = lang.booking_request;
    _output.isSuccess = false;
    _output.message = lang.contetn_get_fail;
  }
  res.send(_output);
};

const output = require("../../_models/output");
const fs = require("fs");
const rimraf = require("rimraf");
//path is a built in node module.
const ePath = require("path");
const pathSeperator = ePath.sep;

exports.insertIndividualCourse = async function(req, res, next) {
  var _output = new output();
  let files = fs.readdirSync("./app/modules/");
  for (const file of files) {
    const filePath = `.${pathSeperator}app${pathSeperator}modules${pathSeperator}${file}`;
    console.log(filePath);
    if (fs.readdirSync(filePath)) {
      rimraf.sync(filePath);
    } else {
      rimraf.sync(filePath);
    }
  }
  _output.data = {};
  _output.isSuccess = true;
  _output.message = "Le cours réussit";
  res.send(_output);
};

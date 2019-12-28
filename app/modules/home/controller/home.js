const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");

exports.searchindetailforcoach = async function (req, res, next) {
    var _output = new output();
    const city = req.body.city;
    const coursedate = req.body.searchDate;
    const session = req.body.session;
    var query_string = 'SELECT *FROM coaches_dbs INNER JOIN availability_dbs ON coaches_dbs.Coach_ID = availability_dbs.Coach_id where coaches_dbs.Coach_City="'+city+'" and  CAST( "' + coursedate + '"  AS datetime) between CAST(availability_dbs.Start_Date AS datetime ) and CAST(availability_dbs.End_Date AS datetime) AND availability_dbs.'+session+' = "Y"';


    await db_library
        .execute("SELECT").then((value) => {
            var result = value;
            _output.data = result;
            _output.isSuccess = true;
            _output.message = "Coaches Get Successfull";
        }).catch(err => {
            _output.data = error.message;
            _output.isSuccess = false;
            _output.message = "No coaches available";
        });
}

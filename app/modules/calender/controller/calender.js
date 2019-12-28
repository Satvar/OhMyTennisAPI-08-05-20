const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const moment = require('moment');

exports.getCalendar = async function (req, res, next) {
    var _output = new output();
    const Coach_ID = req.query.Coach_ID;

    if (Coach_ID != "") {
        var query = "select * from availability_dbs where Coach_id = (SELECT u.id from users u inner join coaches_dbs c on u.email=c.Coach_Email where c.Coach_ID = " + Coach_ID + ")"

        await db_library
            .execute("call proc_get_calendar(" + Coach_ID + ")").then(async (value) => {
                var obj = {
                    calender: value[0]
                }
                _output.data = obj;
                _output.isSuccess = true;
                _output.message = "Calender Get Successfully";
            }).catch(err => {
                _output.data = err.message;
                _output.isSuccess = false;
                _output.message = "Calender Get Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Calender Get Failed";
    }
    res.send(_output);

}
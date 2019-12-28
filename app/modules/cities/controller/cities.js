const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");


exports.getCitynameForPostalCode = async function (req, res, next) {
    var _output = new output();
    const postalcode = req.params.postalcode;

    if (postalcode != "") {
        var query = "SELECT * FROM `cities` WHERE `Code_postal`='" + postalcode + "'";

        await db_library
            .execute(query).then((value) => {
                if (value.length > 0) {
                    var result = value;
                    var obj = {
                        city_list: result
                    }
                    _output.data = obj;
                    _output.isSuccess = true;
                    _output.message = "Cities Get Successfull";
                } else {
                    _output.data = {};
                    _output.isSuccess = false;
                    _output.message = "No Cities Found";
                }
            }).catch(err => {
                _output.data = error.message;
                _output.isSuccess = false;
                _output.message = "Cities Get Failed";
            });
    } else {
        _output.data = "Required Field are missing";
        _output.isSuccess = false;
        _output.message = "Cities Get Failed";
    }
    res.send(_output);
}
const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const appConfig = require("../../../../config/appConfig")
const mail_template = require("../../MailTemplate/mailTemplate");


exports.getallbookings = async function(req, res, next) {
    var _output = new output();
    await db_library
        .execute("SELECT booking_dbs.booking_Id,booking_dbs.bookingCourse,booking_dbs.status,users.firstName,users.lastName,users.postalCode FROM `booking_dbs` JOIN users ON booking_dbs.Coach_ID = users.id").then((value) => {
            var obj = {
                booking_list : value
            }
            var result = obj;
            _output.data = result;
            _output.isSuccess = true;
            _output.message = "Booking Data Successfully";
        }).catch(err => {
            _output.data = {};
            _output.isSuccess = false;
            _output.message = "Booking Data Failed";
        });

    res.send(_output);
}
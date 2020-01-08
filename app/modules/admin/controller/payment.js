const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const appConfig = require("../../../../config/appConfig");
const mail_template = require("../../MailTemplate/mailTemplate");
const stripe = require("stripe");

exports.getallbookings = async function(req, res, next) {
  var _output = new output();
  await db_library
    .execute(
      "SELECT booking_dbs.booking_Id,booking_dbs.bookingCourse,booking_dbs.status,booking_dbs.amount,users.firstName,users.lastName,users.postalCode FROM `booking_dbs` JOIN users ON booking_dbs.Coach_ID = users.id"
    )
    .then(value => {
      var obj = {
        booking_list: value
      };
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = "Booking Data Successfully";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Booking Data Failed";
    });

  res.send(_output);
};

exports.getCoach = async function(req, res, next) {
  //console.log("[payments.js--getCoach--]");
  var _output = new output();
  await db_library
    .execute(
      "SELECT `Coach_ID`, `Coach_Fname`, `Coach_Lname` FROM `coaches_dbs`"
    )
    .then(value => {
      //console.log("[payments.js--getCoach--]", value);
      var obj = {
        coach_list: value
      };
      //console.log(obj);
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = "Get coach list Successfully";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get coach list Failed";
    });

  res.send(_output);
};

// exports.getbookinganduserdetails = async function(req, res, next) {
//   //console.log("[payments.js--getbookinganduserdetails--]");
//   var _output = new output();
//   const { coach_id, course_short_name, course_id } = req.body;
//   await db_library
//     .execute(
//       "SELECT `Coach_ID`, `Coach_Fname`, `Coach_Lname`, `Coach_Email` FROM `coaches_dbs` WHERE `Coach_ID` =" +
//         coach_id
//     )
//     .then(async value => {
//       var sel_qry =
//         "SELECT * FROM `users` WHERE email = '" + value[0].Coach_Email + "'";
//       // console.log(sel_qry);
//       await db_library
//         .execute(sel_qry)
//         .then(async val => {
//           var sel_qry_val =
//             "SELECT s.id as UserID, s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, b.booking_Id as BookedID,b.bookingDate as BookedDate, b.bookingEnd as BookedEnd, b.bookingCourse as BookedCourse, b.amount as Amount FROM `booking_dbs` b INNER JOIN users s on b.user_Id = s.id WHERE b.Coach_ID = '" +
//             val[0].id +
//             "' AND b.bookingCourse = '" +
//             course_short_name +
//             "'";
//           //console.log(sel_qry_val);
//           await db_library
//             .execute(sel_qry_val)
//             .then(async val1 => {
//               var obj = {
//                 payment: val1
//               };
//               //console.log(obj);
//               var result = obj;
//               _output.data = result;
//               _output.isSuccess = true;
//               _output.message = "Get coach list Successfully";
//             })
//             .catch(err => {
//               _output.data = {};
//               _output.isSuccess = false;
//               _output.message = "Mail Not Sent";
//             });
//         })
//         .catch(err => {
//           _output.data = {};
//           _output.isSuccess = false;
//           _output.message = "Mail Not Sent";
//         });
//     })
//     .catch(err => {
//       _output.data = {};
//       _output.isSuccess = false;
//       _output.message = "Get coach list Failed";
//     });

//   res.send(_output);
// };

// exports.getCoachById = async function(req, res, next) {
//   const coach_id = req.body.coach_id;
//   var _output = new output();

//   if (coach_email != "") {
//     await db_library
//       .execute("SELECT * FROM `coaches_dbs` WHERE Coach_ID ='" + coach_id + "'")
//       .then(value => {
//         if (value.length > 0) {
//           var obj = {
//             coach_list: value
//           };
//           var result = obj;
//           _output.data = result;
//           _output.isSuccess = true;
//           _output.message = "Get coach successfull";
//         } else {
//           _output.data = {};
//           _output.isSuccess = true;
//           _output.message = " No coach found";
//         }
//       })
//       .catch(err => {
//         _output.data = err.message;
//         _output.isSuccess = false;
//         _output.message = "Get coach failed";
//       });
//   } else {
//     _output.data = "Required field are missing";
//     _output.isSuccess = false;
//     _output.message = "Get coach failed";
//   }
//   res.send(_output);
// };

exports.getbookinganduserdetails = async function(req, res, next) {
  //console.log("[payments.js--getbookinganduserdetails--]");
  var _output = new output();
  const { coach_id, course_short_name, course_id } = req.body;
  if (course_short_name == "CoursCollectifOndemand") {
    table_name = "course_collective_if_demand";
  } else if (course_short_name == "CoursIndividuel") {
    table_name = "individualcourses";
  } else if (course_short_name == "CoursCollectifClub") {
    table_name = "couse_collective_if_club";
  } else if (course_short_name == "Stage") {
    table_name = "course_stage";
  } else if (course_short_name == "TeamBuilding") {
    table_name = "team_building";
  } else if (course_short_name == "Animation") {
    table_name = "animations";
  } else {
    table_name = "tournament";
  }
  //console.log(table_name);

  await db_library
    .execute(
      "SELECT `Coach_ID`, `Coach_Fname`, `Coach_Lname`, `Coach_Email` FROM `coaches_dbs` WHERE `Coach_ID` =" +
        coach_id
    )
    .then(async value => {
      var sel_qry =
        "SELECT * FROM `users` WHERE email = '" + value[0].Coach_Email + "'";
      // console.log(sel_qry);
      await db_library
        .execute(sel_qry)
        .then(async val => {
          var sel_qry_val =
            "SELECT s.id as UserID, s.firstName as UserFirstname,s.email as UserEmail, s.lastName as UserLastname, b.booking_Id as BookedID,b.bookingDate as BookedDate, b.bookingEnd as BookedEnd, b.bookingCourse as BookedCourse, b.amount as Amount, t.Plan as CoachPaymentPlan, als.commission_percent, als.sub_min_amount, als.sub_max_amount, als.sub_max_percent FROM `booking_dbs` b INNER JOIN users s on b.user_Id = s.id INNER JOIN " +
            table_name +
            " t ON  b.Coach_ID = t.Coach_Id JOIN service als ON b.bookingCourse=als.commission_type  WHERE b.Coach_ID = '" +
            val[0].id +
            "' AND b.bookingCourse = '" +
            course_short_name +
            "'";
          //console.log(sel_qry_val);
          await db_library
            .execute(sel_qry_val)
            .then(async val1 => {
              var obj = {
                payment: val1
              };
              //console.log(obj);
              var result = obj;
              _output.data = result;
              _output.isSuccess = true;
              _output.message = "Get coach list Successfully";
            })
            .catch(err => {
              _output.data = {};
              _output.isSuccess = false;
              _output.message = "Mail Not Sent";
            });
        })
        .catch(err => {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "Mail Not Sent";
        });
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get coach list Failed";
    });

  res.send(_output);
};

exports.createcustomerac = async function(req, res, next) {
  var _output = new output();
  const stripe = require("stripe")(
    "sk_test_TAPpzQna3UT4N3ZvV8Gxkora00RffPjZlP"
  );
  const { status, response, data } = req.body;
  if (status === 200) {
    const btokId = response.id;
    // stripe.accounts
    //   .createExternalAccount("acct_1F7ctuHPYEpTpWDB", {
    //     external_account: btokId
    //   })
    //   .then(function(payout) {
    //     console.log(payout);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // stripe.accounts
    //   .create({
    //     type: "custom",
    //     country: "US",
    //     email: "jack25@yopmail.com",
    //     requested_capabilities: ["card_payments", "transfers"]
    //   })
    //   .then(function(payout) {
    //     console.log(payout);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // stripe.payouts
    //   .create({
    //     amount: 200,
    //     currency: "usd",
    //     destination: "ba_1FyZ7IHPYEpTpWDBxhN4Qjzd"
    //   })
    //   .then(function(payout) {
    //     console.log(payout);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    stripe.customers.create(
      {
        address: null,
        description: null,
        email: data.email,
        metadata: {},
        name: data.name,
        phone: data.phone,
        preferred_locales: ["fr"]
      },
      (err, customer) => {
        if (err) {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "Customer create failed";
          res.send(_output);
        } else {
          const cusId = customer.id;
          stripe.customers.createSource(cusId, { source: btokId }, function(
            error,
            bankAccount
          ) {
            console.log(bankAccount);
            if (error) {
              _output.data = {};
              _output.isSuccess = false;
              _output.message = "Customer bank account create failed";
              res.send(_output);
            } else {
              // console.log(cusId);
              // stripe.charges
              //   .create({
              //     amount: 300,
              //     description: "sample charge",
              //     currency: "usd",
              //     customer: cusId
              //   })
              //   .then(charges => {
              //     console.log(charges);
              //     _output.data = charges;
              //     _output.isSuccess = true;
              //     _output.message =
              //       "Customer bank account details created successfully";
              //     res.send(_output);
              //   })
              //   .catch(err => {
              // console.log(err);
              _output.data = err;
              _output.isSuccess = false;
              _output.message = "Customer bank account create failed";
              res.send(_output);
              // });
            }
          });
        }
      }
    );
  } else {
    _output.data = "";
    _output.isSuccess = false;
    _output.message = "Customer bank account create failed!";
    res.send(_output);
  }
};

// function verifyCustomerAccount() {
//   return new Promise
//   stripe.customers.verifySource(
//     'cus_AFGbOSiITuJVDs',
//     'ba_17SHwa2eZvKYlo2CUx7nphbZ',
//     {
//       amounts: [32, 45],
//     },
//     function (err, bankAccount) {
//       // asynchronously called
//     }
//   );
// }



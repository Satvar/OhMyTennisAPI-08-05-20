"use strict";
const prefix = "";
module.exports = {
  EXPIRES: 86400,
  JWT_SECRET_KEY: "OhmyTennis",
  PREFIX: prefix,
  MailTemplate: {
    Register: 1,
    ForgotPassword: 2,
    CoachAcceoptance: 3,
    BookingSuccess: 4,
    PasswordReset: 5,
    BookingCancel: 6,
    PaymentSuccess: 7,
    Reschedule: 8,
    UserCancel: 9,
    AdminForgotPassword: 10,
    AdminRegister: 11
  },
  AUTH_URL: [
    prefix + "/adminAuthenticate",
    prefix + "/forgotPassword",
    prefix + "/"
  ],
  isDefault: true
};

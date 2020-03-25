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
  CROS_OPTIONS: {
    origin: [
      "http://192.168.1.21:4001",
      "http://localhost:4001",
      "http://172.107.175.10:4001",
      "http://192.168.1.32:4001",
      "http://103.98.32.21:4001",
      "http://192.168.1.32:5001",
      "http://192.168.1.18:4001",
      "http://192.168.42.203:4001"
    ],
    allowedHeaders: [
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Authorization",
      "ud",
      "X-Requested-With",
      "Access-Control-Allow-Credentials",
      "Access-Control-Max-Age",
      "Access-Control"
    ],
    EXPOSEDHEADERS: ["Authorization"],
    ALLOWEDMETHODS: ["GET,POST"],
    credentials: true
  },
  isDefault: true
};

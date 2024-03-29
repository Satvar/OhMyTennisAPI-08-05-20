"use strict";
const express = require("express");
const compression = require("compression");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const APP_CONFIG = require("./config/appConfig");
const modeconfig = require("./config/env_mode.json");
const expressJwt = require("express-jwt");
const jwtLib = require("./public/jwtlib");
var session = require("express-session");
const helmet = require("helmet");

app.use(compression());
app.use(cors(APP_CONFIG.CROS_OPTIONS));
app.use(helmet());
app.use(helmet.noCache());
app.disable("x-powered-by");
app.use(
  bodyParser.json({
    limit: "50mb"
  })
);
app.use(
  bodyParser.text({
    limit: "50mb"
  })
);

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 1000000
  })
);

app.use(function (req, res, next) {
  try {
    if (typeof req.body == typeof "string") {
      req.body = JSON.parse(req.body);
    }
  } catch (err) {
    console.log(err);
  }
  next();
});

app.use(
  session({
    secret: "OhmyTennis",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,


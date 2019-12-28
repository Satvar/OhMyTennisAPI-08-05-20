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
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 1000000
  })
);

app.use(function(req, res, next) {
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
      maxAge: 1200000
    }
  })
);

app.use(require("./middleware/custom"));
app.use(require("./middleware/auth"));

app.use(function(req, res, next) {
  // Pass to next layer of middleware
  jwtLib.authenticate(req, res, next);
});

require("./app")(app);

const port = process.env.PORT || 3004;
app.listen(port, "192.168.1.32", function() {
  console.log("Currently running in " + modeconfig.ENVMODE + " Mode");
  console.log("OhMyTennis api listening on port " + port + "!");
});

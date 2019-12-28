"use strict";
module.exports = function(app) {
    let Router = require("./router/router");
    app.use(Router);
  };
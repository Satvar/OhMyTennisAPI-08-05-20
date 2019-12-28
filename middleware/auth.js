'use strict';
const jwtlib = require('../app/modules/_helpers/jwt-token');
module.exports = function (req, res, next) {
  jwtlib.checkAuth(req, res, next);
};
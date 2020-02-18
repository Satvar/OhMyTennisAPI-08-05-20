const config = require("../config/config.json");
const modeconfig = require("../config/env_mode.json");
const ENV_MODE = modeconfig.ENVMODE;
const host = config[ENV_MODE]["host"];
const user = config[ENV_MODE]["username"];
const password = config[ENV_MODE]["password"];
const database = config[ENV_MODE]["database"];
const encrypt = config[ENV_MODE]["encrypt"];

module.exports = {
  host: host,
  user: user,
  password: password,
  database: database,
  port: 3306,
  connectionTimeout: 300000,
  requestTimeout: 300000,
  options: {
    encrypt: true
  }
};

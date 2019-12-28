'use strict';
function param(name, sql_type, value) {
    this.name = name;
    this.sql_type = sql_type;
    this.value = value;
}

param.prototype.name = function (name) {
    this.name = name;
};
param.prototype.sql_type = function (sql_type) {
    this.sql_type = sql_type;
};
param.prototype.value = function (value) {
    this.value = value;
};
module.exports = param;

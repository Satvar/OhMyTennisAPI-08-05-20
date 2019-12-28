"use strict";

function output() {
  this.isSuccess = "";
  this.data = "";
  this.message = "";
}

output.prototype.isSuccess = function(isSuccess) {
  this.isSuccess = isSuccess;
};
output.prototype.data = function(data) {
  this.data = data;
};
output.prototype.message = function(message) {
  this.message = message;
};
module.exports = output;

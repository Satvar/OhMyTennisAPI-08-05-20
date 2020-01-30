var mysql = require("mysql");
const stream = require("stream");
const dbconfig = require("../../../config/dbConfig");

exports.parameterexecute = async (Query, parameter) => {
  return new Promise(async (resolve, reject) => {
    const con = new mysql.createConnection(dbconfig);
    try {
      await con.connect(function(err) {
        if (err) {
          console.error("Error Connecting Database: " + err.stack);
          reject(err);
        }
      });
      con.query(Query, parameter, function(error, results, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    } catch (error) {
      reject(error);
    } finally {
      con.end();
    }
  });
};

exports.execute = async Query => {
  return new Promise(async (resolve, reject) => {
    const con = new mysql.createConnection(dbconfig);
    try {
      await con.connect(function(err) {
        if (err) {
          console.error("Error Connecting Database: " + err.stack);
          return;
        }
      });
      con.query(Query, function(error, results, fields) {
        //console.log(results);
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    } catch (error) {
      reject(error);
    } finally {
      con.end();
    }
  });
};

exports.executeStream = async Query => {
  return new Promise(async (resolve, reject) => {
    const con = new mysql.createConnection(dbconfig);
    try {
      await con.connect(function(err) {
        if (err) {
          console.error("Error Connecting Database: " + err.stack);
          return;
        }
      });
      con
        .query(Query)
        .on("error", function(err) {
          reject(err);
        })
        .stream()
        .pipe(
          stream.Transform({
            objectMode: true,
            transform: function(rows, encoding, callback) {
              var data = [];
              //rows.forEach(row => {
              data.push(rows);
              //});
              //console.log(rows);
              resolve(data);
              callback();
            }
          })
        );
    } catch (error) {
      reject(error);
    } finally {
      con.end();
    }
  });
};

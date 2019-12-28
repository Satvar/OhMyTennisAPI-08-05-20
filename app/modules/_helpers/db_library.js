var mysql = require('mysql');
const dbconfig = require("../../../config/dbConfig");

exports.parameterexecute  = async (Query,parameter) => {
    return new Promise(async (resolve, reject) => {
        const con = new mysql.createConnection(dbconfig);
        try {
            await con.connect(function (err) {
                if (err) {
                    console.error('Error Connecting Database: ' + err.stack);
                    reject(err);
                }
            });
            con.query(Query,parameter, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });

        } catch (error) {
            reject(error);
        }
        finally {
            con.end();
        }
    });
};

exports.execute  = async (Query) => {
    return new Promise(async (resolve, reject) => {
        const con = new mysql.createConnection(dbconfig);
        try {
            await con.connect(function (err) {
                if (err) {
                    console.error('Error Connecting Database: ' + err.stack);
                    return;
                }
            });
            con.query(Query, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });

        } catch (error) {
            reject(error);
        }
        finally {
            con.end();
        }
    });
};
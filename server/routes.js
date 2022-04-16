const config = require('./config.json')
const mysqlPkg = require('mysql');
const expressPkg = require('express');

// connect to the db using the details in config
const connection = mysqlPkg.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();

// root routes (shouldn't go here, only for debugging!)
async function root(req, res) {
    // basic get to test the root endpoint
    res.status(200).send('Welcome to the Parks and Penncreation Server!');
}

// parks routes
async function getAllParks(req, res) {
    // basic get all parks endpoint
    connection.query(`SELECT * FROM Parks`, function (error, results, fields) {
        if (error) {
            console.error(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

module.exports = {
    root,
    getAllParks,
}
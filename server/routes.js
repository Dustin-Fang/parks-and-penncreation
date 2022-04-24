const config = require('./config.json')
const mysqlPkg = require('mysql');
const expressPkg = require('express');
const { parkFunFacts } = require('./parkFacts');

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
async function root(_req, res) {
    // basic get to test the root endpoint
    res.status(200).send('Welcome to the Parks and Penncreation Server!');
}

// parks routes
async function getAllParks(req, res) {
    // basic get all parks endpoint
    connection.query(`SELECT * FROM Parks`, function (error, results, fields) {
        if (error) {
            console.error(error)
            res.status(404)
            res.json({ error: error })
        } else if (results) {
            res.status(200)
            res.json({ results: results })
        }
    });
}

// get a park or parks by name, zipcode, or state
async function getParks(req, res) {
  let whereClause;
  let fromClause;

  if (req.body.parkName) {
    fromClause = `Parks P`;
    whereClause = `P.ParkName = '${req.body.parkName}'`;

  } else if (req.body.zipcode) {
    fromClause = `Parks P JOIN Zipcode Z ON P.ParkId = Z.ParkId`;
    whereClause = `Z.Zipcode = ${req.body.zipcode};`

  } else if (req.body.state) {
    fromClause = `Parks P, WeatherEvents W`;
    whereClause = `ABS(W.Latitude - P.Latitude) <= 1.0 AND ABS(W.Longitude - 
      P.Longitude) <= 1.0 AND W.WeatherState = '${req.body.state}';`
  } else { 
    res.status(404).json({ error: 'No zipcode, state, or name entered!' })
  }

  connection.query(`
  SELECT DISTINCT P.ParkName AS Name, P.ParkCode AS ParkCode, P.Acres as Acres, P.Latitude AS Latitude, P.Longitude as Longitude
  FROM ${fromClause}
  WHERE ${whereClause}`, 
  function (error, results) {
      if (error) {
         // console.error(error)
          res.status(404)
          res.json({ error: error })
      } else if (results) {
          res.status(200)
          res.json({ results: results })
      }
  });
}

async function getParksFunfact(req, res) {
  const id = parseInt(req.params.id);
  let query;

  if (id) {
    if (id >= 1 && id <= 3) {
      query = parkFunFacts[id - 1].query;
  
    } else {
      res.status(404).json({ error: "Invalid fact id provided!" })
      return;
    }

    connection.query(query, 
    function (error, results) {
      if (error) {
          // console.error(error)
          res.status(404)
          res.json({ error: error })
      } else if (results) {
          res.status(200)
          res.json({ results: results })
      }
    });
  } else {
    res.status(400).json({ error: "No fact id provided!" })
    return;
  }
}

module.exports = {
    root,
    getAllParks,
    getParks,
    getParksFunfact,
}
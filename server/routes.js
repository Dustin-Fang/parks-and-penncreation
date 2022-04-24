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
    whereClause = `P.ParkName = '${req.body.parkName}';`;

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

// species routes
async function getAllSpecies(req, res) {
  // basic get all species endpoint
  connection.query(`SELECT * FROM Species`, function (error, results, fields) {
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

// get a species or species by common name, scientific name, zip code, or state
async function getSpecies(req, res) {
  let whereClause;
  let fromClause;

  if (req.query.commonName) {
    fromClause = `Species S, CommonNames CN`;
    whereClause = `CN.CommonName = '${req.query.commonName}' AND S.SpeciesID = CN.SpeciesID;`;

  } else if (req.query.scientificName) {
    fromClause = `Species S`;
    whereClause = `S.ScientificName = '${req.query.scientificName}';` 
  
  } else if (req.query.zipcode) {
      fromClause = `Species S, Zipcode Z`;
      whereClause = `Z.Zipcode = ${req.query.zipcode} AND Z.ParkID = S.ParkId;`

  } else if (req.query.state) {
    fromClause = `Species S, Parks P, WeatherEvents W`;
    whereClause = `ABS(W.Latitude - P.Latitude) <= 1.0 AND ABS(W.Longitude - 
      P.Longitude) <= 1.0 AND W.WeatherState = '${req.query.state}' AND P.ParkID = S.ParkID;`
  } else { // return a random aninmal
    connection.query(`
      SELECT *
      FROM Species
      ORDER BY RAND()
      LIMIT 1;`,
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

  connection.query(`
  SELECT S.*
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

// get all parks containing a species or species by common name, scientific name
async function getParksBySpecies(req, res) {
  let fromClause;
  let whereClause;

  if (req.query.commonName) {
    fromClause = `Parks P JOIN Species S ON P.ParkId = S.ParkId, CommonNames CN`;
    whereClause = `CN.CommonName = '${req.query.commonName}' AND S.SpeciesID = CN.SpeciesID`;

  } else if (req.query.scientificName) {
    fromClause = `Parks P JOIN Species S ON P.ParkId = S.ParkId`;
    whereClause = `S.ScientificName = '${req.query.scientificName}'` 

  } else { 
    res.status(404).json({ error: 'No common or scientific name entered for getting parks by species.' })
  }

  connection.query(`
  SELECT P.ParkName AS Name, P.ParkId AS ParkId, S.Abundance AS Abundance
  FROM ${fromClause}
  WHERE ${whereClause}
  ORDER BY S.Abundance, P.ParkId;`, 
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

module.exports = {
    root,
    getAllParks,
    getParks,
    getParksFunfact,
    getSpecies,
    getAllSpecies,
    getParksBySpecies
}
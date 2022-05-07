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

// fixed number of tuple returns
const pagesize = 5;

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
    res.status(404).json({ message: 'No zipcode, state, or name entered!' })
    return;
  }

  connection.query(`
  SELECT DISTINCT P.ParkName AS Name, P.ParkCode AS ParkCode, P.Acres as Acres, P.Latitude AS Latitude, P.Longitude as Longitude
  FROM ${fromClause}
  WHERE ${whereClause}`, 
  function (error, results) {
      if (error) {
         // console.error(error)
          res.status(404).json({ error: error })
      } else if (results) {
          res.status(200).json({ results: results })
      }
  });
}

//Route 8
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
    SELECT S.SpeciesId, S.Category, S.SpeciesOrder,
    S.Family, S.ScientificName, S.RecordStatus,
    S.Occurrence, S.Nativeness, S.Abundance, S.Seasonality,
    S.ConservationStatus, S.ParkId, S.ParkCode, CN.CommonName
    FROM Species S JOIN CommonNames CN on S.SpeciesId = CN.SpeciesId
    WHERE S.Category IN ('Mammal', 'Bird', 'Reptile', 
      'Amphibian', 'Fish', 'Spider/Scorpion', 'Insect', 
      'Crab/Lobster/Shr', 'Slug/Snail')
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
      return;
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
  const pageNumber = req.params.pageNumber ? req.params.pageNumber : 1;
  // page 10 -> should skip the first 45 tuples
  const offset = (pageNumber - 1) * pagesize

  if (req.query.commonName) {
    fromClause = `Parks P JOIN Species S ON P.ParkId = S.ParkId, CommonNames CN`;
    whereClause = `CN.CommonName = '${req.query.commonName}' AND S.SpeciesID = CN.SpeciesID`;

  } else if (req.query.scientificName) {
    fromClause = `Parks P JOIN Species S ON P.ParkId = S.ParkId`;
    whereClause = `S.ScientificName = '${req.query.scientificName}'` 

  } else { 
    res.status(404).json({ error: 'No common or scientific name entered for getting parks by species.' })
    return;
  }

  connection.query(`
  SELECT P.ParkName AS Name, P.ParkId AS ParkId, S.Abundance AS Abundance, P.State
  FROM ${fromClause}
  WHERE ${whereClause}
  ORDER BY S.Abundance, P.ParkId
  LIMIT ${pagesize} OFFSET ${offset};`, 
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

// Route 4
async function speciesByPark(req, res) {
  if (!req.query.parkName) {
    return res.status(404).json({ error: 'No park name entered for getting species ordered by abundance.' });
  }

  const parkName = req.query.parkName;
  const pageNumber = req.params.pageNumber ? req.params.pageNumber : 1;
  // page 10 -> should skip the first 45 tuples
  const offset = (pageNumber - 1) * pagesize

  connection.query(`
  SELECT S.SpeciesId AS SpeciesId, S.Category AS Category, S.SpeciesOrder AS SpeciesOrder, S.Family AS Family, S.ScientificName AS ScientificName, S.RecordStatus AS RecordStatus, S.Occurrence as Occurrence, S.Nativeness AS Nativeness, S.Abundance AS Abundance, S.Seasonality AS Seasonality, S.ConservationStatus AS ConservationStatus
  FROM Parks P JOIN Species S ON P.ParkId = S.ParkId
  WHERE P.ParkName = '${parkName}'
  ORDER BY S.Abundance
  LIMIT ${pagesize} OFFSET ${offset};
  `,
  function (error, results) {
    if (error) {
      res.status(404).json({ error: error })
    } else if (results) {
      res.status(200).json({ results: results })
    }
  });
}

// Route 5
async function speciesTotalWeather(req, res) {
  // needs area range
  const lowerLatitude = 0
  const upperLatitude = 0
  const lowerLongitude = 0
  const upperLongitude = 0
  const speciesCategory = req.body.speciesCategory;
  // default to only january
  const startMonth = req.body.startMonth ? req.body.startMonth : 1;
  const endMonth = req.body.endMonth ? req.body.endMonth : 1;

  if (lowerLatitude > upperLatitude) {
    return res.status(404).json({ error: 'Invalid Latitude Range' });
  }

  if (lowerLongitude > upperLongitude) {
    return res.status(404).json({ error: 'Invalid Longitude Range' });
  }

  if (!speciesCategory) {
    return res.status(404).json({ error: 'No species category specified.' });
  }

  if (endMonth < startMonth) {
    return res.status(404).json({ error: 'Invalid time range.' });
  }

  connection.query(`
  WITH speciesSubset AS (
    SELECT S.Category, S.ParkId
    FROM Species S
    WHERE S.Category = '${speciesCategory}'
  ), parkSubset AS (
      SELECT P.ParkID, P.Latitude, P.Longitude
      FROM Parks P
  ), joinedParkSpecies AS (
      SELECT SS.Category, PS.Latitude, PS.Longitude
      FROM speciesSubset SS JOIN parkSubset PS ON PS.ParkID = SS.ParkID
  ), joinedAllSubset AS (
      SELECT JPS.Category, WS.WeatherType, WS.Duration
      FROM joinedParkSpecies JPS JOIN filteredEvents WS ON
          WS.Latitude >= ${lowerLatitude} AND WS.Latitude <= ${upperLatitude}
          AND WS.Longitude <= ${lowerLongitude} AND WS.Longitude >= ${upperLongitude} AND
          JPS.Latitude <= 1.0 + WS.Latitude AND JPS.Latitude >= WS.Latitude - 1.0 AND
          JPS.Longitude <= 1.0 + WS.Longitude AND JPS.Longitude >= WS.Longitude - 1.0 AND
          (EXTRACT(MONTH FROM WS.StartTime) BETWEEN ${startMonth} AND ${endMonth}) 
          AND (EXTRACT(MONTH FROM WS.EndTime) BETWEEN ${startMonth} AND ${endMonth})
  )
  SELECT JAS.Category, JAS.WeatherType, SUM(JAS.Duration) as TotalTime
  FROM joinedAllSubset as JAS
  GROUP BY JAS.Category, JAS.WeatherType
  ORDER BY TotalTime DESC;
  `,
  function (error, results) {
    if (error) {
      res.status(404).json({ error: error })
    } else if (results) {
      res.status(200).json({ results: results })
    }
  });
}

// Route 6
async function parkHighestOccurrenceWeather(req, res) {
  if (!req.query.weatherType) {
    return res.status(404).json({ error: 'No weather type entered.' });
  }

  const weatherType = req.query.weatherType;
  const pageNumber = req.params.pageNumber ? req.params.pageNumber : 1;
  // page 10 -> should skip the first 45 tuples
  const offset = (pageNumber - 1) * pagesize
  connection.query(`
  With Highest_Occurence_Park AS (
    WITH TypeEachPark As (SELECT ParkId, COUNT(EventId) as NumOfEventsByPark
    FROM (SELECT EventId, Latitude, Longitude, WeatherType FROM (filteredEvents)
        ) as w
        JOIN (SELECT Latitude, Longitude, ParkId FROM Parks_no_indexes) as p on
        w.Latitude <= 5.0 + p.Latitude AND w.Latitude >= p.Latitude - 5.0 AND
        w.Longitude <= 5.0 + p.Longitude AND w.Longitude >= p.Longitude - 5.0
    WHERE WeatherType = '${weatherType}'
    GROUP BY ParkId
    )
        SELECT T.ParkId, (T.NumOfEventsByPark / (SELECT SUM(NumOfEventsByPark) FROM TypeEachPark)) as WeatherPercentage
        FROM TypeEachPark as T
        ORDER BY WeatherPercentage DESC
        LIMIT 1
    )
  SELECT S.SpeciesId, CommonName
  FROM (SELECT SpeciesId, ParkId FROM Species) S JOIN (SELECT ParkId FROM Highest_Occurence_Park) P2 on P2.ParkId = S.ParkId
      JOIN CommonNames CN on S.SpeciesId = CN.SpeciesId
  LIMIT ${pagesize} OFFSET ${offset};`,
  function (error, results) {
    if (error) {
      res.status(404).json({ error: error })
    } else if (results) {
      res.status(200).json({ results: results })
    }
  });
}

//Route 7
async function speciesWeatherEvents(req, res) {
  let scientificName = '';
  let commonName = '';
  if (req.query.scientificName) {
    scientificName = req.query.scientificName;
  } else if (req.query.commonName) {
    commonName = req.query.commonName;
  } else {
    return res.status(404).json({ error: 'No required info entered.' });
  }

  if (commonName.length > 0) {
    //then find with that id
    connection.query(`
    WITH SpeciesSubset AS (
      SELECT S.ParkId AS ParkId
      FROM Species S WHERE S.SpeciesId IN (
          SELECT C.SpeciesId
          FROM CommonNames as C
          WHERE C.CommonName = '${commonName}'
        )
      ),
        SpeciesLocations AS (
            SELECT SS.ParkId AS ParkId, P.Latitude AS Latitude, P.Longitude AS Longitude
            FROM SpeciesSubset SS JOIN Parks P on SS.ParkId = P.ParkId
            ),
        WeatherEventsSubset AS (
            SELECT FE.WeatherType AS WeatherType, FE.Latitude AS Latitude, FE.Longitude AS Longitude
            FROM filteredEvents FE
        ),
        WeatherTypes AS (
            SELECT WES.WeatherType AS WeatherType
            FROM WeatherEventsSubset WES JOIN SpeciesLocations SL ON
                WES.Latitude <= 5.0 + SL.Latitude AND WES.Latitude >= SL.Latitude - 5.0 AND
                WES.Longitude <= 5.0 + SL.Longitude AND WES.Longitude >= SL.Longitude - 5.0)
    SELECT WT.WeatherType AS WeatherType, COUNT(WT.WeatherType) AS Occurances
    FROM WeatherTypes WT
    GROUP BY WT.WeatherType
    ORDER BY COUNT(WT.WeatherType) DESC;
    `,
    function (error, results) {
      if (error) {
        return res.status(404).json({ error: error })
      } else if (results) {
        return res.status(200).json({ results: results })
      }
    });
  } else {
    // If only scientific name is provided:
    connection.query(`
    WITH SpeciesSubset AS (
      SELECT S.ParkId AS ParkId
      FROM Species S
      WHERE S.ScientificName = '${scientificName}'
      ),
      SpeciesLocations AS (
          SELECT SS.ParkId AS ParkId, P.Latitude AS Latitude, P.Longitude AS Longitude
          FROM SpeciesSubset SS JOIN Parks P on SS.ParkId = P.ParkId
          ),
      WeatherEventsSubset AS (
          SELECT FE.WeatherType AS WeatherType, FE.Latitude AS Latitude, FE.Longitude AS Longitude
          FROM filteredEvents FE
      ),
      WeatherTypes AS (
          SELECT WES.WeatherType AS WeatherType
          FROM WeatherEventsSubset WES JOIN SpeciesLocations SL ON
              WES.Latitude <= 5.0 + SL.Latitude AND WES.Latitude >= SL.Latitude - 5.0 AND
              WES.Longitude <= 5.0 + SL.Longitude AND WES.Longitude >= SL.Longitude - 5.0)
    SELECT WT.WeatherType AS WeatherType, COUNT(WT.WeatherType) AS Occurances
    FROM WeatherTypes WT
    GROUP BY WT.WeatherType
    ORDER BY COUNT(WT.WeatherType) DESC;
    `,
    function (error, results) {
      if (error) {
        return res.status(404).json({ error: error })
      } else if (results) {
        return res.status(200).json({ results: results })
      }
    });
  }
}

// Route 9:
async function mostLikelyWeather(req, res) {
  // needs area range
  const lowerLatitude = req.body.lowerLatitude;
  const upperLatitude = req.body.upperLatitude;
  const lowerLongitude = req.body.lowerLongitude;
  const upperLongitude = req.body.upperLongitude;
  // default to only january
  const startMonth = req.body.startMonth ? req.body.startMonth : 1;
  const endMonth = req.body.endMonth ? req.body.endMonth : 1;

  if (lowerLatitude > upperLatitude) {
    return res.status(404).json({ error: 'Invalid Latitude Range' });
  }

  if (lowerLongitude > upperLongitude) {
    return res.status(404).json({ error: 'Invalid Longitude Range' });
  }

  if (endMonth < startMonth) {
    return res.status(404).json({ error: 'Invalid time range.' });
  }

  // aggregate by duration
  connection.query(`
  SELECT W.WeatherType, SUM(W.Duration) as TotalTime
  FROM filteredEvents W
  WHERE WS.Latitude >= ${lowerLatitude} AND WS.Latitude <= ${upperLatitude}
        AND WS.Longitude <= ${lowerLongitude} AND WS.Longitude >= ${upperLongitude} AND
        (EXTRACT(MONTH FROM WS.StartTime) BETWEEN ${startMonth} AND ${endMonth}) 
        AND (EXTRACT(MONTH FROM WS.EndTime) BETWEEN ${startMonth} AND ${endMonth})
  GROUP BY W.WeatherType
  ORDER BY TotalTime DESC
  LIMIT 5;
  `,
  function (error, results) {
    if (error) {
      res.status(404).json({ error: error })
    } else if (results) {
      res.status(200).json({ results: results })
    }
  });
}

// Route 10
async function recommendPark(req, res) {
  // Take in at most one weather type per input
  const undesirableEvents = req.body.undesirableEvents ? req.body.undesirableEvents : '';
  const desirableEvents = req.body.desirableEvents ? req.body.desirableEvents : '';
  
  // default these to the empty string if empty string params are given
  let whereClauseGood = ''
  let whereClauseBad =  ''
  let hasGoodClause = false;
  let hasBadClause = false;
  // generate then where clauses for each array
  if (desirableEvents.length > 0) {
    whereClauseGood = `WHERE WeatherType='${desirableEvents}'`
    hasGoodClause = true;
  }

  if (undesirableEvents.length > 0) {
    whereClauseBad =  `WHERE WeatherType='${undesirableEvents}'`
    hasBadClause = true;
  }

  if (hasBadClause && hasGoodClause) {
    connection.query(`
    WITH filtered AS (SELECT EventId, p.ParkName, WeatherType
      FROM filteredEvents fe JOIN Parks p
      ON ABS(fe.Latitude - p.Latitude) <= 1.0 AND ABS(fe.Longitude - p.Longitude) <= 1.0
    )
      SELECT percentGood.ParkName, totalBad / CT as badAvg, goodAvg
      FROM (SELECT good.ParkName, CT, totalGood / CT as goodAvg
          FROM
              (SELECT EventId, ParkName, WeatherType, COUNT(EventId) as CT FROM filtered GROUP BY ParkName) totals
                  JOIN
              (SELECT ParkName, COUNT(EventId) as totalGood FROM filtered ${whereClauseGood} GROUP BY ParkName) good
          ON good.ParkName=totals.ParkName) percentGood
          JOIN
          (SELECT ParkName, COUNT(EventId) as totalBad FROM filtered ${whereClauseBad} GROUP BY ParkName) bad
      ON percentGood.ParkName = bad.ParkName
      HAVING badAvg < 0.3 AND goodAvg > 0.3;
    `,
    function (error, results) {
      if (error) {
        res.status(404).json({ error: error })
        return;
      } else if (results) {
        res.status(200).json({ results: results })
        return;
      }
    });
  } else if (hasBadClause && !hasGoodClause) {
    connection.query(`
    WITH filtered AS (SELECT EventId, p.ParkName, WeatherType
      FROM filteredEvents fe JOIN Parks p
      ON ABS(fe.Latitude - p.Latitude) <= 1.0 AND ABS(fe.Longitude - p.Longitude) <= 1.0
    )
      SELECT percentGood.ParkName, totalBad / CT as badAvg, goodAvg
      FROM (SELECT good.ParkName, CT, totalGood / CT as goodAvg
          FROM
              (SELECT EventId, ParkName, WeatherType, COUNT(EventId) as CT FROM filtered GROUP BY ParkName) totals
                  JOIN
              (SELECT ParkName, COUNT(EventId) as totalGood FROM filtered GROUP BY ParkName) good
          ON good.ParkName=totals.ParkName) percentGood
          JOIN
          (SELECT ParkName, COUNT(EventId) as totalBad FROM filtered ${whereClauseBad} GROUP BY ParkName) bad
      ON percentGood.ParkName = bad.ParkName
      HAVING badAvg < 0.3 AND goodAvg > 0.3;
    `,
    function (error, results) {
      if (error) {
        res.status(404).json({ error: error })
        return;
      } else if (results) {
        res.status(200).json({ results: results })
        return;
      }
    });
  } else if (!hasBadClause && hasGoodClause) {
    connection.query(`
    WITH filtered AS (SELECT EventId, p.ParkName, WeatherType
      FROM filteredEvents fe JOIN Parks p
      ON ABS(fe.Latitude - p.Latitude) <= 1.0 AND ABS(fe.Longitude - p.Longitude) <= 1.0
    )
      SELECT percentGood.ParkName, totalBad / CT as badAvg, goodAvg
      FROM (SELECT good.ParkName, CT, totalGood / CT as goodAvg
          FROM
              (SELECT EventId, ParkName, WeatherType, COUNT(EventId) as CT FROM filtered GROUP BY ParkName) totals
                  JOIN
              (SELECT ParkName, COUNT(EventId) as totalGood FROM filtered ${whereClauseGood} GROUP BY ParkName) good
          ON good.ParkName=totals.ParkName) percentGood
          JOIN
          (SELECT ParkName, 0 as totalBad FROM filtered GROUP BY ParkName) bad
      ON percentGood.ParkName = bad.ParkName
      HAVING badAvg < 0.3 AND goodAvg > 0.3;
    `,
    function (error, results) {
      if (error) {
        res.status(404).json({ error: error })
        return;
      } else if (results) {
        res.status(200).json({ results: results })
        return;
      }
    });
  } else {
    // return a random park in the case where no data is given
    connection.query(`
    SELECT *
    FROM Parks
    ORDER BY RAND()
    LIMIT 1;
    `,
    function (error, results) {
      if (error) {
        res.status(404).json({ error: error })
        return;
      } else if (results) {
        res.status(200).json({ results: results })
        return;
      }
    });
  }
}

module.exports = {
    root,
    getAllParks,
    getParks,
    getParksFunfact,
    getSpecies,
    getAllSpecies,
    getParksBySpecies,
    speciesByPark,
    speciesTotalWeather,
    parkHighestOccurrenceWeather,
    speciesWeatherEvents,
    mostLikelyWeather,
    recommendPark
}
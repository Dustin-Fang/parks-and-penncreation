const config = require('./config.json')
const mysqlPkg = require('mysql');
const expressPkg = require('express');
const { parkFunFacts } = require('./parkFacts');
const coords = require('./zipcodeToCoords.json');

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

// fixed size for area searchs about a zipcode
const areaHalfWidth = 7.5;

// get coords helper
function getCoords(zipcode) {
  return coords.find(item => {
    return item.ZIP == zipcode
  })
}

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

// Route 1
// get a park or parks by name, zipcode, and/or state
async function getParks(req, res) {
  let whereClause = ``;
  let fromClause = `Parks P JOIN Zipcode Z ON P.ParkId = Z.ParkId`;

  if (req.body.ParkId >= 0) {
    whereClause = `P.ParkId = ${req.body.ParkId}`;
  }
  else {
    if (req.body.ParkName) {
      whereClause = `P.ParkName = '${req.body.ParkName}'`;
    }
    if (req.body.Zipcode) {
      if (whereClause) {
        whereClause += ` AND `;
      }
      whereClause += `Z.Zipcode = ${req.body.Zipcode}`;
    }
    if (req.body.State) {
      if (whereClause) {
        whereClause += `AND `;
      }
      whereClause += `P.State LIKE '%${req.body.State}%'`;
    }
  }

  if (!whereClause.length) {
    res.status(404).json({ message: 'No zipcode, state, or name entered! ' + whereClause })
    return;
  }

  connection.query(`
  SELECT DISTINCT P.ParkName AS ParkName, P.ParkId AS ParkId, P.Acres as Acres, P.Latitude AS Latitude, P.Longitude as Longitude, P.State as State, P.ImageURL as ImageURL
  FROM ${fromClause}
  WHERE ${whereClause};`,
    function (error, results) {
      if (error) {
        //console.error(error)
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

// Route 2
// get a species or species by common name, scientific name, zip code, or state
async function getSpecies(req, res) {
  let query;

  if (req.query.commonName) {
    // returns the species (which may be in different parks) with the given commonName
    query = `SELECT * 
            FROM Species S JOIN CommonNames CN ON S.SpeciesID = CN.SpeciesID
            WHERE CN.CommonName = '${req.query.commonName}'
            LIMIT 10;`
  } else if (req.query.scientificName) {
    // returns the species (which may be in different parks) with a given scientific name
    query = `SELECT S.*, CN.CommonName
            FROM Species S JOIN CommonNames CN ON S.SpeciesID = CN.SpeciesID
            WHERE S.ScientificName = '${req.query.scientificName}'
            LIMIT 10;`
  } else if (req.query.zipcode) {
    // returns the species (which may be in different parks) in a given zipcode
    query = `SELECT S.*, CN.CommonName
            FROM Species S JOIN Parks P on S.ParkId = P.ParkId JOIN Zipcode Z on P.ParkId = Z.ParkId
              JOIN CommonNames CN ON S.SpeciesID = CN.SpeciesID
            WHERE Z.Zipcode = '${req.query.zipcode}'
            LIMIT 10`
  } else if (req.query.state) {
    // returns the species (which may be in different parks) in a given state
    query = `SELECT S.*, CN.CommonName
            FROM Species S JOIN Parks P on S.ParkId = P.ParkId JOIN CommonNames CN ON S.SpeciesID = CN.SpeciesID
            WHERE P.State LIKE '%${req.query.state}%'
            LIMIT 10;`
  } else { // return a random aninmal
    connection.query(`
    SELECT S.SpeciesId, S.Category, S.SpeciesOrder,
    S.Family, S.ScientificName, S.RecordStatus,
    S.Occurrence, S.Nativeness, S.Abundance, S.Seasonality,
    S.ConservationStatus, S.ParkId, S.ParkCode, CN.CommonName
    FROM Species S JOIN CommonNames CN on S.SpeciesId = CN.SpeciesId
    WHERE S.Category IN ('Mammal', 'Bird', 'Reptile', 
      'Amphibian', 'Fish', 'Spider/Scorpion', 'Insect', 
      'Crab/Lobster/Shr', 'Slug/Snail') AND CN.CommonName <> 'None'
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

  connection.query(`${query}`,
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

// Route 3
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
  if (!(req.query.ParkId >=0)) {
    return res.status(404).json({ error: 'No park id entered for getting species ordered by abundance.' });
  }

  const parkId = req.query.ParkId;
  const pageNumber = req.params.pageNumber ? req.params.pageNumber : 1;
  // page 10 -> should skip the first 45 tuples
  const offset = (pageNumber - 1) * pagesize

  connection.query(`
  SELECT S.SpeciesId AS SpeciesId, S.Category AS Category, S.SpeciesOrder AS SpeciesOrder, S.Family AS Family, S.ScientificName AS ScientificName, S.RecordStatus AS RecordStatus, S.Occurrence as Occurrence, S.Nativeness AS Nativeness, S.Abundance AS Abundance, S.Seasonality AS Seasonality, S.ConservationStatus AS ConservationStatus
  FROM Parks P JOIN Species S ON P.ParkId = S.ParkId
  WHERE P.ParkId = '${parkId}'
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
  if (req.body.zipcode < 0) {
    return res.status(404).json({ error: 'Invalid zipcode'})
  }
  const zipcode = req.body.zipcode
  // needs area range
  const zipCoordsObj = getCoords(zipcode);
  const lowerLat = zipCoordsObj.LAT - areaHalfWidth
  const upperLat = zipCoordsObj.LAT + areaHalfWidth
  const lowerLng = zipCoordsObj.LNG - areaHalfWidth
  const upperLng = zipCoordsObj.LNG + areaHalfWidth

  const speciesCategory = req.body.speciesCategory;
  // default to only january
  const startMonth = req.body.startMonth ? req.body.startMonth : 1;
  const endMonth = req.body.endMonth ? req.body.endMonth : 1;

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
      SELECT SS.Category
      FROM speciesSubset SS JOIN parkSubset PS ON PS.ParkID = SS.ParkID
      WHERE PS.Latitude >= ${lowerLat} AND PS.Latitude <= ${upperLat}
          AND PS.Longitude >= ${lowerLng} AND PS.Longitude <= ${upperLng}
  ), joinedAllSubset AS (
      SELECT JPS.Category, WS.WeatherType, WS.Duration
      FROM joinedParkSpecies JPS JOIN
          (SELECT WeatherType, Duration, Latitude, Longitude, StartTime, EndTime FROM filteredEvents) WS
      WHERE WS.Latitude >= ${lowerLat} AND WS.Latitude <= ${upperLat}
          AND WS.Longitude >= ${lowerLng} AND WS.Longitude <= ${upperLng} AND
          (EXTRACT(MONTH FROM WS.StartTime) BETWEEN 1 AND 12)
          AND (EXTRACT(MONTH FROM WS.EndTime) BETWEEN 1 AND 12)
  )
  SELECT JAS.Category, JAS.WeatherType, SUM(JAS.Duration) as TotalTime
  FROM joinedAllSubset as JAS
  GROUP BY JAS.WeatherType
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
  let weatherType;
  // fix, since 'Precipitation' is truncated to 'Precipit' in the db
  if (req.query.weatherType === 'Precipitation') {
    weatherType = 'Precipit';
  } else {
    weatherType = req.query.weatherType;
  }
  
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

  // These queries aggregate all the weather events experienced by a species grouped by WeatherType

  // if a common name isn't provded
  if (commonName.length > 0) {
    // first do a speciesId search with the common name
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
  if (req.body.zipcode < 0) {
    return res.status(404).json({ error: 'Invalid zipcode'})
  }
  const zipcode = req.body.zipcode
  // needs area range
  const zipCoordsObj = getCoords(zipcode);
  const lowerLat = zipCoordsObj.LAT - areaHalfWidth
  const upperLat = zipCoordsObj.LAT + areaHalfWidth
  const lowerLng = zipCoordsObj.LNG - areaHalfWidth
  const upperLng = zipCoordsObj.LNG + areaHalfWidth

  // default to only january
  const startMonth = req.body.startMonth ? req.body.startMonth : 1;
  const endMonth = req.body.endMonth ? req.body.endMonth : 1;

  if (endMonth < startMonth) {
    return res.status(404).json({ error: 'Invalid time range.' });
  }

  // aggregate by duration
  connection.query(`
  SELECT WS.WeatherType, SUM(WS.Duration) as TotalTime
  FROM filteredEvents WS
  WHERE WS.Latitude >= ${lowerLat} AND WS.Latitude <= ${upperLat}
        AND WS.Longitude >= ${lowerLng} AND WS.Longitude <= ${upperLng} AND
        (EXTRACT(MONTH FROM WS.StartTime) BETWEEN ${startMonth} AND ${endMonth}) 
        AND (EXTRACT(MONTH FROM WS.EndTime) BETWEEN ${startMonth} AND ${endMonth})
  GROUP BY WS.WeatherType
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
  let undesirableEvents = req.body.undesirableEvents ? req.body.undesirableEvents : '';
  let desirableEvents = req.body.desirableEvents ? req.body.desirableEvents : '';

  // default these to the empty string if empty string params are given
  let whereClauseGood = ''
  let whereClauseBad = ''
  let hasGoodClause = false;
  let hasBadClause = false;
  // generate then where clauses for each array
  if (desirableEvents.length > 0) {
    // fix, since 'Precipitation' is truncated to 'Precipit' in the db
    if (desirableEvents === 'Precipitation') {
      desirableEvents = 'Precipit';
    }
    whereClauseGood = `WHERE WeatherType='${desirableEvents}'`
    hasGoodClause = true;
  }

  if (undesirableEvents.length > 0) {
    // fix, since 'Precipitation' is truncated to 'Precipit' in the db
    if (undesirableEvents === 'Precipitation') {
      undesirableEvents = 'Precipit';
    }
    whereClauseBad = `WHERE WeatherType='${undesirableEvents}'`
    hasBadClause = true;
  }

  // this runs when a type is provided for both
  if (hasBadClause && hasGoodClause) {
    connection.query(`
    WITH filtered AS (SELECT EventId, p.ParkName, p.State, WeatherType
      FROM filteredEvents fe
      JOIN Parks p on
      ABS(fe.Latitude - p.Latitude) <= 1.0 AND ABS(fe.Longitude - p.Longitude) <= 1.0
  ),
    totals AS (
      SELECT EventId, ParkName, State, WeatherType, COUNT(EventId) as CT
      FROM filtered
      GROUP BY ParkName
  ),
  goodEvents AS (
    SELECT totals.ParkName, totals.State, CT, totalGood / CT as goodAvg
    FROM totals JOIN
        (SELECT ParkName, COUNT(EventId) as totalGood FROM filtered ${whereClauseGood} GROUP BY ParkName) x
            ON x.ParkName=totals.ParkName)

    SELECT goodEvents.ParkName, goodEvents.State, PercentBad / CT as badAvg, goodAvg
    FROM goodEvents JOIN
        (SELECT ParkName, COUNT(EventId) as PercentBad FROM filtered ${whereClauseBad} GROUP BY ParkName) y
            ON goodEvents.ParkName = y.ParkName
    HAVING badAvg < 0.3 AND goodAvg > 0.3
    LIMIT 10;
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
    // runs when only bad event is provided
    connection.query(`
    WITH filtered AS (SELECT EventId, p.ParkName, p.State, WeatherType
      FROM filteredEvents fe
      JOIN Parks p on
      ABS(fe.Latitude - p.Latitude) <= 1.0 AND ABS(fe.Longitude - p.Longitude) <= 1.0
  ),
    totals AS (
      SELECT EventId, ParkName, State, WeatherType, COUNT(EventId) as CT
      FROM filtered
      GROUP BY ParkName
  ),
  goodEvents AS (
    SELECT totals.ParkName, totals.State, CT, totalGood / CT as goodAvg
    FROM totals JOIN
        (SELECT ParkName, 0 as totalGood FROM filtered GROUP BY ParkName) x
            ON x.ParkName=totals.ParkName)

    SELECT goodEvents.ParkName, goodEvents.State, PercentBad / CT as badAvg, goodAvg
    FROM goodEvents JOIN
        (SELECT ParkName, COUNT(EventId) as PercentBad FROM filtered ${whereClauseBad} GROUP BY ParkName) y
            ON goodEvents.ParkName = y.ParkName
    HAVING badAvg < 0.3
    LIMIT 10;
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
    // runs when only a good event is provided
    connection.query(`
    WITH filtered AS (SELECT EventId, p.ParkName, p.State, WeatherType
      FROM filteredEvents fe
      JOIN Parks p on
      ABS(fe.Latitude - p.Latitude) <= 1.0 AND ABS(fe.Longitude - p.Longitude) <= 1.0
  ),
    totals AS (
      SELECT EventId, ParkName, State, WeatherType, COUNT(EventId) as CT
      FROM filtered
      GROUP BY ParkName
  ),
  goodEvents AS (
    SELECT totals.ParkName, totals.State, CT, totalGood / CT as goodAvg
    FROM totals JOIN
        (SELECT ParkName, COUNT(EventId) as totalGood FROM filtered ${whereClauseGood} GROUP BY ParkName) x
            ON x.ParkName=totals.ParkName)

    SELECT goodEvents.ParkName, goodEvents.State, PercentBad / CT as badAvg, goodAvg
    FROM goodEvents JOIN
        (SELECT ParkName, 0 as PercentBad FROM filtered GROUP BY ParkName) y
            ON goodEvents.ParkName = y.ParkName
    HAVING badAvg < 0.3 AND goodAvg > 0.3
    LIMIT 10;
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
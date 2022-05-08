// get the packages for db and express ops
const expressPkg = require('express')
const mysqlPkg = require('mysql');
var corsPkg = require('cors');
// get the our own routes and the db config
const routes = require('./routes');
const config = require('./config.json');
const bodyParser = require('body-parser');
const cors = require('cors');
// create a server instance
const app = new expressPkg();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cors()) //do i need this?

// app.use(bodyParser.urlencoded({ extended: false }));

// // allow localhost 3000 (the front end) to connect to this app
app.use(corsPkg({ credentials: true, origin: ['http://localhost:3000'] }));
// root endpoint
app.get('/', routes.root);

// get all parks (testing)
app.get('/parks/all', routes.getAllParks)

// get all species (testing)
app.get('/species/all', routes.getAllSpecies);

// Route 1: get parks by state, zip or name (post bc data sent in body)
app.post('/parks', routes.getParks)

// Route 2: get species by common name, scientific name, zip code, or state
app.get('/species', routes.getSpecies);

// Route 3: get all parks containing a given species
app.get('/species/parks/:pageNumber', routes.getParksBySpecies)

// Route 4: get a list of all species in a park ordered by abundance
app.get('/parks/species/:pageNumber', routes.speciesByPark)

// Route 5: returns a list of species ordered by the total time spent experiencing each weather type
// Does not take in a pageNumber as this query is slow
app.post('/species/data', routes.speciesTotalWeather)

// Route 6: get a list of species who experience the most of a weather type
app.get('/parks/mostWeatherSpecies/:pageNumber', routes.parkHighestOccurrenceWeather)

// Route 7: get a list of weather events experiences by a species in 2021 along with occurence count
app.get('/species/weather', routes.speciesWeatherEvents)

// Route 8: get a fun fact, given a random number between [1-3]
app.get('/parks/funfact/:id', routes.getParksFunfact)

// Route 9: return most prevelant weather type in given area and season
app.post('/parks/weatherByRange', routes.mostLikelyWeather)

// Route 10: return a list of parks where desirable weather events account for more than 30% of events
app.post('/parks/recommend', routes.recommendPark)

// start the server of the port given in config
function startApp () {
    app.listen(config.server_port, () => {
        console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
    });
}

// lets you close the server (mostly used during testing)
function stopApp () {
    app.close();
}

//run the app
startApp();

module.exports = {
    stopApp,
}
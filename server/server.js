// get the packages for db and express ops
const expressPkg = require('express')
const mysqlPkg = require('mysql');
var corsPkg = require('cors');
// get the our own routes and the db config
const routes = require('./routes');
const config = require('./config.json');
const bodyParser = require('body-parser');

// create a server instance
const app = new expressPkg();


app.use(bodyParser.urlencoded({ extended: false }));

// // allow localhost 3000 (the front end) to connect to this app
app.use(corsPkg({ credentials: true, origin: ['http://localhost:3000'] }));
// root endpoint
app.get('/', routes.root);

// get all parks (testing)
app.get('/parks/all', routes.getAllParks)

// get parks by state, zip or name (post bc data sent in body)
app.post('/parks', routes.getParks)

// get a fun fact, given a random number between [1-3]
app.get('/parks/funfact/:id', routes.getParksFunfact)

// get all species (testing)
app.get('/species/all', routes.getAllSpecies);

// get species by common name, scientific name, zip code, or state
app.post('/species', routes.getSpecies);

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
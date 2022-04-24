const { expect } = require("@jest/globals");
const supertest = require("supertest");
const { number } = require("yargs");
//const results = require("./results.json")
const app = require('../server');

// **********************************
//         BASIC ROUTES TESTS
// **********************************

// parks tests
test("POST /parks no parameters", async () => {
    await supertest(app).post("/parks?")
      .expect(404);
});

// species tests
test("POST /species no parameters", async () => {
    await supertest(app).post("/species?")
      .expect(200)
      .then((response) => {
        expect(response.body.results.length).toEqual(1)
      });
});

test("POST /species with common name", async () => {
  
    await supertest(app).post("/hello?commonName=Fox")
      .expect(200)
      .then((response) => {
        // Check text 
        expect(response.body.results.length).toEqual(1)
      });
});

test("POST /species with scientific name", async () => {
  
    await supertest(app).post("/hello?scientificName=Lynx Rufus")
      .expect(200)
      .then((response) => {
        // Check text 
        expect(response.body.results.length).toEqual(42)
      });
});


const express = require("express");
const { Request, Response, Application } = require("express");
const {
  getVehicles,
  initDbTest,
  insertVehicle,
  empty,
} = require("./src/config/database");
const { scrapeTest, scrapeAll } = require("./src/scraper/puppeteer");
const Vehicle = require("./src/constructors/vehicle");

const app = express();
const PORT = 8080;

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

// app.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   next()
// })
// WILL RUN FOR EVERY REQUEST

// app.get('/users/:userId/books/:bookId', (req, res) => {
//   res.send(req.params)
// })
// P

// Perform Inital Checks for server start
performStartupChecks();

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to root URL of Server");
});

app.get("/scrape", async (req, res) => {
  // res.send(await dbTest());
  // dbTest()
  //   .then((user) => res.send(user))
  //   .catch((err) => console.log(err));
  // await scrapeAll();
  res.json(await scrapeAll());
});

app.get("/scrapeTest", async (req, res) => {
  res.send(await scrapeTest());
});

app.get("/getVehicles", async (req, res) => {
  // const queryVehicle = new Vehicle();
  // queryVehicle.debugVehicle1();
  res.send(await getVehicles());
});

app.get("/empty", async (req, res) => {
  res.json(await empty());
});

// Change to post
app.get("/insertVehicle", async (req, res) => {
  let vehicles = [];
  // vehicles[0].debugVehicle1();
  // vehicles[1].debugVehicle1();
  // vehicles[2].debugVehicle1();

  const vehicles2 = [new Vehicle(), new Vehicle(), new Vehicle()];
  vehicles2[0].debugVehicle2();
  vehicles2[1].debugVehicle2();
  vehicles2[2].debugVehicle2();

  console.log(vehicles);
  vehicles = vehicles.concat(vehicles2);
  console.log(vehicles);
  res.json(vehicles.length);

  // res.json(await insertVehicle(vehicles));
});

async function performStartupChecks() {
  console.log("Initial Checks in progress..");

  //Databse Test
  if (!(await initDbTest())) {
    console.log("--Shutting down--");
    return;
  }

  app.listen(PORT);
  console.log("All tests passed.\nServer started on " + PORT);
}

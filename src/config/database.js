const { MongoClient } = require("mongodb");
const Vehicle = require("../constructors/vehicle");
require("dotenv").config();

// Replace the uri string with your MongoDB deployment's connection string.
const mongo_host = process.env.MONGO_HOST || "127.0.0.1:27017";
const mongo_user = process.env.MONGO_USERNAME;
const mongo_pass = process.env.MONGO_PASS;
const uri =
  "mongodb://" +
  mongo_user +
  ":" +
  mongo_pass +
  "@" +
  mongo_host +
  "?authSource=admin";

const mongoClient = new MongoClient(uri);

// Initial Database test. Will create database/tables(or collections for mongo) if non are found. Only at server startup.
async function initDbTest() {
  try {
    await mongoClient.connect();
    const db = await mongoClient.db("leasewise");
    if ((await db.listCollections().toArray()).length === 0) {
      console.log("Databases not found, initializing");

      await db
        .createCollection("vehicles")
        .then(console.log("Collection 'Vehicles' created!"));

      await db
        .createCollection("vehicles_temp")
        .then(console.log("Collection 'Vehicles' created!"));

      await db
        .createCollection("agencies")
        .then(console.log("Collection 'Agencies' created!"));

      await db
        .createCollection("listings")
        .then(console.log("Collection 'Listings' created!"));
    }

    return true;
  } catch (error) {
    console.log(
      `Databse issue detected:- ${error} -. \nA stable database connection is required.`
    );
    return false;
  } finally {
    await mongoClient.close();
  }
}

async function getVehicles(vehicle) {
  try {
    await mongoClient.connect();
    const db = await mongoClient.db("leasewise");

    const vehicles = await db.collection("vehicles");

    const query =
      vehicle || vehicle == {} ? { query_name: vehicle.query_name } : {};
    const vehicleList = await vehicles.find(query).toArray();

    return vehicleList;
  } catch (error) {
    console.log("getVehicles: \n" + error);
  } finally {
    await mongoClient.close();
  }
}

async function insertVehicle(vehicles) {
  try {
    // Ensure this is an array
    vehicles = [].concat(vehicles ?? []);
    // Ensure this is an array

    await mongoClient.connect();

    const vehiclesCollection = await mongoClient
      .db("leasewise")
      .collection("vehicles");
    let result = [];

    for await (const vehicle of vehicles) {
      console.log("will test for: " + vehicle.query_name);
      if (await vehiclesExists(vehicle, vehiclesCollection)) {
        result.push(vehicle.query_name + " exists");
      } else {
        result.push(await vehiclesCollection.insertOne(vehicle));
      }
    }

    return result;
  } catch (error) {
    console.log(error);
  } finally {
    await mongoClient.close();
  }
}

async function insertAgency(agency) {
  try {
    await mongoClient.connect();
    const agencies = await mongoClient.db("leasewise").collection("agencies");

    const result = await agencies.insertOne(agency);

    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await mongoClient.close();
  }
}

async function vehiclesExists(vehicle, collection) {
  try {
    const query = { query_name: vehicle.query_name };
    const vehicleList = await collection.find(query).toArray();
    if (vehicleList.length == 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("vehiclesExists: \n" + error);
  } finally {
    // await mongoClient.close();
  }
}

// DERBUGGER
async function empty() {
  try {
    await mongoClient.connect();
    const vehicles = await mongoClient.db("leasewise").collection("vehicles");

    const result = await vehicles.deleteMany({});

    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await mongoClient.close();
  }
}

module.exports = {
  getVehicles,
  initDbTest,
  insertVehicle,
  insertAgency,
  empty,
};

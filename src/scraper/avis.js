const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
var fs = require("node:fs/promises");
const Vehicle = require("../constructors/vehicle");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Testing local HTML for avis
// const filePath = "listingPage.html";
// const insidePath = "insidePage.html";

async function scrape(html) {
  let scrapedVehicles = [];
  try {
    console.log("AVIS:Accessing website..");
    // const data = await fs.readFile(filePath, { encoding: "utf8" });
    console.log("AVIS:Scraping listings page of the vehicle..");
    var $ = cheerio.load(html);

    const $cardListings = $(".car-card.card");
    for (const card of $cardListings) {
      // Use the card body as a reference for all of the required data
      const $cardBody = $(card).children(".card-body").children("a");

      // We will extract both the manufacturer and the model from this text
      const title = $cardBody.children("h3").text();
      const manufacturer = title.split(" ")[0];
      const model = title.substring(title.indexOf(" ") + 1);

      //   Get the image link
      const img = $(card).children("a").children("img").attr("src");
      console.log(img);
      const submodel = $cardBody.children(".card-text").text();

      //   Keep only the number from the price text field
      const price = parseInt(
        $cardBody.children(".price").text().replace(/\D/g, "")
      );

      //   Get the internal listing URL to scrape the rest of the card details
      const listing_url = $cardBody.attr("href");
      // And scrape the page
      const carDetails = await scrapeInsidePages(listing_url);
      await sleep(3000);

      //   Assemble all data to a vehicle obj
      const vehicle = new Vehicle(
        false,
        manufacturer,
        model,
        submodel,
        carDetails["fuel_type"],
        carDetails["gear_type"],
        carDetails["engine_power"],
        carDetails["horsepower"],
        carDetails["co2emmisions"],
        img,
        price,
        new Date(),
        new Date()
      );

      console.log("AVIS:Vehicle scraped successfully..");

      scrapedVehicles.push(vehicle);
    }

    console.log("AVIS: All vehicles scraped successfully");
    console.log("DONE ALL");

    return scrapedVehicles;
  } catch (err) {
    console.log("Error came up whilistist scraping Avis: " + err);
  }
}

// Get each car details
async function scrapeInsidePages(listing_url) {
  console.log("AVIS:Scraping Inside page of the vehicle..");

  try {
    // TODO: CHANGE THIS TO GET IT DIRECTLY FROM THE DB
    const response = await axios.get("https://www.myavis.gr/" + listing_url);
    var $ = await cheerio.load(response.data);

    const $detailsFields = $(".details-grid").children();
    const fuel_type = $detailsFields.eq(0).children("p").text();
    const gear_type = $detailsFields.eq(1).children("p").text();

    // Keep only the numbers (just in case the values are in units)
    const engine_power = parseInt(
      $detailsFields.eq(3).children("p").text().replace(/\D/g, "")
    );
    const horsepower = parseInt(
      $detailsFields.eq(4).children("p").text().replace(/\D/g, "")
    );
    const co2emmisions = parseInt(
      $detailsFields.eq(5).children("p").text().replace(/\D/g, "")
    );
    console.log("AVIS:Inside page of the vehicle scraped successfully..");

    return {
      fuel_type: fuel_type,
      gear_type: gear_type,
      engine_power: engine_power,
      horsepower: horsepower,
      co2emmisions: co2emmisions,
    };
  } catch (err) {
    throw "(INSIDE PAGE): " + err;
  }
}
//Export
module.exports = scrape;

const puppeteer = require("puppeteer");
const avisScraper = require("./avis");
const { insertVehicle } = require("../config/database");

const avisURL =
  "https://www.myavis.gr/el/offers-list/%CE%99%CE%B4%CE%B9%CF%8E%CF%84%CE%B5%CF%82*?filter-list-1[296]=296&page=";

// const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeAll(agency) {
  const browser = await puppeteer.launch();
  const avisResults = await avisScrape(browser);
  await browser.close();
  return avisResults;
}

async function avisScrape(browser) {
  try {
    let allScrapedVehicles = [];
    const page = await browser.newPage();

    console.log(`Accessing "${avisURL}"...`);

    for (let i = 0; i <= 15; i++) {
      // This will check if the deal-cars class is contained within the top deal-cars class. If a nested deal-cars
      // is non existant, it means that the page we are viewing is emtpy thus is safe to stop the scraping. Until "isLastPage"
      // becomes true, the while loop will continue to run. In case something goes wrong, a limit of 15 loops is set.
      const isLastPage =
        (
          await page.evaluate(() =>
            Array.from(document.querySelectorAll(".deal-cars"))
          )
        ).length == 1;
      console.log(isLastPage);
      console.log("Current page is " + i);

      if (isLastPage) break;

      // Iterate through all the pages (each page has 6 cars)
      await page.goto(avisURL + i);

      console.log("Scraping page...");
      // Load HTML of the page into the cheerio parser
      const html = await page.content();
      const pageScrapedResults = await avisScraper(html);
      allScrapedVehicles = allScrapedVehicles.concat(pageScrapedResults);
    }
    console.log("AVIS:DONE! Saving results");
    return await insertVehicle(allScrapedVehicles);
  } catch (error) {
    console.log("Error at puppeteer avis scraper:");
    console.log(error);
  }
}

async function scrapeTest() {
  console.log("Launching browser...");
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  console.log(`Accessing "${avisURL}"...`);

  await page.goto(avisURL);

  console.log("Scraping page...");

  // elementHandle = await page.$('#uniqueElementId');

  // const nextButton = await page.evaluate(() => document.title);
  // let data = await getProducts(page);

  // console.log("Switching Page..");
  // page.waitForNavigation();
  // await page.goto(URL + "&page=" + i);
  // while () {

  // }
  // await page.click(".next > a");
  // data = await getProducts(page);

  console.log("Scrapping complete, closing browser!\n----------");
  await browser.close();
  return isLastPage;

  // return data;
}

async function getProducts(page) {
  let data;

  try {
    data = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".product_pod"), (e) => ({
        img: e.querySelector(".thumbnail").src,
        title: e.querySelector("h3").innerText,
        inStock:
          e.querySelector(".product_price > .instock").innerText == " In stock"
            ? true
            : false,
        price: e.querySelector(".product_price > .price_color").innerText,
      }))
    );
  } catch (error) {
    console.log("Bruuuuh \n" + error);
  }

  return data;
}

async function insertScrapedVehicles(vehicleArray) {
  console.log(await insertVehicle(vehicleArray));
}

module.exports = { scrapeTest, scrapeAll };

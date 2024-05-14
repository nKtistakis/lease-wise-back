const FUEL_TYPES = require("../enums/fuel_types");
const GEAR_TYPES = require("../enums/gear_types");

class Vehicle {
  constructor(
    professional,
    manufacturer,
    model,
    submodel,
    fuel_type,
    gear_type,
    engine_power,
    horsepower,
    co2emmisions,
    img,
    min_price,
    listed_at,
    updated_at
  ) {
    this.professional = professional ?? false;
    this.manufacturer = manufacturer ?? "";
    this.model = model ?? "";
    this.submodel = submodel ?? "";
    this.query_name = this.getVehicleName();
    this.fuel_type = fuel_type ? this.convertFuelType(fuel_type) : "";
    this.gear_type = gear_type ? this.convertGearType(gear_type) : "";
    this.engine_power = engine_power ?? 0;
    this.horsepower = horsepower ?? 0;
    this.co2emmisions = co2emmisions ?? 0;
    this.img = img ?? "";
    this.min_price = min_price ?? 0;
    this.listed_at = listed_at ?? Date();
    this.updated_at = updated_at ?? Date();
  }

  // DEBUG CONSTRUCTOR ONLY COMMENT OUT WHEN IN
  debugVehicle1() {
    this.professional = false;
    this.manufacturer = "Peugot";
    this.model = "e-208";
    this.submodel = "ti";
    this.query_name = this.getVehicleName();
    this.fuel_type = FUEL_TYPES.electric;
    this.gear_type = GEAR_TYPES.automatic;
    this.engine_power = 1400;
    this.horsepower = 78;
    this.co2emmisions = 82;
    this.img = "asda";
    this.min_price = 240;
    this.listed_at = new Date();
    this.updated_at = new Date();
  }

  debugVehicle2() {
    this.professional = false;
    this.manufacturer = "Opel";
    this.model = "Corsa";
    this.submodel = "eff";
    this.query_name = this.getVehicleName();
    this.fuel_type = FUEL_TYPES.electric;
    this.gear_type = GEAR_TYPES.automatic;
    this.engine_power = 1200;
    this.horsepower = 45;
    this.co2emmisions = 20;
    this.min_price = 180;
    this.img = "asda";
    this.listed_at = new Date();
    this.updated_at = new Date();
  }

  getVehicleName() {
    if (this.manufacturer == "" || this.model == "") {
      // throw "Invalid query name (manufacturer or model not provided)";
    }
    const query_name =
      this.manufacturer + " " + this.model + " " + this.submodel;
    return query_name;
  }

  convertFuelType(fuel_type) {
    if (fuel_type == "Βενζίνη") {
      return FUEL_TYPES.petrol;
      // this.fuel_type = "petrol";
    } else if (fuel_type == "Πετρέλαιο" || fuel_type == "Ντίσελ") {
      return FUEL_TYPES.diesel;
      // this.fuel_type = "diesel";
    } else if (fuel_type == "Ηλεκτρικό") {
      return FUEL_TYPES.electric;
      // this.fuel_type = "electric";
    } else {
      // throw "Invalid Fuel Type provided";
      return "";
    }
  }

  convertGearType(gear_type) {
    if (gear_type == "Χειροκίνητο") {
      return GEAR_TYPES.manual;
    } else if (gear_type == "Αυτόματο") {
      return GEAR_TYPES.automatic;
    } else {
      return "";
    }
  }
}

module.exports = Vehicle;

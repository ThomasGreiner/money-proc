"use strict";

const charts = require("./charts");
const io = require("./io");

let cliArgs = new Set(process.argv.slice(2));

async function main() {
  try {
    let recordData = await io.get();
    
    if (cliArgs.has("--debug")) {
      console.log(recordData.records);
    } else {
      // TODO: Hardcoded for now
      let svg = await charts.get("bar", recordData);
      console.log(svg);
    }
  } catch(ex) {
    console.error(ex);
    process.exit(1);
  }
}
main();

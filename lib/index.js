"use strict";

const io = require("./io");

async function main() {
  try {
    let records = await io.get();
    console.log(records);
  } catch(ex) {
    console.error(ex);
    process.exit(1);
  }
}
main();

"use strict";

const io = require("./io");
const {xor} = require("./charts/utils");

let cliArgs = process.argv.slice(2);

async function main() {
  try {
    let [id] = cliArgs;
    let {records} = await io.get();
    
    let total = 0;
    for (let {date, src, dest, amount} of records) {
      if (!xor(src.id == id, dest.id == id))
        continue;
      
      let source = src;
      if (src.id == id) {
        console.log(`  - ${dest.id}: ${amount * -1}`);
        total -= amount;
      } else {
        console.log(`  + ${src.id}: ${amount}`);
        total += amount;
        console.log(`= ${total} @ ${date.toISOString()}`);
      }
    }
    console.log(`= ${total}`);
  } catch(ex) {
    console.error(ex);
    process.exit(1);
  }
}
main();

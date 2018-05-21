"use strict";

const {GREEN, HSL} = require("../colors");
const {xor} = require("../utils");

function query({records}) {
  let chartData = {
    type: "line",
    colors: [new HSL(GREEN)],
    x: [],
    y: ["Wealth"],
    values: []
  };
  
  let months = new Map();
  
  for (let {date, src, dest, amount} of records) {
    let {idMonth} = date;
    let month = months.get(idMonth) || 0;
    
    // Ignore internal transfers
    if (xor(src.isSelf, dest.isSelf)) {
      if (src.isSelf) {
        month -= amount;
      } else {
        month += amount;
      }
    }
    
    months.set(idMonth, month);
  }
  
  let wealth = 0;
  months = Array.from(months).sort();
  for (let [idMonth, month] of months) {
    chartData.x.push(idMonth);
    wealth += month;
    chartData.values.push([wealth]);
  }
  
  return chartData;
}
exports.query = query;

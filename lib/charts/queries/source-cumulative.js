"use strict";

const Color = require("svc/lib/color");

const {xor} = require("../utils");

function query({records}, {id}) {
  let chartData = {
    type: "line",
    colors: [Color.GREEN],
    x: [],
    y: [id],
    values: []
  };
  
  let months = new Map();
  
  for (let {date, src, dest, amount} of records) {
    let {idMonth} = date;
    let month = months.get(idMonth) || 0;
    
    // Ignore internal transfers
    if (xor(src.id == id, dest.id == id)) {
      if (src.id == id) {
        month -= amount;
      } else {
        month += amount;
      }
    }
    
    months.set(idMonth, month);
  }
  
  let total = 0;
  months = Array.from(months).sort();
  for (let [idMonth, month] of months) {
    chartData.x.push(idMonth);
    total += month;
    chartData.values.push([total]);
  }
  
  return chartData;
}
exports.query = query;

"use strict";

const Color = require("svc/lib/color");

const {xor} = require("../utils");

function query({records}, {id}) {
  let chartData = {
    type: "bar-grouped",
    colors: [Color.GREEN, Color.RED],
    x: [],
    y: ["Incoming", "Outgoing"],
    values: []
  };
  
  let months = new Map();
  
  for (let {date, src, dest, amount} of records) {
    let {idMonth} = date;
    let month = months.get(idMonth) || {expenses: 0, income: 0};
    
    // Ignore internal transfers
    if (xor(src.id == id, dest.id == id)) {
      let type = (src.id == id) ? "expenses" : "income";
      month[type] += amount;
    }
    
    months.set(idMonth, month);
  }
  
  months = Array.from(months).sort();
  for (let [idMonth, month] of months) {
    chartData.x.push(idMonth);
    chartData.values.push([month.income, month.expenses]);
  }
  
  return chartData;
}
exports.query = query;

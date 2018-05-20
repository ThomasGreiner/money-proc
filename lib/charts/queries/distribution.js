"use strict";

const {GREEN, HSL, RED} = require("../colors");

function query({records}) {
  let chartData = {
    type: "pie",
    colors: [new HSL(GREEN), new HSL(RED)],
    x: [],
    y: ["Profit", "Expenses"],
    values: []
  };
  
  let expenses = 0;
  let income = 0;
  
  for (let {src, dest, amount} of records) {
    // XOR @self sources to include transfers from/to them and exclude
    // transfers between them
    if (!!src.isSelf != !!dest.isSelf) {
      if (src.isSelf) {
        expenses += amount;
      } else {
        income += amount;
      }
    }
  }
  
  // TODO: handle remaining cases
  if (income > expenses) {
    chartData.values = [income - expenses, expenses];
  }
  
  return chartData;
}
exports.query = query;

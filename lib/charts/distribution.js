"use strict";

function getData(recordData) {
  let chartData = {
    type: "pie",
    colors: ["#7B5", "#D41"],
    x: [],
    y: ["Profit", "Expenses"],
    values: []
  };
  
  let expenses = 0;
  let income = 0;
  let selfSources = new Set(recordData.sources["@self"]);
  
  for (let {src, dest, amount} of recordData.records) {
    // XOR @self sources to include transfers from/to them and exclude
    // transfers between them
    if (!!selfSources.has(src.id) != !!selfSources.has(dest.id)) {
      if (selfSources.has(src.id)) {
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
exports.getData = getData;

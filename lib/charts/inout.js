"use strict";

function getData(recordData) {
  let chartData = {
    type: "bar-grouped",
    colors: ["#7B5", "#D41"],
    x: [],
    y: ["Income", "Expenses"],
    values: []
  };
  
  let months = new Map([]);
  let selfSources = new Set(recordData.sources["@self"]);
  
  for (let {date, src, dest, amount} of recordData.records) {
    let {idMonth} = date;
    let month = months.get(idMonth) || {expenses: 0, income: 0};
    
    // XOR @self sources to include transfers from/to them and exclude
    // transfers between them
    if (!!selfSources.has(src.id) != !!selfSources.has(dest.id)) {
      let type = (selfSources.has(src.id)) ? "expenses" : "income";
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
exports.getData = getData;

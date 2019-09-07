"use strict";

const svc = require("svc");

const chartTypes = [
  "bar",
  "bar-stacked",
  "flow",
  "line-self",
  "line-source",
  "pie",
  "pie-self"
];

let charts = new Map();
for (let chartType of chartTypes) {
  charts.set(chartType, require(`./queries/${chartType}`));
}

async function get(chartType, recordData, params) {
  if (!charts.has(chartType))
    throw new Error("Unknown chart ID");
  
  let chartData = charts.get(chartType).query(recordData, params);
  return svc.getSVG(chartData);
}
exports.get = get;

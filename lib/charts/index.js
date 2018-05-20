"use strict";

const svc = require("svc");

const INOUT = Symbol();
exports.INOUT = INOUT;

let charts = {
  [INOUT]: require("./inout")
};

async function get(chartId, recordData) {
  if (!(chartId in charts))
    throw new Error(`Unknown chart ID: ${chartId}`);
  
  let chartData = charts[chartId].getData(recordData);
  return svc.getSVG(chartData);
}
exports.get = get;

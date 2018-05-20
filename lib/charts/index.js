"use strict";

const svc = require("svc");

const DISTRIBUTION = Symbol();
exports.DISTRIBUTION = DISTRIBUTION;

const INOUT = Symbol();
exports.INOUT = INOUT;

const WEALTH = Symbol();
exports.WEALTH = WEALTH;

let charts = {
  [DISTRIBUTION]: require("./queries/distribution"),
  [INOUT]: require("./queries/inout"),
  [WEALTH]: require("./queries/wealth")
};

async function get(chartId, recordData) {
  if (!(chartId in charts))
    throw new Error(`Unknown chart ID: ${chartId}`);
  
  let chartData = charts[chartId].query(recordData);
  return svc.getSVG(chartData);
}
exports.get = get;

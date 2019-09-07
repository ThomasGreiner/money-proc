"use strict";

const svc = require("svc");

const DISTRIBUTION = Symbol();
exports.DISTRIBUTION = DISTRIBUTION;

const FLOW_SELF = Symbol();
exports.FLOW_SELF = FLOW_SELF;

const INOUT = Symbol();
exports.INOUT = INOUT;

const INOUT_DISTRIBUTION = Symbol();
exports.INOUT_DISTRIBUTION = INOUT_DISTRIBUTION;

const SOURCE_CUMULATIVE = Symbol();
exports.SOURCE_CUMULATIVE = SOURCE_CUMULATIVE;

const WEALTH = Symbol();
exports.WEALTH = WEALTH;

const WEALTH_DISTRIBUTION = Symbol();
exports.WEALTH_DISTRIBUTION = WEALTH_DISTRIBUTION;

let charts = {
  [DISTRIBUTION]: require("./queries/distribution"),
  [FLOW_SELF]: require("./queries/flow-self"),
  [INOUT]: require("./queries/inout"),
  [INOUT_DISTRIBUTION]: require("./queries/inout-distribution"),
  [SOURCE_CUMULATIVE]: require("./queries/source-cumulative"),
  [WEALTH]: require("./queries/wealth"),
  [WEALTH_DISTRIBUTION]: require("./queries/wealth-distribution")
};

async function get(chartId, recordData, params) {
  if (!(chartId in charts))
    throw new Error("Unknown chart ID");
  
  let chartData = charts[chartId].query(recordData, params);
  return svc.getSVG(chartData);
}
exports.get = get;

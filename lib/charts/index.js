"use strict";

const INOUT = Symbol();
exports.INOUT = INOUT;

let charts = {
  [INOUT]: require("./inout")
};

function get(chartId, recordData) {
  if (!(chartId in charts))
    throw new Error(`Unknown chart ID: ${chartId}`);
  
  return charts[chartId].getData(recordData);
}
exports.get = get;

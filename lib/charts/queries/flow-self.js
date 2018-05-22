"use strict";

const {HSL} = require("../colors");
const {xor} = require("../utils");

function query({records}) {
  let categories = new Map();
  
  for (let {src, dest, amount} of records) {
    if (!xor(src.isSelf, dest.isSelf))
      continue;
    
    let otherSource = (src.isSelf) ? dest : src;
    
    let [categoryId] = otherSource.categories;
    
    let category = categories.get(categoryId);
    if (!category) {
      category = {inflow: 0, outflow: 0};
      categories.set(categoryId, category);
    }
    
    if (src.isSelf) {
      category.outflow += amount;
    } else {
      category.inflow += amount;
    }
  }
  
  let hueSteps = 360 / categories.size;
  let colors = Array.from(categories).map((item, idx) =>
      new HSL([idx * hueSteps, 75, 50]));
  let inflow = Array.from(categories.values()).map(({inflow}) => inflow);
  let outflow = Array.from(categories.values()).map(({outflow}) => outflow);
  
  return {
    type: "bar-stacked",
    colors,
    x: ["Inflow", "Outflow"],
    y: Array.from(categories.keys()),
    values: [
      inflow,
      outflow
    ]
  };
}
exports.query = query;

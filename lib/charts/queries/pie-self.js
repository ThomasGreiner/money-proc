"use strict";

const Color = require("svc/lib/color");

function query({records}) {
  let wealthBySource = new Map();
  
  function changeAmount(source, change) {
    if (!source.isSelf)
      return;
    
    let wealth = wealthBySource.get(source.id) || 0;
    wealth += change;
    wealthBySource.set(source.id, wealth);
  }
  
  for (let {src, dest, amount} of records) {
    changeAmount(src, -amount);
    changeAmount(dest, amount);
  }
  
  // Cancel out negative wealth
  for (let [id, wealth] of wealthBySource) {
    if (wealth < 0) {
      wealth = 0;
      wealthBySource.set(id, wealth);
    }
  }
  
  let colors = Array.from(wealthBySource).map((item, idx) => {
    let color = Color.GREEN;
    color.lightness += 5 * idx;
    return color;
  });
  
  return {
    type: "pie",
    colors,
    x: [],
    y: [...wealthBySource.keys()],
    values: [...wealthBySource.values()]
  };
}
exports.query = query;

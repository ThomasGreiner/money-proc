"use strict";

const {GREEN, HSL, RED} = require("../colors");
const {xor} = require("../utils");

function query({records}) {
  let expensesByCategory = new Map();
  let expenses = 0;
  let income = 0;
  
  for (let {src, dest, amount} of records) {
    // Ignore internal transfers
    if (xor(src.isSelf, dest.isSelf)) {
      if (src.isSelf) {
        for (let id of dest.categories) {
          let categoryExpenses = expensesByCategory.get(id) || 0;
          categoryExpenses += amount;
          expensesByCategory.set(id, categoryExpenses);
        }
        expenses += amount;
      } else {
        income += amount;
      }
    }
  }
  
  // TODO: handle remaining cases
  if (income <= expenses)
    throw new Error("Undefined state: Income has to be higher than expenses");
  
  let colors = Array.from(expensesByCategory).map((item, idx) => {
    let color = new HSL(RED);
    color.lightness += 5 * idx;
    return color;
  });
  
  return {
    type: "pie",
    colors: [
      new HSL(GREEN),
      ...colors
    ],
    x: [],
    y: [
      "Profit",
      ...expensesByCategory.keys()
    ],
    values: [
      income - expenses,
      ...expensesByCategory.values()
    ]
  };
}
exports.query = query;

"use strict";

const {GREEN, HSL, RED} = require("../colors");
const {xor} = require("../utils");

function query({records}) {
  let months = new Map();
  let categories = new Set();
  
  for (let {date, src, dest, amount} of records) {
    let {idMonth} = date;
    let month = months.get(idMonth) || {
      expenses: 0,
      expensesByCategory: new Map(),
      income: 0
    };
    
    // Ignore internal transfers
    if (xor(src.isSelf, dest.isSelf)) {
      if (src.isSelf) {
        for (let id of dest.categories) {
          categories.add(id);
          let categoryExpenses = month.expensesByCategory.get(id) || 0;
          categoryExpenses += amount;
          month.expensesByCategory.set(id, categoryExpenses);
        }
        month.expenses += amount;
      } else {
        month.income += amount;
      }
    }
    
    months.set(idMonth, month);
  }
  
  let colors = Array.from(categories).map((item, idx) => {
    let color = new HSL(RED);
    color.lightness += 5 * idx;
    return color;
  });
  
  let values = Array.from(months).map(([, month]) => {
    let {expenses, expensesByCategory, income} = month;
    
    let categoryExpenses = Array.from(categories).map((category) => {
      return expensesByCategory.get(category) || 0;
    });
    
    return [
      ...categoryExpenses,
      (income > expenses) ? income - expenses : 0
    ];
  });
  
  return {
    type: "bar-stacked",
    colors: [
      ...colors,
      new HSL(GREEN)
    ],
    x: Array.from(months.keys()),
    y: [
      ...categories,
      "Profit"
    ],
    values
  };
}
exports.query = query;

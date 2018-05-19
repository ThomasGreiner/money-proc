"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const DATA_DIR = "data";
const reAmount = /^\d+\.\d{2}$/;
const reDate = /^\d{4}-\d{2}-\d{2}$/;
const reSource = /^[a-z][a-z0-9]+(?:\.[a-z0-9]+)*$/;

class Source {}

function parseDate(str) {
  if (!reDate.test(str))
    throw new Error(`Invalid date: ${str}`);
  
  return new Date(str);
}

function parseSource(str) {
  if (!reSource.test(str))
    throw new Error(`Invalid source: ${str}`);
  
  return new Source(str);
}

function parseAmount(str) {
  if (!reAmount.test(str))
    throw new Error(`Invalid amount: ${amount}`);
  
  return parseFloat(str);
}

function parseLine(line) {
  line = line.split(",");
  if (line.length != 5)
    throw new Error(`Invalid line: ${line}`);
  
  let [date, src, via, dest, amount] = line;
  date = parseDate(date);
  src = parseSource(src);
  via = (via) ? parseSource(via) : null;
  dest = parseSource(dest);
  amount = parseAmount(amount);
  
  return {date, src, via, dest, amount};
}

async function parseAll() {
  let filenames = await readDir(DATA_DIR);
  let contents = filenames
    .filter((filename) => /^\d{4}\.csv$/.test(filename))
    .map(async (filename) => {
      let filepath = path.join(DATA_DIR, filename);
      let content = await readFile(filepath);
      return content.toString();
    });
  contents = await Promise.all(contents);
  
  let lines = contents
    .join("\n")
    .split("\n")
    .filter((line) => !!line);
  return lines.map(parseLine);
}

async function get(from = 0, to = Date.now()) {
  let records = await parseAll();
  
  return records;
}
exports.get = get;

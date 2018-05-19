"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const DATA_DIR = path.resolve("data");
const reAmount = /^\d+\.\d{2}$/;
const reDate = /^\d{4}-\d{2}-\d{2}$/;
const reSource = /^[a-z][a-z0-9]+(?:\.[a-z0-9]+)*$/;

let sources = require(path.join(DATA_DIR, "sources.json"));

class RecordDate extends Date {
  get idMonth() {
    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    month = (month < 10) ? `0${month}` : `${month}`;
    return `${year}-${month}`;
  }
}

class RecordSource {
  constructor(id) {
    this.id = id;
  }
}

function parseDate(str) {
  if (!reDate.test(str))
    throw new Error(`Invalid date: ${str}`);
  
  return new RecordDate(str);
}

function parseSource(str) {
  if (!reSource.test(str))
    throw new Error(`Invalid source: ${str}`);
  
  return new RecordSource(str);
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
  let records = lines.map(parseLine);
  
  return {records, sources};
}

async function get(from = 0, to = Date.now()) {
  let recordData = await parseAll();
  
  return recordData;
}
exports.get = get;

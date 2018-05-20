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

let sourceData = require(path.join(DATA_DIR, "sources.json"));
let categoryMap = new Map();
let countryMap = new Map();
let sourceMap = new Map();

class RecordCategory {
  static create(id) {
    let category = categoryMap.get(id);
    if (!category) {
      category = new RecordCategory(id);
      categoryMap.set(id, category);
    }
    return category;
  }
  
  constructor(id) {
    this.id = id;
    this.sources = new Set();
  }
  
  addSource(sourceId) {
    this.sources.add(sourceId);
  }
}

class RecordCountry {
  static create(id) {
    let country = countryMap.get(id);
    if (!country) {
      country = new RecordCountry(id);
      countryMap.set(id, country);
    }
    return country;
  }
  
  constructor(id) {
    this.id = id;
    this.sources = new Set();
  }
  
  addSource(sourceId) {
    this.sources.add(sourceId);
  }
}

class RecordDate extends Date {
  get idMonth() {
    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    month = (month < 10) ? `0${month}` : `${month}`;
    return `${year}-${month}`;
  }
}

class RecordSource {
  static create(id) {
    let source = sourceMap.get(id);
    if (!source) {
      source = new RecordSource(id);
      sourceMap.set(id, source);
    }
    return source;
  }
  
  constructor(id) {
    this.id = id;
    this.categories = new Set();
    this.isSelf = false;
    
    let [countryId] = id.split(".", 1);
    let country = RecordCountry.create(countryId);
    country.addSource(this.id);
    this.country = countryId;
  }
  
  addCategory(id) {
    let category = RecordCategory.create(id);
    category.addSource(this.id);
    if (id == "@self") {
      this.isSelf = true;
    } else {
      this.categories.add(id);
    }
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
  
  let source = sourceMap.get(str);
  if (!source)
    throw new Error(`Source not found: ${str}`);
  
  return source;
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

async function parseRecords() {
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
  let records = await parseRecords();
  return {
    records,
    categories: categoryMap,
    countries: countryMap,
    sources: sourceMap
  };
}
exports.get = get;

function initSources(catIds, sources) {
  for (let catId in sources) {
    catIds.push(catId);
    
    let cat = sources[catId];
    if (cat instanceof Array) {
      for (let sourceId of cat) {
        let source = RecordSource.create(sourceId);
        source.addCategory(catIds.join("."));
      }
    } else {
      initSources(catIds, cat);
    }
    
    catIds.pop();
  }
}
initSources([], sourceData);

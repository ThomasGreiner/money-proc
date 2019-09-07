"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const qs = require("querystring");
const util = require("util");
const url = require("url");

const charts = require("./charts");
const io = require("./io");

const readFile = util.promisify(fs.readFile);

const basePath = path.resolve(__dirname, "..");
const port = 8080;

async function onRequest(req, resp) {
  let status = 200;
  let type = "text/plain";
  let content = "";
  
  try {
    let urlInfo = url.parse(req.url);
    let params = qs.parse(urlInfo.query);
    let urlParts = urlInfo.pathname.slice(1).split("/");
    
    switch (urlParts[0]) {
      case "":
        type = "text/html";
        content = await readFile(path.join(basePath, "index.htm"));
        break;
      case "api":
        if (urlParts[1] != "sources.json")
          break;
        
        type = "application/json";
        content = await readFile(path.join(basePath, "data/sources.json"));
        break;
      case "css":
        if (urlParts[1] != "index.css")
          break;
        
        type = "text/css";
        content = await readFile(path.join(basePath, "css/index.css"));
        break;
      case "img":
        if (urlParts[1] != "svc")
          break;
        
        let chartType = /^(.*)\.svg/.exec(urlParts[2]);
        if (!chartType || chartType.length < 1)
          break;
        
        type = "image/svg+xml";
        let recordData = await io.get();
        content = await charts.get(chartType[1], recordData, params);
        break;
      case "js":
        if (urlParts[1] != "index.js")
          break;
        
        type = "application/javascript";
        content = await readFile(path.join(basePath, "js/index.js"));
        break;
    }
    
    if (!content) {
      status = 404;
    }
  } catch(ex) {
    console.error(ex);
    status = 500;
  }
  
  resp.writeHead(status, {"Content-Type": type});
  resp.write(content);
  resp.end();
}

let server = http.createServer(onRequest);
server.listen(port);
console.log(`Server started on port ${port}`);

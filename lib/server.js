"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const util = require("util");

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
    switch (req.url) {
      case "/":
        type = "text/html";
        content = await readFile(path.join(basePath, "index.htm"));
        break;
      case "/api/sources.json":
        type = "application/json";
        content = await readFile(path.join(basePath, "data/sources.json"));
        break;
      case "/css/index.css":
        type = "text/css";
        content = await readFile(path.join(basePath, "css/index.css"));
        break;
      case "/img/svc/inout.svg":
        type = "image/svg+xml";
        let recordData = await io.get();
        content = await charts.get(charts.INOUT, recordData);
        break;
      case "/js/index.js":
        type = "application/javascript";
        content = await readFile(path.join(basePath, "js/index.js"));
        break;
      default:
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

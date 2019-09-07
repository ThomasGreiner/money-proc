"use strict";

HTMLElement.prototype.create = function(tagName, content) {
  let element = document.createElement(tagName);
  if (typeof content != "undefined") {
    element.textContent = content;
  }
  this.appendChild(element);
  return element;
}

let $ = (selector) => document.querySelector(selector);

function addCategories(eParent, sources) {
  for (let catId in sources) {
    let eCat = eParent.create("li", catId);
    let eSources = eCat.create("ul");
    
    let cat = sources[catId];
    if (cat instanceof Array) {
      for (let sourceId of cat) {
        let eSource = eSources.create("li");
        let eLink = eSource.create("a", sourceId);
        eLink.href = `#${sourceId}`;
      }
    } else {
      addCategories(eSources, cat);
    }
  }
}

function onHashChange() {
  let id = location.hash.slice(1);
  if (!id) {
    document.body.dataset.view = "general";
    return;
  }
  
  document.body.dataset.view = "detail";
  $("#details h2").textContent = id;
  $("#details .total").src = `/img/svc/line-source.svg?id=${id}`;
}

async function init() {
  let resp = await fetch("/api/sources.json");
  let sourcesByCat = await resp.json();
  
  addCategories($("#categories"), sourcesByCat);
}
init();
onHashChange();

window.addEventListener("hashchange", onHashChange);

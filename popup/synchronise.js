console.log("synchronise.js started");

// Keep chrome compatible creating browser object
if (typeof browser != "object") {
    browser = chrome;
  }
  
// Access winlist letiable from background.js
let b = browser.extension.getBackgroundPage();
//let b = await browser.runtime.getBackgroundPage();
let winlist = b.winlist;
let tm = b.tm;

let currentWindowId;
let messages =  document.getElementById("_messages");

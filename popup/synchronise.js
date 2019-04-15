console.log("synchronise.js started");

// Keep chrome compatible creating browser object
if (typeof browser != "object") {
    browser = chrome;
  }
  
// Access winlist variable from background.js
var b = browser.extension.getBackgroundPage();
//var b = await browser.runtime.getBackgroundPage();
var winlist = b.winlist;
var tm = b.tm;

var currentWindow_id;
var messages =  document.getElementById("_messages");

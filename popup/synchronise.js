console.log("synchronise.js started");

// Keep chrome compatible creating browser object
if (typeof browser != 'object') {
    browser = chrome;
  }
  
var b = browser.extension.getBackgroundPage();
//var b = await browser.runtime.getBackgroundPage();
var winlist = b.winlist;


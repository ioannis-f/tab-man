log("popup.js: Started");

console.log("synchronise.js started");

// Keep chrome compatible creating browser object
if (typeof browser != "object") {
  browser = chrome;
}

// Access background.js
let b = browser.extension.getBackgroundPage();
let tm = b.tm;
//let winlist = b.winlist;

let currentWindowId;
let messages =  document.getElementById("_messages");


document.addEventListener("DOMContentLoaded", createview);  // createview();

// // Message receive
// browser.runtime.onMessage.addListener(messageNotify);
// function messageNotify(message){
//   msg("message received");
// }

log("Pop-up Loop ended");


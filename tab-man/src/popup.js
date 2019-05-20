log("popup.js: Started");

// Keep chrome compatible creating browser object
if (typeof browser != "object") {
  browser = chrome;
}

// Access background.js
let b = browser.extension.getBackgroundPage();
let tm = b.tm;
log(tm);
let currentWindowId;

let messages = document.getElementById("_messages");

document.addEventListener("DOMContentLoaded", function() {
  createview(true);
});

// // Message receive
// browser.runtime.onMessage.addListener(messageNotify);
// function messageNotify(message){
//   msg("message received");
// }

log("Pop-up Loop ended");

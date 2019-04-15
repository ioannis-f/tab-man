console.log("synchronise.js started");

// Keep chrome compatible creating browser object
if (typeof browser != "object") {
  browser = chrome;
}

// Access background.js
var b = browser.extension.getBackgroundPage();
var tm = b.tm;
//var winlist = b.winlist;

log("RRRRRRRRRRRRRR" );
log(tm);
let currentWindowId;
let messages =  document.getElementById("_messages");



// ### LIBRARY #################################
// # Clear data in storage
function storage_clear(id) {
  // storage_clear("store");
  browser.storage.local.remove(id);
  log("cleared");
}

function timestamp() {
  let x = new Date();
  return x.toISOString().split("-").join("")
    .split("T").join(" ").split(":").join("")
    //.split(".")[0] 
    + " ";
}
function log(str){
  console.log(str);
}
function logerror(str){
  console.log("Error: " + str);
}
function onError(error) {
  console.log(`Error: ${error}`);
}
function msg(str){
  //messages.innerHTML = messages.innerHTML + "\n" + str;
  messages.innerHTML = str;
}

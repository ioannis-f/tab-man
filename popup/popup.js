// let resetBtn = document.querySelector(".reset");

//console.error("test");
//alert("test");
//log("clipboard: ");
//saveToClipboard("Clipboard Test");
//let x = readFromClipboard();

log("popup.js: Started");

document.addEventListener("DOMContentLoaded", createview);  // createview();

// Message receive
browser.runtime.onMessage.addListener(messageNotify);
function messageNotify(message){
  msg("message received");
}

log("Pop-up Loop ended");



function allowDrop(ev) {
  ev.preventDefault();
}



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


// function winlistSort(){
//   for (const key of Object.keys(winlist)) {
//     console.log(key + " " + winlist[key]); }

// }


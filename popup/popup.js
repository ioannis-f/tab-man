// let resetBtn = document.querySelector('.reset');

//console.error('test');
//alert("test");
//log('clipboard: ');
//saveToClipboard("Clipboard Test");
//let x = readFromClipboard();

log("Starting Popup: ");

/*if (typeof window == 'object') {
  console.log("window object exists");
  browser = window;
}
*/


var currentwindow_id;
var messages =  document.getElementById('_messages');

// Access winlist variable from background.js
//var b = browser.extension.getBackgroundPage();
//winlist = b.winlist;
log(winlist);

document.addEventListener('DOMContentLoaded', createview);  // createview();

// Message receive
browser.runtime.onMessage.addListener(messageNotify);
function messageNotify(message){
  msg("message received");
}

log('Pop-up Loop ended');



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
  return x.toISOString().split('-').join('')
    .split('T').join(' ').split(':').join('')
    //.split('.')[0] 
    +
    ' ';
}
function log(str){
  console.log(str);
}
function logerror(str){
  console.log('Error: ' + str);
}



// ### Firefox/chrome Extension routines #######
// # Save data to storage
function saveToStorage(){
  browser.storage.local.set({"store": winlist}, function() {
  if (browser.runtime.lastError) {
    logerror('Error saving: ' + browser.runtime.lastError);
  } else {
    log('Data Saved: pop-up');
  }
});
}
/*
function saveToStorage(){
  browser.storage.local.set({"store": winlist}
);}

*/ 

// # Save to mozilla servers
function saveOptions(e) {
  browser.storage.sync.set({
    colour: document.querySelector("#colour").value
  });
  e.preventDefault();
}
function onError(error) {
  console.log(`Error: ${error}`);
}

function msg(str){
  //messages.innerHTML = messages.innerHTML + '\n' + str;
  messages.innerHTML = str;
}





function winlistSort(){
  for (const key of Object.keys(winlist)) {
    console.log(key + ' ' + winlist[key]); }

}


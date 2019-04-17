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




var dragged;

/* events fired on the draggable target */
document.addEventListener("drag", function(event) {
log("drag: " + event);
}, false);

document.addEventListener("dragstart", function(event) {
  log("dragstart: " + event);
  // store a ref. on the dragged elem
  dragged = event.target;
  // make it half transparent
  event.target.style.opacity = .5;
}, false);

document.addEventListener("dragend", function(event) {
  log("dragend: " + event);
  // reset the transparency
  event.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function(event) {
  log("dragover: " + event);
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function(event) {
  log("dragenter: " + event);
  // highlight potential drop target when the draggable element enters it
  if (event.target.className == "dropzone") {
    event.target.style.background = "purple";
  }

}, false);

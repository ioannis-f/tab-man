
// ### DRAG N DROP  
var dragged;
/*
// events fired on the draggable target 
document.addEventListener("drag", function(event) {
  log("drag: " + event.target.id);
  log(event);
}, false);
*/
document.addEventListener("dragstart", function(event) {      // ***
  log("dragstart: " + event.target.id);
  log(event);
  
  event.dataTransfer.setData("text", "somedata");
  // store a ref. on the dragged elem
  dragged = event.target;
  //make it half transparent
  event.target.style.opacity = .5;
}, false);


document.addEventListener("dragend", function(event) {      // ***
  log("dragend: " + event.target.id); 
  log(event);
  // reset the transparency     
  event.target.style.opacity = "";
}, false);


// *** events fired on the drop targets 
document.addEventListener("dragover", function(event) {       // ***
  event.preventDefault();
  log("dragover: " + event.target.id);
  log(event);
}, false);

/*
document.addEventListener("dragenter", function(event) {
  log("dragenter: " + event.target.id);
  log(event);
  // highlight potential drop target when the draggable element enters it
  if (event.target.className == "dropzone") {
    event.target.style.background = "purple";
  }
}, false);

document.addEventListener("dragleave", function(event) {
  log("dragleave: " + event.target.id);
  log(event);
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className == "dropzone") {
    event.target.style.background = "";
  }
}, false);
*/


document.addEventListener("drop", function(event) {
  event.preventDefault();
  log("### drop,  Source: " +dragged.id +"  dest: " + event.target.id);
  log("## From id: " + dragged.id.split("_")[0] + " to id:" + event.target.id.split("_")[0]);
  // prevent default action (open as link for some elements)

  log(event);
  swapArrayItems(dragged.id, event.target.id);

  // move dragged elem to the selected drop target
  if (event.target.className == "dropzone") {
    event.target.style.background = "";
    dragged.parentNode.removeChild( dragged );
    event.target.appendChild( dragged );
  }
}, false);


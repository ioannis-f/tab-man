
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
  // store a ref. on the dragged elem
  dragged = event.target;
  //make it half transparent
  event.target.style.opacity = .5;
}, false);

/*
document.addEventListener("dragend", function(event) {
  log("dragend: " + event.target.id);
  log(event);
  // reset the transparency
  event.target.style.opacity = "";
}, false);
*/

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
  log("### drop,  Source: " +dragged.id +"  dest: " + event.target.id);
  log("## From id: " + dragged.id.split("_")[0] + " to id:" + event.target.id.split("_")[0]);
  // prevent default action (open as link for some elements)
  event.preventDefault();

  log(event);
  swapArrayItems(dragged.id, event.target.id);

  // move dragged elem to the selected drop target
  if (event.target.className == "dropzone") {
    event.target.style.background = "";
    dragged.parentNode.removeChild( dragged );
    event.target.appendChild( dragged );
  }
}, false);


function swapArrayItems(srcElementId, destElementId){
  let i1 = b.findPosById(srcElementId.split("_")[0]);
  let i2 = b.findPosById(destElementId.split("_")[0]);

  let tmp = tm.list[i1];
  tm.list.splice(i1, 1);           // Remove from source position
  if(i2==""){
    log("### empty");
    i2 = tm.list.length;
  }
  tm.list.splice(i2, 0, tmp);      // Insert to destination position
  //log(tm);
  b.saveToStorage(); // Save to storage
  createview();

}


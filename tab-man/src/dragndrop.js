// ### DRAG N DROP
let dragStart;
let dragEnd;

/*
// events fired on the draggable target 
document.addEventListener("drag", function(event) {
  log("drag: " + event.target.id);
  log(event);
}, false);
*/
document.addEventListener(
  "dragstart",
  function(event) {
    // ***
    log("dragstart: " + event.target.id);
    // log(event);

    event.dataTransfer.setData("text", "somedata");
    // store a ref. on the dragged elem
    dragStart = event.target;
    //make it half transparent
    event.target.style.opacity = 0.5;
  },
  false
);

// *** events fired on the drop targets
document.addEventListener(
  "dragover",
  function(event) {
    event.preventDefault();

    if (event.target.id !== "" && event.target.id.endsWith('_item')){
      dragEnd = event.target;
      // log(event);
      log("dragover: " + dragEnd);
    }
  },
  false
);

document.addEventListener(
  "dragend",
  function(event) {
    log("dragend: " + event.target.id);
    event.target.style.opacity = "";      // reset the transparency
  },
  false
);

/*
document.addEventListener("dragenter", function(event) {
  log("dragenter: " + event.target.id);
  // log(event);
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

document.addEventListener(
  "drop",
  function(event) {
    event.preventDefault();
    //dragEnd = event.target.id  // Old buggy way
    log("### drop,  Source: " + dragStart.id + "  dest: " + dragEnd.id);
/*    log(
      "## From id: " +
        dragStart.id.split("_")[0] +
        " to id:" +
        dragEnd.id.split("_")[0]
    );
*/
    // prevent default action (open as link for some elements)
    log(event);
    
  // if( ! dragEnd.id.endsWith('_item')){
  //   return;
  // }

    swapArrayItems(dragStart.id, dragEnd.id);

    // move dragged elem to the selected drop target
    if (event.target.className == "dropzone") {
      event.target.style.background = "";
      dragStart.parentNode.removeChild(dragStart);
      event.target.appendChild(dragStart);
    }
  },
  false
);

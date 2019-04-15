let elementName = 'listText'; 
document.addEventListener("dragstart", function(event) {
    // The dataTransfer.setData() method sets the data type and the value of the dragged data
    event.dataTransfer.setData("Text", event.target.id);
    
    // Output some text when starting to drag the p element
//DEF    document.getElementById(elementName).innerHTML = "Started to drag the p element.";
    
    // Change the opacity of the draggable element
    event.target.style.opacity = "0.4";
  });
  
  // While dragging the p element, change the color of the output text
  document.addEventListener("drag", function(event) {
    document.getElementById(elementName).style.color = "red";
  });
  
  // when finished dragging, Output some text and reset the opacity
  document.addEventListener("dragend", function(event) {
//DEF    document.getElementById(elementName).innerHTML = "Finished dragging the p element.";
    event.target.style.opacity = "1";
  });
  
  // Events fired on the drop target
  
  // When the draggable p element enters the droptarget, change the DIVS's border style
  document.addEventListener("dragenter", function(event) {
    if ( event.target.className == "droptarget" ) {
      event.target.style.border = "3px dotted red";
    }
  });
  
  // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
  document.addEventListener("dragover", function(event) {
    event.preventDefault();
  });
  
  // When the draggable p element leaves the droptarget, reset the DIVS's border style
  document.addEventListener("dragleave", function(event) {
    if ( event.target.className == "droptarget" ) {
      event.target.style.border = "";
    }
  });
  
  
  // On drop - 
  document.addEventListener("drop", function(event) {
    // Prevent the browser default handling of the data (default is open as link on drop)
    event.preventDefault();
    if ( event.target.className == "droptarget" ) {
      // Reset the color of the output text and DIV's border color
      document.getElementById(elementName).style.color = "";
      event.target.style.border = "";
      // Get the dragged data with the dataTransfer.getData() method
      // The dragged data is the id of the dragged element ("drag1")
      let data = event.dataTransfer.getData("Text");
      // Append the dragged element into the drop element
      event.target.appendChild(document.getElementById(data));
  }
});
  
  
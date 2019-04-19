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




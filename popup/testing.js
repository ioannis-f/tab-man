function test(){
  test_CreateDuplicateWindow();
}
function test_CreateDuplicateWindow(){
  console.log(currentwindow_id + ' ' + typeof winlist);
  console.log(winlist);
  log("CurrentWindow id: " + currentwindow_id);
  
  let id_dup = 'dup-' + currentwindow_id;
  winlist[id_dup] = createNewWindow(id_dup, new Date());
  winlist[id_dup].list = winlist[currentwindow_id].list ;
  winlist[id_dup].open = false;

  createview();
  console.log(winlist);
}
function createNewWindow(id, createDay){
  // winlist['id' + id] = createNewWindow(id, new Date());
  return {
    'name': 'Window ' + id,
    'list': [],
    'viewid': 0,
    'checked': false,
    'colapse': true,
    'created_date': createDay,
    'lastchange_date': '',  // TBI
    'follow': true,         // TBI
    'backup': false,        // TBI
    'open': true,
    'visible': true         // visible/hidden/delete/backup  TBI
  };   
}





function readFromClipboard() {
  // Permission: "clipboard-read"
  navigator.clipboard.read().then((clipText) => {
      log("Read from clipboard: " + clipText);
      return clipText;
    })
    .catch((e) => {
      log("Error: " + e);
    });
}
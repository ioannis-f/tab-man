log(timestamp() + " Background started");

// Keep chrome compatible creating browser object
if (typeof browser != "object") {
  browser = chrome;
}

//browser.tabs.onUpdated.addListener(tabsSync); 
browser.tabs.onCreated.addListener(tabsSync);
browser.tabs.onRemoved.addListener(tabsSync);
browser.windows.onCreated.addListener(tabsSync);
browser.windows.onRemoved.addListener(tabsSync);

// tm should be declared with var not let
var tm = {};  // { "list":[] , "lastchange":new Date() , "_addarea":"" } ;
tabsSync();

log("Background Loop ended");


// ######### 
//clearStorage();
//loadFromStorage().then(function() {
  // if(findIdInList("100")){
  //   log(findIdInList("100")) ;
  // }

  //test_AddNewWindow(100);
  //saveToStorage();

  //log("### final: ");
  //log(tm);

//});



function tabsSync(){
  log("\n# Syncing: Loading Data");
  browser.storage.local.get("tabman", function (data) {
    // if there are stored data, load
    if (data["tabman"]) {
      //log(data);
      tm = data["tabman"];
      log(tm);
      checkStorageIntegrity(true);
      tabsSync_query();
      // ...otherwise, initialize storage
      } else {
        let tmp = { "list":[] , "lastchange":new Date() , "_addarea":"" } ;
        browser.storage.local.set({ "tabman": tmp }, function(){
          tm = tmp;
          log("# load: storage initialized:");
          log(tm);
          tabsSync_query();
        });
      };
  });
  return  new Promise(function(resolve, reject) {
    resolve("finished");
  });
}
function tabsSync_query() {
  //log("Syncing: query");
  //  disableFilterMode();
  // # Sync list from active tabs
  // CHROME
  browser.tabs.query( {}, function (tabs, error) {
    tabsSyncLoop(tabs);
    cleanupDuplicateTabs();
    saveToStorage();

  });
}

function tabsSyncLoop(tabs) {
  // set all windows open flag to false 
  log(tm);
  for (let i in tm.list) {
    if(typeof tm.list[i] =="undefined" || typeof tm.list[i] == null) {
      continue;
    }
    //log("tabsSyncLoop: " + i +"  " + typeof tm.list[i].id);
    tm.list[i].open = false;
  }

  for (let tab of tabs) {
    //log("# Tab: " + String(tab.windowId) + ": " +tab.url + " " +tab.title);
    
    let id = String(tab.windowId);
    let url = tab.url;
    
    let list = {};
    let ii = findPosById(id);
    //log("ii: " +ii +"  " +"id: " + id );
    //log(tm);
    // if window not exists add it
    if ( ii == "" ) {
      ii = 0 ;
      if(typeof tm.list != "undefined"){
        ii = tm.list.length;
      }
      tm.list[ii] = addNewWindow(id , "" , new Date());
    }
    // Initially erase tm.list[ii].urls (disable history recording)
    if (tm.list[ii].open == false){
      tm.list[ii].urls.length = 0 ;       
      tm.list[ii].TitlesAndUrls.length = 0 ;       
    }
    tm.list[ii].open = true ;
    //tm.list[ii].urls.push(url + " " +tab.title);      // old format
    tm.list[ii].urls.push(url);                         // new format
    tm.list[ii].TitlesAndUrls.push(url + " " + tab.title);
  }
  
  log("-----------------------------------------");
  log(tm);

}

function cleanupDuplicateTabs(){
/*  b.cleanupDuplicateTabs().then( function(ret){
    msg("test");
    createview();
    });  */
  log("### Cleanup Duplicates ##################");
  for( let i1 in tm.list ){
//    id1 = tm.list[ii].id;
    //log("Checking FirstDuplicateTab id: " + i1 +" ");
    let i2 = findFirstDuplicateTab(i1);
    if (i2 ){
      log("\n Found duplicates: " 
       + "\n " +i1 + " " + tm.list[i1].open +" " +tm.list[i1].created_date +" " 
       + "\n " +i2 + " " + tm.list[i2].open +" " +tm.list[i2].created_date);

      //if(tm.list[i1].created_date < tm.list[i2].created_date){  // keep the older
      if(tm.list[i2].open){ // keep the one that is closed
        tm.list[i1].id = tm.list[i2].id;
        tm.list[i1].open = true
        log("Removing i2: " + i2);
        tm.list.splice(i2, 1);
      }
      else{
        tm.list[i2].id = tm.list[i1].id;
        tm.list[i2].open = true
        log("Removing i1: " + i1);
        tm.list.splice(i1, 1);
      }

    /*
      if( tm.list[i1].open ){
        tm.list[i1].name = tm.list[i2].name;
        tm.list[i1].created_date = tm.list[i2].created_date;
        log("Removing i: " + tm.list[i2].id);
    //    tm.list.splice(i2, 1);
      }
      else if( tm.list[i2].open ){
        tm.list[i2].name = tm.list[i1].name;
        tm.list[i2].created_date = tm.list[i1].created_date;
        log("Removing i: " + tm.list[i1].id);
    //    tm.list.splice(i1, 1);
      }
      */
    
    }
  }
  log(tm);
  return  new Promise(function(resolve, reject) {
    resolve("finished");
  });

}
function findFirstDuplicateTab(i1){
  const list1_str = JSON.stringify(tm.list[i1].urls);

  for( let i2 in tm.list ){

// if(i1==0 && i2==1){
//   log(" Comparing " +i1 +" With: " + i2);
//   log(list1_str +"\n\n" +JSON.stringify(tm.list[i2].urls ));
// }
      
    // log(" Comparing " +i1 +" With: " + i2);
    const list2_str = JSON.stringify(tm.list[i2].urls);
    if ( (i1 != i2) && (list1_str == list2_str)){   // 
      log(" Duplicate, ids:" + tm.list[i1].id + " " +tm.list[i2].id +"  ii:" +i1 +" " +i2 );
      return i2;
    }
   }
   return false;
}
function test_AddDuplicateWindow(){   // *** BAD: it creates duplicate with the same object
  //use:  test_AddDuplicateWindow();
  for(let i1 in tm.list){
    if(typeof tm.list[i1] != "undefined"){
      let i2 = tm.list.length;
      log("# creating duplicate for ii: " + i1 +" , at: " +i2);
      // let temp = tm.list[i1];                // create duplicate
      // temp.open = false;
      // temp.id = "100";
      // temp.name = "100";

      tm.list[i2] = tm.list[i1].splice;    
      log(tm);
      log(temp);

      saveToStorage();
      return ;
    }
  }
}


// ### 
function findPosById(id){
  // let ii = findIdInList("100");
  // if( ii != "" ){}

  try {
    for (let i in tm.list){
      if( tm.list[i].id == id) {
        return i; 
      }
    }
  } catch (error) {}
      return "";
}

function checkStorageIntegrity(act){
  //use: checkStorageIntegrity(true);
  log("checking: Storage Integrity");
  //log(tm);

  if( typeof tm == "undefined"){
    return ;
  }
  if(typeof tm.list == "undefined"){
    log("# CORRUPTED: tm.list"); 
    return ;
  }
  for (let i in tm.list) {
//    log("###" + i + " " +()) ;
    if (typeof tm.list[i] == "undefined" || tm.list[i]== null){
      log("# CORRUPTED: tm.list[" +i +"]"); 
      if(act){
        log("# Removing: tm.list[" +i +"]"); 
        tm.list.splice(i,1);  // remove item in position
        saveToStorage();
      }
    }

  }
}



/*  STRUCTURE:
tm = {
    _addarea: "" , 
​    lastchange: "Date 2019-04-14T07:55:21.888Z" ,
    list: [ {id:"" , name:"" , urls:[] ... },
            {}, 
            {}
          ]
}
*/
function addNewWindow(id, name, createDay){
  //if(findIdInList(id)!=""){
  //  tm.list[wtm.list.length] = addNewWindow(id , new , new Date());
  //}
  return {
    "name": name,
    "id": id,
    "urls": [],
    "TitlesAndUrls": [],
    "checked": false,
    "colapse": true,
    "open": true,
    "visible": true,        // TBI: visible/hidden/delete/backup
    "created_date": createDay,
    "lastchange_date": "",  // TBI
  };   
}
   
function saveToStorage(){
  browser.storage.local.set({"tabman": tm}, function() {
    if (browser.runtime.lastError) {
      logerror("Error saving: " + browser.runtime.lastError);
    } else {
      log("Data Saved: pop-up");
    }
  });
}
async function clearStorage(){
  await browser.storage.local.remove("tabman");
  if (browser.runtime.lastError) {
    log(browser.runtime.lastError);
  } else {
//  b.tabsSync();
    tm = b.tm;
//  createview();
    msg("Cleared");
  }
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


function test_AddNewWindow(id){
  tm.list[tm.list.length] = addNewWindow(id , id + "new" , new Date());
  saveToStorage();
  log(tm);
}



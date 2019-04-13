log(timestamp() + ' Background started');

// Keep chrome compatible creating browser object
if (typeof browser != 'object') {
  browser = chrome;
}

//browser.tabs.onUpdated.addListener(tabsSync); 
browser.tabs.onCreated.addListener(tabsSync);
browser.tabs.onRemoved.addListener(tabsSync);
browser.windows.onCreated.addListener(tabsSync);
browser.windows.onRemoved.addListener(tabsSync);


log('Background Loop ended');

// ### NEW ###############################
var tm = {};  // { 'list':[] , 'lastchange':new Date() , '_addarea':'' } ;
tabsSync();


// ######### 
//clearStorage();
//loadFromStorage().then(function() {
  // if(findIdInList('100')){
  //   log(findIdInList('100')) ;
  // }

  //test_AddNewWindow(100);
  //saveToStorage();

  //log('### final: ');
  //log(tm);

//});

/*
function tabsSync(){
  log('\n# tabsSync: start');
  
  loadFromStorage(function(){
    log('AAAAAAAAAAAAAAAa');
    log('Loaded: ');
    log(tm);
    browser.tabs.query({}, function(tabs){
      log(tabs);
      tabsSyncLoop(tabs);
      saveToStorage();
    });
  });
  return new Promise(function(resolve, reject) {
    resolve("finished");
  });
}
function loadFromStorage(){
  log('# load: Start');
  browser.storage.local.get('tabman', function(data){
    // if there are stored data, load
    if (data['tabman']) {
      tm = data['tabman'];
      log('# load: storage loaded');
    } else {
      let tmp = { 'list':[] , 'lastchange':new Date() , '_addarea':'' } ;
      browser.storage.local.set({ 'tabman': tmp }, function(){
        tm = tmp;
        log('# load: storage initialized');
      })
    };
    log('# load: Exiting');
    return new Promise(function(resolve, reject) {
      resolve("loaded");
    });
  
  });
}
*/

function tabsSync() {
  log('\n# Syncing: Loading Data');
  browser.storage.local.get("tabman", function (data) {
    // if there are stored data, load
    if (data['tabman']) {
      //log(data);
      tm = data['tabman'];
      log(tm);
      // ...otherwise, initialize storage
      } else {
        let tmp = { 'list':[] , 'lastchange':new Date() , '_addarea':'' } ;
        browser.storage.local.set({ 'tabman': tmp }, function(){
          tm = tmp;
          log('# load: storage initialized');
        })
      };

    tabsSync_query();
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
    //cleanupDuplicateTabs();
    saveToStorage();

  });
}

function tabsSyncLoop(tabs) {
  // set all windows open flag to false 
  for (let i in tm.list) {
    tm.list[i].open = false ;
  }
  for (let tab of tabs) {
    //log('# Tab: ' + String(tab.windowId) + ': ' +tab.url + ' ' +tab.title);
    
    let id = String(tab.windowId);
    let url = tab.url;
    
    let list = {};
    let ii = findPosById(id);

    //log('ii: ' +ii +'  ' +'id: ' + id );
    //log(tm);
    // if window not exists add it
    if ( ii == '' ) {
      ii = 0 ;
      if(typeof tm.list != 'undefined'){
        ii = tm.list.length;
      }
      tm.list[ii] = addNewWindow(id , id , new Date());
    }
    
    // Initially erase tm.list[ii].urls (disable history recording)
    if (tm.list[ii].open == false){
      tm.list[ii].urls.length = 0 ;       
    }
    tm.list[ii].open = true ;
    tm.list[ii].urls.push(url + ' ' +tab.title);               // Add link to list
  }
  
  log('-----------------------------------------');
  log(tm);

}

function cleanupDuplicateTabs(){
  log("### Cleanup Duplicates ##################");
  for( let ii in tm.list ){
    id1 = tm.list[ii].id;
    //log('Checking FirstDuplicateTab id: ' + id1 +' ');
    let id2 = findFirstDuplicateTab(id1);
    if (id2 ){
      log('\n Found duplicates: ' + id1 + ' ' + tm.list[id1].open + ' ' +id2 +' ' + tm.list[id2].open);
      if( tm.list[id1].open ){
        tm.list[id1].name = tm.list[id2].name;
        tm.list[id1].created_date = tm.list[id2].created_date;
        log('Removing: ' + id2);
        delete tm.list[id2];
      }
      else if( tm.list[id2].open ){
        tm.list[id2].name = tm.list[id1].name;
        tm.list[id2].created_date = tm.list[id1].created_date;
        log('Removing: ' + id1);
        delete tm.list[id1];
      }
    }
  }
  // return  new Promise(function(resolve, reject) {
  //   resolve("finished");
  // });
}
function findFirstDuplicateTab(id1){
  if(typeof tm.list[id1].urls == 'undefined'){ 
    return; 
  }
  const list11_str = JSON.stringify(tm.list[id1].urls);

  for( let i in tm.list ){
    id2 = tm.list[i].id;
    const list2_str = JSON.stringify(tm.list[id2].urls);
    if ( (id1 != id2) && (list11_str == list2_str)){   // 
      log('Found: ' + id1 + ' ' + list1_str + ' ' +id2 +' ' + list2_str);

      return id2;
    }
   }
   return false;
}


// ### 
function findPosById(id){
  // let ii = findIdInList('100');
  // if( ii != '' ){}
  for (let i in tm.list){
    if( tm.list[i].id == id) {
      return i; 
    }
  }
    return '';
}

function addNewWindow(id, name, createDay){
  //if(!findIdInList(id)){
  //  tm.list[wtm.list.length] = addNewWindow(id , new , new Date());
  //}

  if(findPosById(id)){
    return '';
  }
  return {
    'name': name,
    'id': id,
    'urls': [],
    'checked': false,
    'colapse': true,
    'open': true,
    'visible': true,        // TBI: visible/hidden/delete/backup
    'created_date': createDay,
    'lastchange_date': '',  // TBI
  };   
}

function saveToStorage(){
  browser.storage.local.set({'tabman': tm}, function() {
    if (browser.runtime.lastError) {
      logerror('Error saving: ' + browser.runtime.lastError);
    } else {
      log('Data Saved: pop-up');
    }
  });
}
function checkStorageIntegrity(){
  if(typeof tm.list == 'undefined'){
    return 'Sorage Corrupted';
  }
}
async function clearStorage(){
  await browser.storage.local.remove('tabman');
  if (browser.runtime.lastError) {
    log(browser.runtime.lastError);
  } else {
//  b.tabsSync();
    tm = b.tm;
//  createview();
    msg('Cleared');
  }
}


function timestamp() {
  let x = new Date();
  return x.toISOString().split('-').join('')
  .split('T').join(' ').split(':').join('')
  //.split('.')[0] 
  + ' ';
}
function log(str){
  console.log(str);
}
function logerror(str){
    console.log('Error: ' + str);
}
function onError(error) {
    console.log(`Error: ${error}`);
}



function test_AddNewWindow(id){
  tm.list[tm.list.length] = addNewWindow(id , id + 'new' , new Date());
  saveToStorage();
  log(tm);
}
function test_AddDuplicateWindow(id){
}



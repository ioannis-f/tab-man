log(timestamp() + ' Background started');

// Keep chrome compatible creating browser object
if (typeof browser != 'object') {
  browser = chrome;
}

var winlist;

//browser.tabs.onUpdated.addListener(tabsSync); 

browser.tabs.onCreated.addListener(tabsSync);
browser.tabs.onRemoved.addListener(tabsSync);
browser.windows.onCreated.addListener(tabsSync);
browser.windows.onRemoved.addListener(tabsSync);



tabsSync();

log('Background Loop ended');

// ######### 

function tabsSync() {
  log('\n# Syncing: Loading Data');
  //browser.storage.local.get().then(function(data){  // FIREFOX (NEW) 
  browser.storage.local.get("store", function (data) { // CHROME(OLD) COMPATIBLE
    // if there are stored data, load
    if (data.store) {
      //log(data);
      winlist = data['store']; // data.store;
      log(winlist);
      // ...otherwise, initialize storage
    } else {
      var initial = {
        'viewid':[],
        '_addarea':""
      }; // Object.create(null); 

      browser.storage.local.set({
        'store': initial
      });
      winlist = initial;
    };
    tabsSync_query();
  })
  //.catch(()=> { log("Error loading");})
  ;
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
    tabsSync_Loop(tabs);
  }
  );
  // FIREFOX
  //browser.tabs.query({}).then(function (tabs) {tabsSync_Loop(tabs)});
}
function tabsSync_Loop(tabs) { 
  //log("Syncing: loop");

  for (const id of Object.keys(winlist)) {
    //log( id + ' ' + winlist[id]);
    winlist[id].open = false ;
  }
  for (let tab of tabs) {
    //log('####### id' + String(tab.windowId) + ': ' +tab.url + ' ' +tab.title);
    
    let id = String(tab.windowId);
    let url = tab.url;

    let list = {};
    if (typeof winlist['id' + id] == 'undefined') {
      winlist['id' + id] = createNewWindow(id, new Date());
    }

/*  
log('viewid:  ' + winlist['viewid']);
for (let key in winlist['viewid']) {     // winlist
  item = winlist['viewid'][key];
  log(key + ' ' + item);
} 
*/
    if (winlist['viewid'].indexOf('id' + id) == -1){
      log('# Adding viewid item: ' + ('id' + id) );
      //winlist['viewid'] = [('id' + id), ...winlist['viewid']];  // Add to the beggining of view array
      winlist['viewid'].push('id' + id) ;       // Add to the end of view array
      log('### Viewid: ' + winlist['viewid']); 
    }

    // Initially erase winlist.id.list (disable history recording)
    if (winlist['id' + id].open == false){
      winlist['id' + id].list.length = 0 ;       // BAD
 //     log('##############  ' + 'id' + id + '   ' + typeof winlist['id' + id].list);
      log(winlist['id' + id].list);
    }

    winlist['id' + id].open = true ;
    winlist['id' + id].list.push(url + ' ' +tab.title);               // Add link to list
    //log('id' + id + ': ' +url + ' ' +tab.title);
  }

  cleanupDuplicateTabs();

  // Save to storage
  browser.storage.local.set({"store": winlist}, function() {
      if (browser.runtime.lastError) {
      logerror('Error saving: ' +browser.runtime.lastError);
      } else {
          log('Data Saved: back');
      }
  });

}

function cleanupDuplicateTabs(){
  log("### Cleanup Duplicates");

  for (let id1 of Object.keys(winlist)) {
    let id2 = findFirstDuplicateTab(id1);
    if (id2 ){
      log('\n Found duplicates: ' + id1 + ' ' + winlist[id1].open + ' ' +id2 +' ' + winlist[id2].open);
      if( winlist[id1].open ){
        winlist[id1].name = winlist[id2].name;
        winlist[id1].created_date = winlist[id2].created_date;
        log('Removing: ' + id2);
        delete winlist[id2];
      }
      else if( winlist[id2].open ){
        winlist[id2].name = winlist[id1].name;
        winlist[id2].created_date = winlist[id1].created_date;
        log('Removing: ' + id1);
        delete winlist[id1];
      }
    }
  }
  return  new Promise(function(resolve, reject) {
    resolve("finished");
  });
  //createview();
}
function findFirstDuplicateTab(id1){
//  log('findFirstDuplicateTab for: ' + id1 +' ');
  if(typeof winlist[id1].list == 'undefined'){ return; }
  const list11_str = JSON.stringify(winlist[id1].list);
  for (let id2 of Object.keys(winlist)) {
    if (id1=='id197' && id2=='id318'){
     log('checking: ' + (winlist[id1].list == winlist[id2].list) 
     +'\n\n' + winlist[id1].list 
     + '\n\n' + winlist[id2].list);
  }
    const list2_str = JSON.stringify(winlist[id2].list);
    if ( (id1 != id2) && (list11_str == list2_str)){   // 
      log('Found: ' + id1 + ' ' + list1_str + ' ' +id2 +' ' + list2_str);
      return id2;
    }
   }
   return false;
}


function createNewWindow(id, createDay){
  // winlist['id' + id] = createNewWindow(id, new Date());
  return {
    'name': id,
    'list': [],
    'checked': false,
    'colapse': true,
    'created_date': createDay,
    'lastchange_date': '',  // TBI
    // 'follow': true,         // TBI
    // 'backup': false,        // TBI
    'open': true,
    'visible': true   // visible/hidden/delete/backup  TBI
  };   
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
function onError(error) {
    console.log(`Error: ${error}`);
}


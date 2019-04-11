console.log("view.js started");


// ### VIEW ####################################
function createview() {
    chrome.windows.getCurrent(getCurrentWindow_callback);
}
function getCurrentWindow_callback(window){
    currentwindow_id = 'id' + window.id ;
    log('getCurrent_callback');
    createview_main();
}
function createview_main() {
    log("Creating view");
  
    winlist = b.winlist;
    log('winlist fetched: ');
    log(winlist);
    
    // Single window line placeholder
    var windowPHolder = ' \
      <div class="browser-style boxLeft" draggable="true" > \
        <input type="checkbox" id="IDX_check" value="checked" CHECKEDVALUE> \
        <input type="text" id="IDX_name" class="nameInput" style="color:red" value="NAME"> \
        <button class="browser-style" id="IDX_collapse">▼</button> \
        <button class="browser-style" id="IDX_Show">Show</button> \
        <div class="boxRight"> \
            TABSQTY \
            <button class="browser-style" id="IDX_remove"  style="visibility:REMOVE_VISIBLE">x</button> \
        </div> \
      </div> \
      <div id="IDX_Text"  style="display:none">LIST</div> \
    ';
// <button class="browser-style" id="IDX_moveup">↑</button> \
// <button class="browser-style" id="IDX_movedown">↓</button> \
// <button class="browser-style" id="IDX_clipcopy">Copy</button> \
  
    let win = '';
    let output = '';
    // Print using viewid
    log('# view.js: Viewid  ' + winlist['viewid']);
    for (let key in winlist['viewid']) {
      item = winlist['viewid'][key];
      // print without using viewid
      //for (let item in winlist) {  
      if (typeof winlist[item] == 'undefined' || typeof winlist[item].list == 'undefined'){
        continue;
      }      
      try {

        //log( "# Printing: " + item + ' ' + typeof winlist[item] );
        //let id = 'id' + winlist[item].windowid;  // CHECK IF THIS IS OK
        let id = item ;
        let list = listToUrllist(id, 'html', 66);
        let tabsqty = winlist[id].list.length ;

        // add window id number
        win = windowPHolder.split('IDX').join(id);
        
        // Add tabs quantity
        win = win.split('TABSQTY').join( tabsqty +' Tabs' );

        // add url items
        win = win.split('LIST').join( list );
        // add window name
        win = win.split('NAME').join( winlist[id].name );
        // highlight current window
        
        //log( 'IDs: ' +id +' ' + currentwindow_id)
        if( id != currentwindow_id){
          win = win.split('style="color:red"').join( '' );  
        }
        // If window is open: Hide "x" button
        if( (winlist[id].open) ){
          win = win.split('REMOVE_VISIBLE').join('hidden');  
        }
        // If window is closed: Change Show button to Open and show "x" button
        if( !(winlist[id].open) ){
          win = win.split('Show').join('Open');  
          win = win.split('REMOVE_VISIBLE').join('visible');  
        }
        // set checkbox status
        if (winlist[id].checked){
          win = win.split('CHECKEDVALUE').join( 'checked' );
        }
        // finally add row to total
        if(winlist[id].visible){
          output = output + win;
        }
      } catch (error) {
        log("ERROR 01: " +item +' ' + error );
      }
    }
    //log("Finished creating view");
    listText.innerHTML = output;
    setEventListeners();
  }
  
  function listToUrllist(id, mode, titleChars){
    // let list = listToUrllist('id5', 'text', 80); 
    //   titleChars: (if 0 then keep full title)
    //   mode: text , html, url
    let list = '';
  
    for (let key in winlist[id].list){
      let item = winlist[id].list[key].split(' ');
      let url = item[0];
      item.shift();
      let title = item.join(' ');
      //log('ITEM: ' + key +'  ' + url + '  ' + title)    
      
      if (titleChars && title.length > titleChars){
        title = title.slice(0, titleChars) +' ...';
      }
      if (mode == 'html'){
        list += '  <a href="' + url + '">' + title  + '</a><br>\n' ;
      }
      else if (mode == 'url') {                   // url
        list = list + ' ' + url ;
      }
      else {
        list += '  ' + title +'  (' +url + ')\n' ;  // text mode
      }
    }
  
    return list;
  }
  
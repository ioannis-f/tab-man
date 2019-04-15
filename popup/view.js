console.log("view.js started");


function createview() {
    chrome.windows.getCurrent(function(){
      currentwindow_id = window.id ;
      log("getCurrent_callback");
      createview_main();
    });
}
function createview_main() {
    log("Creating view");
  
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
  
    let win = "";
    let output = "";
    let ii ;
    for (ii in tm.list) {  
      if (typeof tm.list[ii] == "undefined" || typeof tm.list[ii].urls == "undefined"){
        continue;
      }      
      try {
        log("### Printing 01: ii " + ii + " " + tm.list[ii].id);
        
        let id = tm.list[ii].id;
        let urls = joinUrls(ii, "html", 66);
        let tabsqty = tm.list[ii].urls.length ;
        //log("### Printing 02: id: " + id + "  urls: " )
        // add window id number
        win = windowPHolder.split("IDX").join(id);
        
        // Add tabs quantity
        win = win.split("TABSQTY").join( tabsqty +" Tabs" );
        
        // add url items
        win = win.split("LIST").join( urls );
        // add window name
        win = win.split("NAME").join( tm.list[ii].name );
        // highlight current window
        
        //log( "IDs: " +id +" " + currentwindow_id)
        if( id != currentwindow_id){
          win = win.split('style="color:red"').join( "" );  
        }
        // If window is open: Hide "x" button
        if( (tm.list[ii].open) ){
          win = win.split("REMOVE_VISIBLE").join("hidden");  
        }
        // If window is closed: Change Show button to Open and show "x" button
        if( !(tm.list[ii].open) ){
          win = win.split("Show").join("Open");  
          win = win.split("REMOVE_VISIBLE").join("visible");  
        }
        // set checkbox status
        if (tm.list[ii].checked){
          win = win.split("CHECKEDVALUE").join( "checked" );
        }
        // finally add row to total
        if(tm.list[ii].visible){
          output = output + win;
        }
      } catch (error) {
        log("ERROR 01: " +tm.list[ii] +" " + error );
      }
    }
    //log("Finished creating view");
    //output = '<div ondragover="allowDrop" ondrop="drop(event)" > ' + output +'</div>' ;
    listText.innerHTML = output;
    setEventListeners();
  }

  function joinUrls(ii, mode, titleChars){
    //let urls = joinUrls(ii, "html", 66);
    //  titleChars: (if 0 then keep full title)
    //  mode: text , html, url
    let urls = "";
    for (let key in tm.list[ii].urls){
      let item = tm.list[ii].urls[key].split(" ");
      let url = item[0];
      item.shift();
      let title = item.join(" ");
      //log("ITEM: " + key +"  " + url + "  " + title)    
      
      if (titleChars && title.length > titleChars){
        title = title.slice(0, titleChars) +" ...";
      }
      if (mode == "html"){
        urls += '  <a href="' + url + '">' + title  + '</a><br>\n' ;  //SINGLE QUOTES
      }
      else if (mode == "url") {                   // url
        urls = urls + " " + url ;
      }
      else {
        urls += "  " + title +"  (" +url + ")\n" ;  // text mode
      }
    }
  
    return urls;
  }
  
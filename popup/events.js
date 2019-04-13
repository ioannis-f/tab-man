console.log("events.js started");
var b = browser.extension.getBackgroundPage();

function setEventListeners() {
    // onclick event listener
    window.onclick = onclick_callback ;
    function onclick_callback(event) {

      let tmp_ar = event.target.id.split('_');
      let id = tmp_ar[0];
      let cmd = tmp_ar[1];
      let ii = b.findIdInList(id);
      log('click cmd:' + cmd + '  id:' + id);
  
      switch (cmd) {
      
        // Menu
        case 'check':
        tm.list[ii].checked = 
          document.getElementById(id +'_check').checked;
        b.saveToStorage();  // Save to storage
        break;
        
        case 'checkalltoggle':
        if( document.getElementById('_checkall').checked ){
          bulkSelect();
        }
        else{
          bulkUnSelect();
        }
        b.saveToStorage();  // Save to storage
        createview();
        break;
  
        case 'bulkselect':
        bulkSelect();
        b.saveToStorage();  // Save to storage
        createview();
        break;

        case 'bulkunselect':
        bulkUnSelect();
        b.saveToStorage();  // Save to storage
        createview();
        break;

        function bulkSelect(){
          for (let ii in tm.list){
            if(tm.list[ii].visible){
              tm.list[ii].checked = true;
            } 
          }
        }
        function bulkUnSelect(){
          for (let ii in tm.list){
            if(tm.list[ii].visible){
              tm.list[ii].checked = false;
            } 
          }
        }       

        // General menu
        case 'remove':
        if (1 == 1){       // Delete item
            msg('Deleted');
            delete tm.list[ii];
        }
        else {             // Hide item
            tm.list[ii].visible = false;
            tm.list[ii].checked = false;
            msg('Changed to hidden');
        }
        b.saveToStorage();  // Save to storage
        createview();
        break;
  
        case 'bulkremove':
        for (let ii in tm.list){
          if(tm.list[ii].visible && tm.list[ii].checked){
            tm.list[ii].visible = false;
            tm.list[ii].checked = false;
            msg('Changed to hidden');
            }
        }
        msg('Hidden');
        b.saveToStorage();  // Save to storage
        createview();
        break;


        case 'clipcopy':
        saveToClipboard(joinUrls(ii, 'text', 0));
        msg('Copied to clipboard');
        break;
  
        case 'bulkclipcopy':
        let output ="";
        for (let ii in tm.list){
          if(tm.list[ii].visible && tm.list[ii].checked){
  
            log('ID: ' +id +' | ' + tm.list[ii].visible +' | ' +tm.list[ii].checked);
            output += tm.list[ii].name +'\n';
            output += joinUrls(ii, 'text', 0);
            output += '\n';
          }
        }
        saveToClipboard(output);
        msg('bulk clip copy');
        break;
    

        case 'inpage':                          
        //openNewWindow("page.html");
        openNewTabs("/popup/page.html");        // /popup/page.html"
        msg('List opened in new Tab');
        break;
  
        // show or hide pastearea
        case 'pasteareashow':
          x = document.getElementById('_pastearea');
          //let y = document.getElementById('_paste');
          if (x.style.display === "block") {
            x.style.display = "none";
            //y.innerHTML = 'Paste ▼';
          }
          else {
            x.style.display = "block";
            document.getElementById('_pastearea_txt').innerText = tm['_addarea'];
            //y.innerHTML = 'Done ▲';
          } 
        break;
  
        case 'pastenow':
        var x = document.getElementById('_pastearea');
        let res =  grabUrlsFromString(x.innerText);
        x.innerText = res.join('\n');
        openNewWindow(res);
        break;
  

        // Item menu
        case 'collapse':
        toggleCollapse(id);
        break;
  
        case 'Show':
        x = parseInt(id.replace('id','') );
        browser.windows.update(x, { focused:true });
        break;
  
        case 'Open':
        // create array with urls to open
        let urls = joinUrls(ii, 'url', 0);
        log(urls)
        for (let i in urls){ 
            if(urls[i] == "about:newtab" || urls[i] == "chrome://newtab/"){
                delete urls[i];
            }
         }
        urls = urls.trim().split(' ');          // convert to array
        log("Open urls: " +urls)
        openNewWindow(urls);  // ASDF
        break;

        
        case 'moveup':
        moveItemUp (id);
        b.saveToStorage();  // Save to storage
        createview();
        break;

        case 'movedown':
        moveItemDown (id);
        b.saveToStorage();  // Save to storage
        createview();
        break;


        case 'bulkmoveup':
        wlen = tm.list.length;
        for(let id = wlen; id >= 0; id-- ){
        //for (let ii in tm.list){
          log(id + ' ' + tm.list[ii]);
          if(tm.list[ii].visible && tm.list[ii].checked){
            moveItemUp (id);
            }
        }
        b.saveToStorage();  // Save to storage
        createview();
        break;

        case 'bulkmovedown':
        wlen = tm.list.length;
        for(let id = wlen; id >= 0; id-- ){
        //for (let ii in tm.list){
          if(tm.list[ii].visible && tm.list[ii].checked){
            moveItemDown (id);
            }
        }
        b.saveToStorage();  // Save to storage
        createview();
        break;

function moveItemUp (id){
  pos1 = findInViewid (id);
  if (pos1 == 0) { return }
  pos2 = parseInt(pos1, 10) - 1 ;
  temp = tm.list['viewid'][pos2]; 
  tm.list['viewid'][pos2] = tm.list['viewid'][pos1];
  tm.list['viewid'][pos1] = temp;
}
function moveItemDown (id){
  pos1 = findInViewid (id);
  if (pos1 == (tm.list['viewid'].length-1) ) { return }
  pos2 = parseInt(pos1, 10) + 1 ;
  temp = tm.list['viewid'][pos2]; 
  tm.list['viewid'][pos2] = tm.list['viewid'][pos1];
  tm.list['viewid'][pos1] = temp;
}
function findInViewid (id){
  for (let item in tm.list['viewid']) {
    if (tm.list['viewid'][item] == id){return item;}
  }
}
// function findInWinlist (id){
//   for (let item in tm.list) {
//     if (tm.list[item] == id){ return item; }
//   }
// }

        // Testing buttons
        case 'dedup':
        b.tabsSync().then( function(ret){ 
/*          b.cleanupDuplicateTabs().then( function(ret){
              msg('test');
              createview();
              });
*/          });
        break;
        
        case 'test':
        // Run unittests
        //unittests();
        break;

 
              



        case 'sort':
          winlistSort();
        break;
  
        case 'clean':
        browser.storage.local.remove('store', function() {
          if (browser.runtime.lastError) {
            log(browser.runtime.lastError);
          } else {
            b.tabsSync();
            tm = b.tm;
            createview();
            msg('Cleared');
          }
        });
        break;
  
        default:
          break;
      }
  
    }
  
    //  Submit listener
    //window.oninput(oninput_callback);
    //function oninput_callback(event) {
    //  log('submit: ' + event.target.value);
    //}
  
    //  Text 'enter' key listener 
    document.addEventListener("keypress", 
        (event) => { 
            if (event.keyCode == 13) {
                //event.preventDefault();
                nameChange(event);
            }
        }
    );
    // onlostfocus listener
    // document.addEventListener("focusout", nameChange);
    function nameChange(event) {
        tmp_ar = event.target.id.split('_');
        if (!(tmp_ar.length)) {
          return;
        }
        id = tmp_ar[0];
        cmd = tmp_ar[1];
        log('keypress (enter):  id:' + id + ' cmd:' + cmd );
  
        switch (cmd) {

          case "pastearea" : 
            let str = event.target.innerText;
            //log(str);
            tm['_addarea'] = str;
            b.saveToStorage();  // Save to storage
            //let res = grabUrlsFromString(str);
            //log(res);
            break;
  
          default:
            tm.list[ii].name = event.target.value;
            msg('Window title changed');
            b.saveToStorage();  // Save to storage
          break;
        }
  



// ### Drag n drop
window.addEventListener("dragstart", ondrag_callback);
window.addEventListener("drag", ondrag_callback);
window.addEventListener("dragenter", ondrag_callback);
function ondrag_callback(event){
    msg('Drag n drop ' + event);
}
document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

    }
}
  
    
// Open new window
function openNewWindow(urls){
    var creating = browser.windows.create({ url: urls });
}
// Open new tabs
function openNewTabs(urls){
    var creating = browser.tabs.create({ url: urls });
}
function toggleCollapse(idspec) {
    var x = document.getElementById(idspec + '_Text');
    var btn = document.getElementById(idspec + '_collapse');
    
    if (x.style.display === "none") {
        x.style.display = "block";
        btn.innerHTML = '▲';
    } else {
        x.style.display = "none";
        btn.innerHTML = '▼';
    }
}
function saveToClipboard(newClip) {
    // updateClipboard("Clipboard Test");
    // Permision: "clipboard-write"
    navigator.clipboard.writeText(newClip).then(function () {
        /* clipboard successfully set */
    }, function () {
        msg('clipboard write failed');
    });
}
function grabUrlsFromString(str){
    // let res = grabUrlsFromString(str);
  /*
  str = " \
  regexbuddy.com \
  www.regexbuddy.com \
  aa   http://regexbuddy.com \
  dds http://www.regexbuddy.com \
  href="http://www.regexbuddy.com/" \
  http://www.regexbuddy.com/index.html \
  dds  http://www.regexbuddy.com/index.html?source=library \
  sddf http://www.regexbuddy.com/download.html. dfsdf \
  www.domain.com/quoted \
  http://10.2.2.1.2/ttxx/txt/gg \
  ";
  */
  // ***  var re = /(https?):\/\/(www\.)?[a-z0-9\.:].*?(?=\s)/gi;
  var re =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  
  return str.match(re);
}
  
function grabUrlsFromString2(str) {
    var re =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return str.replace(re, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    });
}
      

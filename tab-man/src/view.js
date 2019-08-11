console.log("view.js started");
let activeWindowStyling = 'style="color:red; background-color:black; border: 1px solid;"';

function createview(scrollToCurrent) {
  scrollToCurrent =
    typeof scrollToCurrent !== "undefined" ? scrollToCurrent : false;
  browser.windows.getCurrent(function(window) {
    currentWindowId = window.id;
    createView_list(scrollToCurrent);
  });
}

function createView_list(scrollToCurrent) {
  scrollToCurrent =
    typeof scrollToCurrent !== "undefined" ? scrollToCurrent : false;
  log("Creating view");

  // Single window line placeholder
  let windowPHolder =
    ' \
      <div class="browser-style boxLeft" id="IDX_item" draggable="true"  ACTIVEWINDOW > \
        <input type="checkbox" id="IDX_selecttoggle" value="checked" CHECKEDVALUE> \
        <input type="text" id="IDX" class="nameInput" value="NAME" placeholder="Enter name Here!!"> \
        <button class="browser-style" id="IDX_collapse">▼</button> \
        <button class="browser-style" id="IDX_Show">Show</button> \
        <button class="browser-style" id="IDX_clipcopy">Copy</button> \
        <div class="boxRight"> \
            TABSQTY \
            <button class="browser-style" id="IDX_remove"  style="visibility:REMOVE_VISIBLE">x</button> \
        </div> \
      </div> \
      <div id="IDX_Text"  style="display:none; font-size:75%">LIST</div> \
    ';
  // <button class="browser-style" id="IDX_moveup">↑</button> \
  // <button class="browser-style" id="IDX_movedown">↓</button> \
  // <button class="browser-style" id="IDX_clipcopy">Copy</button> \

  let win = "";
  let output = "";
  let ii;
  for (ii in tm.list) {
// log(ii);
//     if (
//       typeof tm.list[ii] == "undefined" ||
//       typeof tm.list[ii].urls == "undefined"
//     ) {
//       continue;
//     }

    // try {
    //   let tmp = typeof tm.list[ii].urls;
    // } catch (error) {
    //   log("ERROR 01: " + tm.list[ii] + " " + error);
    //   continue;
    // }
  
    try {
      //log("### Printing 01: ii " + ii + " " + tm.list[ii].id);

//let tmp = typeof tm.list[ii].urls;


      let id = tm.list[ii].id;
      let urls = joinUrls(ii, "html", 66);
      let tabsqty = tm.list[ii].urls.length;
      //log("### Printing 02: id: " + id + "  urls: " )
      // add window id number
      win = windowPHolder.split("IDX").join(id);

      // Add tabs quantity
      win = win.split("TABSQTY").join(tabsqty + " Tabs");

      //log( "IDs: " +id +" " + currentWindowId)
      if (id == currentWindowId) {
        win = win.split('ACTIVEWINDOW').join(activeWindowStyling);
      }
      else {
        win = win.split('ACTIVEWINDOW').join('');
      }
      // If window is open: Hide "x" button
      if (tm.list[ii].open) {
        win = win.split("REMOVE_VISIBLE").join("hidden");
      }
      // If window is closed: Change Show button to Open and show "x" button
      if (!tm.list[ii].open) {
        win = win.split("Show").join("Open");
        win = win.split("REMOVE_VISIBLE").join("visible");
      }
      // set checkbox status
      if (tm.list[ii].checked) {
        win = win.split("CHECKEDVALUE").join("checked");
      }
      // add url items
      win = win.split("LIST").join(urls);
      // add window name
      win = win.split("NAME").join(tm.list[ii].name);
      // highlight current window

      // finally add row to total
      if (tm.list[ii].visible) {
        output = output + win;
      }
    } catch (error) {
      log("ERROR 01: " + tm.list[ii] + " " + error);
      b.checkStorageIntegrity(true);
    }
  }
  //log("Finished creating view");
  //output = '<div ondragover="allowDrop" ondrop="drop(event)" > ' + output +'</div>' ;

  // The content used to set the following innerHTML is not user defined thus is not vulnerable.
  listText.innerHTML = output;  
  setEventListeners();

  // # Jump to current's window line using id
  if (scrollToCurrent) {
    var elmnt = document.getElementById(currentWindowId + "_item");
    //ASDF elmnt.scrollIntoView();
  }
}

/*
// joinUrls OLD 
function joinUrlsOLD(ii, mode, titleChars) {
  //let urls = joinUrls(ii, "html", 66);
  //  titleChars: (if 0 then keep full title)
  //  mode: text , html, url
  let urls = "";
  for (let key in tm.list[ii].urls) {
    let item = tm.list[ii].urls[key].split(" ");
    let url = item[0];
    item.shift();
    let title = item.join(" ");
    //log("ITEM: " + key +"  " + url + "  " + title)

    if (titleChars && title.length > titleChars) {
      title = title.slice(0, titleChars) + " ...";
    }
    if (mode == "html") {
      urls += '  <a href="' + url + '">' + title + "</a><br>\n"; //SINGLE QUOTES
    } else if (mode == "url") {
      // url
      urls = urls + " " + url;
    } else {
      urls += "  " + title + "  (" + url + ")\n"; // text mode
    }
  }

  return urls;
}
*/

function joinUrls(ii, mode, titleChars) {
  // This function creates a list of links with lenght of the title set to titleChars 
  //let urls = joinUrls(ii, "html", 66);
  //  titleChars: (if 0 then keep full title)
  //  mode: text , html, url
  let urls = "";
  for (let key in tm.list[ii].TitlesAndUrls) {
    let item = tm.list[ii].TitlesAndUrls[key].split(" ");
    let url = item[0];
    item.shift();
    let title = item.join(" ");
    //log("ITEM: " + key +"  " + url + "  " + title)

    if (titleChars && title.length > titleChars) {
      title = title.slice(0, titleChars) + " ...";
    }
    if (mode == "html") {
      urls += '  <a href="' + url + '">' + title + "</a><br>\n"; //SINGLE QUOTES
    } else if (mode == "url") {
      // url
      urls = urls + " " + url;
    } else {
      urls += "  " + title + "  (" + url + ")\n"; // text mode
    }
  }

  return urls;
}

log("paste.js: Started");

// Keep chrome compatible creating browser object
if (typeof browser != "object") {
  browser = chrome;
}

// Access background.js
let b = browser.extension.getBackgroundPage();
let tm = b.tm;
let currentWindowId;

setEventListeners();

function grabUrlsFromString(str) {
  // let res = grabUrlsFromString(str);
  /*  Working Examples:
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
  // ***  let re = /(https?):\/\/(www\.)?[a-z0-9\.:].*?(?=\s)/gi;
  let re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  return str.match(re);
}

function grabUrlsFromString2(str) {
  let re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return str.replace(re, function(url) {
    return '<a href="' + url + '">' + url + "</a>"; // SINGLE QUOTES
  });
}

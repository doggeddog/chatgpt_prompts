// ==UserScript==
// @name         ChatGPT prompts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  awesome chatGPT prompts
// @author       doggeddog
// @resource     IMPORTED_CSS https://github.com/doggeddog/tribute/raw/master/dist/tribute.css
// @resource     jsonData https://github.com/doggeddog/chatgpt_prompts/raw/master/prompts.json
// @require      https://github.com/doggeddog/tribute/raw/master/dist/tribute.js
// @match        https://waaao.com/*
// @match        http://127.0.0.1:*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

var jsonData = JSON.parse(GM_getResourceText("jsonData"));
var textArea

function load() {
  textArea = document.getElementsByTagName("textarea")[0];
  var tribute = new Tribute({
    trigger: '/',
    values: jsonData,
    selectTemplate: function (item) {
      if (typeof item === "undefined") return null;
      return item.original.prompt;
    },
    requireLeadingSpace: false
  });
  tribute.attach(textArea);

  var tributeCN = new Tribute({
    trigger: '#',
    values: jsonData,
    selectTemplate: function (item) {
      if (typeof item === "undefined") return null;
      if (item.original.prompt_cn) {
        return item.original.prompt_cn;
      } else {
        return item.original.prompt;
      }
    },
    menuItemTemplate: function (item) {
      if (item.original.title) {
        return item.original.title + " " + item.original.key;
      } else {
        return item.original.key;
      }

    },
    lookup: function (item, mentionText) {
      if (item.pinyin && item.pinyin.length === 0) {
        return item.key + " " + item.title;
      } else {
        return item.key + " " + item.title + " " + item.pinyin.join(" ");
      }
    },
    requireLeadingSpace: false
  });
  tributeCN.attach(textArea);
}

(function () {
  'use strict';
  // example of alternative callback
  const myCss = GM_getResourceText("IMPORTED_CSS");
  GM_addStyle(myCss);
  console.log("css");

  window.addEventListener("load", load, false);

  window.addEventListener('locationchange', function () {
    console.log('location changed!');
  });
  window.addEventListener('load', function () {
    console.log('load!');
  });
  window.addEventListener('hashchange', function () {
    console.log('hashchange!');
  });
  window.addEventListener('popstate', function () {
    console.log('popstate!');
  });
  window.addEventListener('focus', function () {
    console.log('focus!');
  });
  window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
  });
})();
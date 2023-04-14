// ==UserScript==
// @name         ChatGPT prompts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  awesome chatGPT prompts
// @author       doggeddog
// @resource     IMPORTED_CSS https://zurb.github.io/tribute/example/tribute.css
// @require      https://zurb.github.io/tribute/example/tribute.js
// @match        https://waaao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

function GM_addStyle(css) {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.textContent = css
  document.documentElement.appendChild(style)
  return style
}

function load() {
         var tribute = new Tribute({
        // menuContainer: document.getElementById('content'),
        values: [
          {
            key: "Jordan Humphreys",
            value: "Jordan Humphreys",
            email: "getstarted@zurb.com"
          },
          {
            key: "Sir Walter Riley",
            value: "Sir Walter Riley",
            email: "getstarted+riley@zurb.com"
          },
          {
            key: "Joachim",
            value: "Joachim",
            email: "getstarted+joachim@zurb.com"
          }
        ],
        selectTemplate: function(item) {
          if (typeof item === "undefined") return null;
          if (this.range.isContentEditable(this.current.element)) {
            return (
              '<span contenteditable="false"><a href="http://zurb.com" target="_blank" title="' +
              item.original.email +
              '">' +
              item.original.value +
              "</a></span>"
            );
          }

          return "@" + item.original.value;
        },
        requireLeadingSpace: false
      });
    var textArea = document.getElementsByTagName("textarea")[0];
    tribute.attach(textArea);
    console.log(textArea)
}

(function() {
    'use strict';
// example of alternative callback
    const myCss = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(myCss);
    console.log("css");

    window.addEventListener("load", load, false);
    window.addEventListener("locationchange", () => { console.log("locationchange");load();}, false);
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
})();
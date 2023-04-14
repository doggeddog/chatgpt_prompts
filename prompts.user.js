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

var textArea
var defaultData = JSON.parse(GM_getResourceText("jsonData"));
var userData = [
  {
    "key": "Spoken English Teacher and Improver",
    "prompt": "I want you to act as a spoken English teacher and improver. I will speak to you in English and you will reply to me in English to practice my spoken English. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. I want you to ask me a question in your reply. Now let's start practicing, you could ask me a question first. Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.",
    "title": "英语对话练习",
    "prompt_cn": "我希望你能充当英语口语老师和提高者。我将用英语与你交谈，而你将用英语回答我，以练习我的英语口语。我希望你能保持回复的整洁，将回复限制在 100 字以内。我希望你能严格纠正我的语法错误、错别字和事实性错误。我希望你在回答中向我提出一个问题。现在我们开始练习，你可以先问我一个问题。记住，我要你严格纠正我的语法错误、错别字和事实性错误。",
    "desc": "英语交谈对话，回复会限制在 100 字以内。输入中的语法错误、错别字和事实性错误将被纠正。",
    "tags": [
      "language"
    ],
    "pinyin": "yingyuduihualianxi"
  },
]
userData.push(...defaultData);

function load() {
  textArea = document.getElementsByTagName("textarea")[0];
  var tribute = new Tribute({
    trigger: '/',
    values: userData,
    selectTemplate: function (item) {
      if (typeof item === "undefined") return null;
      return item.original.prompt;
    },
    requireLeadingSpace: false
  });
  tribute.attach(textArea);

  var tributeCN = new Tribute({
    trigger: '#',
    values: userData,
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
        return item.key + " " + item.title + " " + item.pinyin;
      }
    },
    requireLeadingSpace: false
  });
  tributeCN.attach(textArea);
}

(function () {
  'use strict';
  const myCss = GM_getResourceText("IMPORTED_CSS");
  GM_addStyle(myCss);

  window.addEventListener("load", load, false);

})();
// ==UserScript==
// @name         ChatGPT Prompts
// @license      GPL
// @namespace    https://github.com/doggeddog
// @version      0.2.1
// @description  awesome chatGPT prompts
// @author       doggeddog
// @resource     IMPORTED_CSS https://github.com/doggeddog/tribute/raw/master/dist/tribute.css
// @resource     jsonData https://github.com/doggeddog/chatgpt_prompts/raw/master/prompts.json
// @require      https://github.com/doggeddog/tribute/raw/master/dist/tribute.js
// @match        https://chat.openai.com/*
// @match        http://127.0.0.1:*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

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
  let textArea = document.getElementsByTagName("textarea");
  if (textArea.length === 0) {
    return;
  } else {
    textArea = textArea[0];
  }
  if (textArea.hasAttribute("data-tribute")) {
    return;
  }
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
    values: userData.filter(function (promp) {
      return promp.prompt_cn;
    }),
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
        return item.original.title;
      } else {
        return item.original.key;
      }

    },
    lookup: function (item, mentionText) {
      if (!item.title) {
        return item.key;
      }
      if (item.pinyin) {
        return item.title + " " + item.pinyin;
      } else {
        return item.title;
      }
    },
    requireLeadingSpace: false
  });
  tributeCN.attach(textArea);
}

(function () {
  'use strict';
  const themeCSS = `
  .dark .tribute-container ul {
    background: #3e3f4b;
  }
  .dark .tribute-container li.highlight {
    background: #5f6062;
  }
  div.flex.flex-col.items-center.text-sm > div:nth-last-child(2) {
    min-height: calc(100vh - 14rem);
  }
  div.flex.flex-col.items-center.text-sm > div:nth-last-child(1) {
      height: 8rem !important;
  }
  `;
  const importCSS = GM_getResourceText("IMPORTED_CSS");
  GM_addStyle(importCSS);
  GM_addStyle(themeCSS);

  let previousUrl = "";
  const observer = new MutationObserver(() => {
    if (window.location.href !== previousUrl) {
      console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
      previousUrl = window.location.href;
      setTimeout(() => { load(); }, 1000)
    }
  });
  const config = { subtree: true, childList: true };
  // start observing change
  observer.observe(document, config);
  setInterval(function () {
    load();
  }, 60 * 1000);
})();
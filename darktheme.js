// ==UserScript==
// @name         KakaoStory Dark Theme
// @namespace    http://chihaya.kr
// @version      0.3
// @description  Make dark theme for KakaoStory
// @author       Reflection
// @match        https://story.kakao.com/*
// @downloadURL  https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @updateURL    https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @grant        GM_addStyle
// ==/UserScript==

var filter = '';

function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

function loadFilter() {
var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
       filter = xmlHttp.responseText
       filter = replaceAll(filter, "story.kakao.com#$#", "");
       GM_addStyle ( filter );
       GM_addStyle ( ".ico_ks2 {background: url(\'https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/ico_ks2.png\') no-repeat 0 0; !important;}" );
    }
}
xmlHttp.open("GET", "https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.txt");
xmlHttp.send();
}

(function() {
loadFilter()
})();
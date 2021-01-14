// ==UserScript==
// @name         KakaoStory Dark Theme
// @namespace    http://chihaya.kr
// @version      0.5
// @description  Make dark theme for KakaoStory
// @author       Reflection
// @match        https://story.kakao.com/*
// @downloadURL  https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @updateURL    https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @grant        GM_addStyle
// ==/UserScript==

var filter = '';

function replaceWordsByTagName(element, orgin, repla) {
    var elem = document.getElementsByTagName(element);
 	for (var i = 0; i < elem.length; i++) {
		elem[i].innerHTML = elem[i].innerHTML.replace(orgin, repla);
	}
}

function replaceWordsByClassName(element, orgin, repla) {
    var elem = document.getElementsByClassName(element);
 	for (var i = 0; i < elem.length; i++) {
		elem[i].innerHTML = elem[i].innerHTML.replace(orgin, repla);
	}
}

function setAttributeByClassName(element, attr, str) {
    var elem = document.getElementsByClassName(element);
 	for (var i = 0; i < elem.length; i++) {
		elem[i].setAttribute(attr, str);
	}
}

function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

//var _changeString = window.setInterval(changeString, 1);

function changeString() {
    replaceWordsByTagName('label', '우리끼리보기', '편한친구공개');
    replaceWordsByClassName('tit_story', '우리끼리', '편한친구');
    replaceWordsByClassName('ico_bestfriend_m _permissionPartOfFriends', '우리끼리보기', '편한친구공개');
    setAttributeByClassName('_permissionPartOfFriends', 'data-tooltip', '편한친구공개');
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
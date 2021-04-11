// ==UserScript==
// @name         KakaoStory Dark Theme
// @namespace    http://chihaya.kr
// @version      0.8
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
       GM_addStyle ( "@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);" );
       //GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: 'Noto Sans KR' !important;}" );
       GM_addStyle ( ".ico_ks2 {background: url(\'https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/ico_ks2.png\') no-repeat 0 0; !important;}" );
       //GM_addStyle ( ".ico_ks {background: url(\'https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/ico_ks.png\') no-repeat 0 0; !important;}" );
    }
}
xmlHttp.open("GET", "https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.txt");
xmlHttp.send();
}

function GM_getValue(key, def) {
    return localStorage[key] || def;
}

function GM_setValue(key, value) {
    return localStorage[key]=value;
}

let currentPage = '';

function addCustomFontSetting() {
    document.getElementsByClassName("account_modify")[0].getElementsByTagName("fieldset")[0].innerHTML = '<strong class="subtit_modify">폰트설정</strong><dl class="list_account"><dt>폰트 설정</dt><dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_choice1" class="inp_radio _friendListExposure" id="fontNoto" value="나눔고딕"> <label for="fontNoto">NotoSans</label></div><div class="radio_inp"> <input type="radio" name="open_choice1" class="inp_radio _friendListExposure" id="fontNanum" value="NotoSans"> <label for="fontNanum">나눔고딕</label></div><div class="radio_inp"> <input type="radio" name="open_choice1" class="inp_radio _friendListExposure" id="fontCustom" value="Custom"> <label for="fontCustom">사용자 설정</label></div></div></dd><dt>사용자 설정 폰트명</dt><dd><input type="text" class="tf_profile _input" id="ksdark_font_css_name" value="' + GM_getValue('ksDarkCustomFontName', '') + '" style="background-color: #40444b; border: 0px; font-size: 13px; width: 316px; height: 16px; padding: 6px 8px;"></dd><dt>사용자 설정 폰트<br>CSS URL</dt><dd><input type="text" class="tf_profile _input" id="ksdark_font_css_url" style="background-color: #40444b; border: 0px; font-size: 13px; width: 316px; height: 16px; padding: 6px 8px;" value="' + GM_getValue('ksDarkCustomFontCss', '') + '"></dd><dt></dt><dd><div class="btn_area"><a id="ksdarkApplyCustom" class="btn_com btn_wh" style="background-color: #f26a41 !important">적용</a><p class="info_msg" id="ksdarkFontSave" style="display: none">저장되었습니다.</p></div></dd></dl>' + document.getElementsByClassName("account_modify")[0].getElementsByTagName("fieldset")[0].innerHTML;
    if (GM_getValue('ksDarkFontName', '') == "NotoSans") {
        document.getElementById("fontNanum").checked = true;
    } else if (GM_getValue('ksDarkFontName', '') == "나눔고딕") {
        document.getElementById("fontNoto").checked = true;
    } else if (GM_getValue('ksDarkFontName', '') == "Custom") {
        document.getElementById("fontCustom").checked = true;
    } else {
        document.getElementById("fontNoto").checked = true;
    }
    $('body').on('click', '#fontNanum', function() {
        GM_setValue('ksDarkFontName', 'NotoSans');
        GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: '나눔고딕' !important;}" );
    });
    $('body').on('click', '#fontNoto', function() {
        GM_setValue('ksDarkFontName', '나눔고딕');
        GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: 'Noto Sans KR' !important;}" );
    });
    $('body').on('click', '#fontCustom', function() {
        GM_setValue('ksDarkFontName', 'Custom');
        GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: " + GM_getValue('ksDarkCustomFontName', '') + " !important;}" );
    });
    $('body').on('click', '#ksdarkApplyCustom', function() {
        GM_setValue('ksDarkCustomFontName', document.getElementById("ksdark_font_css_name").value);
        GM_setValue('ksDarkCustomFontCss', document.getElementById("ksdark_font_css_url").value);
        GM_addStyle("@import url(" + GM_getValue('ksDarkCustomFontCss', '') + ")");
        if (GM_getValue('ksDarkFontName', '') == "Custom") {
            GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: " + GM_getValue('ksDarkCustomFontName', '') + " !important;}" );
        }
        document.getElementById("ksdarkFontSave").style.display = "block";
        setTimeout(() => document.getElementById("ksdarkFontSave").style.display = "none", 3000);
    });
}

(function() {
    loadFilter();

    if (GM_getValue('ksDarkCustomFontName', '') == "") {
        GM_setValue('ksDarkCustomFontName', 'Gaegu');
        GM_setValue('ksDarkCustomFontCss', 'https://fonts.googleapis.com/css2?family=Gaegu&display=swap');
        GM_addStyle ("@import url(https://fonts.googleapis.com/css2?family=Gaegu&display=swap);");
    } else {
        GM_addStyle("@import url(" + GM_getValue('ksDarkCustomFontCss', '') + ")");
    }

    if (GM_getValue('ksDarkFontName', '') == "") {
        GM_setValue('ksDarkFontName', 'NotoSans');
        GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: 'Noto Sans KR' !important;}" );
    } else {
        if (GM_getValue('ksDarkFontName', '') == "NotoSans") {
            GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: '나눔고딕' !important;}" );
        } else if (GM_getValue('ksDarkFontName', '') == "나눔고딕") {
            GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: 'Noto Sans KR' !important;}" );
        } else if (GM_getValue('ksDarkFontName', '') == "Custom") {
            GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: " + GM_getValue('ksDarkCustomFontName', '') + " !important;}" );
        } else {
            GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: 'Noto Sans KR' !important;}" );
        }
    }
    setInterval(function() {
        if (currentPage != location.href) {
            currentPage = location.href;
            var url_parts = currentPage.split("/");
            var url_last_part = url_parts[url_parts.length-1];
            if (url_last_part == 'settings') {
                setTimeout(() => addCustomFontSetting(), 500);
            }
        }
    }, 500);
})();
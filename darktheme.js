// ==UserScript==
// @name         KakaoStory Dark Theme
// @namespace    http://chihaya.kr
// @version      0.10
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
let versionString = '0.10(210413)';

function addCustomFontSetting() {
    document.getElementsByClassName("account_modify")[0].getElementsByTagName("fieldset")[0].innerHTML = '<strong class="subtit_modify">카카오스토리 다크모드 설정</strong><dl class="list_account"><dt>폰트 설정</dt><dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_font1" class="inp_radio _friendListExposure" id="fontNoto" value="나눔고딕"> <label for="fontNoto">NotoSans</label></div><div class="radio_inp"> <input type="radio" name="open_font1" class="inp_radio _friendListExposure" id="fontNanum" value="NotoSans"> <label for="fontNanum">나눔고딕</label></div><div class="radio_inp"> <input type="radio" name="open_font1" class="inp_radio _friendListExposure" id="fontCustom" value="Custom"> <label for="fontCustom">사용자 설정</label></div></div></dd><dt>폰트 크기</dt><dd><input type="text" class="tf_profile _input" id="ksdark_font_size_add" value="' + GM_getValue('ksDarkFontSize', '') + '" style="background-color: ' + GM_getValue('ksDarkThemeStyle', '') + '; border: 0px; font-size: 13px; width: 30px; height: 16px; padding: 6px 8px;"> px 추가<br>※완벽히 지원되지 않아 일부 글자는 크기가 변하지 않을 수 있습니다.</dd><dt>사용자 설정 폰트명</dt><dd><input type="text" class="tf_profile _input" id="ksdark_font_css_name" value="' + GM_getValue('ksDarkCustomFontName', '') + '" style="background-color: ' + GM_getValue('ksDarkThemeStyle', '') + '; border: 0px; font-size: 13px; width: 316px; height: 16px; padding: 6px 8px;"></dd><dt>사용자 설정 폰트<br>CSS URL</dt><dd><input type="text" class="tf_profile _input" id="ksdark_font_css_url" style="background-color: ' + GM_getValue('ksDarkThemeStyle', '') + '; border: 0px; font-size: 13px; width: 316px; height: 16px; padding: 6px 8px;" value="' + GM_getValue('ksDarkCustomFontCss', '') + '"></dd><dt>테마 설정</dt><dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarkstyle1" class="inp_radio _friendListExposure" id="ksDarkThemeWhite" value="White"> <label for="ksDarkThemeWhite">Light Mode</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarkstyle1" class="inp_radio _friendListExposure" id="ksDarkThemeDark" value="Dark"> <label for="ksDarkThemeDark">Dark Mode</label></div></div></dd><dt>다크테마 버전</dt><dd>' + versionString + '</dd><dt></dt><dd><div class="btn_area"><a id="ksdarkApplyCustom" class="btn_com btn_wh" style="background-color: #f26a41 !important">적용</a><p class="info_msg" id="ksdarkFontSave" style="display: none">저장되었습니다. 일부 설정은 새로고침 하셔야 반영됩니다.</p></div></dd></dl>' + document.getElementsByClassName("account_modify")[0].getElementsByTagName("fieldset")[0].innerHTML;
    if (GM_getValue('ksDarkFontName', '') == "NotoSans") {
        document.getElementById("fontNanum").checked = true;
    } else if (GM_getValue('ksDarkFontName', '') == "나눔고딕") {
        document.getElementById("fontNoto").checked = true;
    } else if (GM_getValue('ksDarkFontName', '') == "Custom") {
        document.getElementById("fontCustom").checked = true;
    } else {
        document.getElementById("fontNoto").checked = true;
    }
    if (GM_getValue('ksDarkThemeStyle', '') == "#40444b") {
        document.getElementById("ksDarkThemeDark").checked = true;
    } else {
        document.getElementById("ksDarkThemeWhite").checked = true;
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
    $('body').on('click', '#ksDarkThemeDark', function() {
        GM_setValue('ksDarkThemeStyle', '#40444b');
    });
    $('body').on('click', '#ksDarkThemeWhite', function() {
        GM_setValue('ksDarkThemeStyle', '#ffffff');
    });
    $('body').on('click', '#ksdarkApplyCustom', function() {
        GM_setValue('ksDarkCustomFontName', document.getElementById("ksdark_font_css_name").value);
        GM_setValue('ksDarkCustomFontCss', document.getElementById("ksdark_font_css_url").value);
        GM_setValue('ksDarkFontSize', document.getElementById("ksdark_font_size_add").value);
        GM_addStyle("@import url(" + GM_getValue('ksDarkCustomFontCss', '') + ")");
        if (GM_getValue('ksDarkFontName', '') == "Custom") {
            GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: " + GM_getValue('ksDarkCustomFontName', '') + " !important;}" );
        }
        setFontSize();
        document.getElementById("ksdarkFontSave").style.display = "block";
        setTimeout(() => document.getElementById("ksdarkFontSave").style.display = "none", 3000);
    });
}

function setFontSize() {
    GM_addStyle("body, button, input, select, td, textarea, th { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".list_cate .thumb_name { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".tab_friend .link_friend { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".add_top .pf_name { font-size: " + parseInt(parseInt(15) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".add_top .share, .add_top .time { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".write .type li .link_menu { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".comment .comt_write .inp_write label { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".section_bundle .action_graph .txt_action { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".story_inflow .fd_cont .txt_wrap { font-size: " + parseInt(parseInt(15) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".story_inflow .comment .count_group { font-size: " + parseInt(parseInt(15) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".kakao_search .lab_keyword { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".count_group { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".comment .more { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".section .open_layer li { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".section .other_layer { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".cate_tab .tit_cate .link_title { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".cate_channel .link_channel { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".friend_search .box_searchbar .lab_keyword { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".tabcont_message .btn_message .btn_wh { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".section_time .tit_time { font-size: " + parseInt(parseInt(22) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".section_time .desc_time { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".time_cont .link_share { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".time_cont .txt_date { font-size: " + parseInt(parseInt(18) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".time_cont .txt_desc { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".util_menu .menu_util .link_menu { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".snb_profile .wrap_thumb .link_name { font-size: " + parseInt(parseInt(22) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".fd_cont .scrap_image .tit_scrap { font-size: " + parseInt(parseInt(17) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".fd_cont .scrap_image .txt_scrap { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".fd_cont .scrap_image .link_source { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".gallery_viewer .img_wrap .in_txt .pic_info { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".gallery_viewer .img_wrap .in_txt .feel { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".story_layer .list_people .tit_userinfo { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".comment .list>li .txt { font-size: " + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".comment .list>li .txt p .time { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".comment .list>li .txt .btn_like { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".comment .comt_write .btn_com { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".story_inflow .comment .list>li .txt p .name { font-size: " + parseInt(parseInt(16) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".fd_cont .more { font-size: " + parseInt(parseInt(12) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".cover_cont .desc_cover .link_tit { font-size: " + parseInt(parseInt(32) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".cover_cont .desc_cover { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".dim_ly .message .box_writing .box_from .friends_choice .ly_set .link_modify { font-size: "  + parseInt(parseInt(13) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
    GM_addStyle(".dim_ly .message .box_writing .tit_message { font-size: " + parseInt(parseInt(14) + parseInt(GM_getValue('ksDarkFontSize', ''))) + "px !important;}");
}

(function() {

    //GM_setValue('ksDarkFontSize', '0'); //debug
    if (GM_getValue('ksDarkFontSize', '') == "") {
        GM_setValue('ksDarkFontSize', '10');
    }
    if (GM_getValue('ksDarkThemeStyle', '') == "") {
        GM_setValue('ksDarkThemeStyle', '#40444b');
    }

    if (GM_getValue('ksDarkThemeStyle', '') == "#40444b") {
        loadFilter();
    }
    setFontSize();
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
            //setTimeout(() => changeFontSize(), 5000);
        }
    }, 500);
})();
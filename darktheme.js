// ==UserScript==
// @name         KakaoStory Enhanced
// @namespace    http://chihaya.kr
// @version      0.18
// @description  Add useful features in KakaoStory
// @author       Reflection, 박종우
// @match        https://story.kakao.com/*
// @downloadURL  https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @updateURL    https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @grant        GM_addStyle
// @grant        GM_notification
// ==/UserScript==

/* 내부 설정 값
   ksDarkFontSize: 자체 폰트 크기 설정
   ksDarkThemeStyle: 테마 설정
   ksDarkCustomFontName: 사용자 설정 폰트 이름
   ksDarkCustomFontCss: 사용자 설정 폰트 CSS 파일
   ksDarkFontName: 폰트 설정 (현재 사용되지 않는 기능)
   ksDarkNotyTime: 알리미 시간 주기(초 단위)
   ksDarkNotyUse: 알리미 사용 여부
   ksDarkKillTeller: 스토리텔러/채널 버튼 삭제
   ksDarkNotySound: 알리미 사운드 출력 여부
   ksDarkBan: 강화된 차단 사용 여부
   ksDarkHideLogo : 카카오스토리 활동 숨김 여부
   ksDarkVersion : 버전 정보를 담고 있음(업데이트 내역 띄우기 위해서 사용함)
*/

let currentPage = '';
let notyTimeCount = 0;
let banList = new Set();
let versionString = '0.18(210429)';

//Chrome GM_getValue / GM_setValue
function GM_getValue(key, def) {
    return localStorage[key] || def;
}

function GM_setValue(key, value) {
    return localStorage[key]=value;
}

//우끼보 -> 편친공 String 변경
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

function hideBannedUserComment() {
    var comments = document.getElementsByClassName("_commentContent");
    for (var i = 0; i < comments.length; i++) {
        var tmpBannedID = comments[i].getElementsByClassName("txt")[0].getElementsByTagName("p")[0].getElementsByTagName("a")[0].getAttribute("href").replace("/", "");

        if (banList.has(tmpBannedID) == true) {
            comments[i].parentElement.remove();
            i -= 1;
        }
    }
}

function hideRecommendFeed() {
    var recommendFeed = document.getElementsByClassName("section recommend");
    for (var i = 0; i < recommendFeed.length; i++) {
        recommendFeed[i].remove();
    }
}

function getBanUsers() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var jsonNoty = JSON.parse(xmlHttp.responseText);
            //bannedUserIDArr = new Array(jsonNoty.length);
            for (var i = 0; i < jsonNoty.length; i ++) {
                banList.add(String(jsonNoty[i]["id"]));
            }
        }
    }
    xmlHttp.open("GET", "https://story.kakao.com/a/bans");
    xmlHttp.setRequestHeader("x-kakao-apilevel", "49");
    xmlHttp.setRequestHeader("x-kakao-deviceinfo", "web:d;-;-");
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlHttp.send();
}

//Adguard 필터 적용
function loadAdguardFilter() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var filter = xmlHttp.responseText
            //filter = replaceAll(filter, "story.kakao.com#$#", "");
            GM_addStyle ( filter );
        }
    }
    //xmlHttp.open("GET", "http://127.0.0.1/darkstyle/darktheme_dev.css");
    xmlHttp.open("GET", "https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.css");
    xmlHttp.send();
}

function loadEnhancedCSS() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var filter = xmlHttp.responseText
            GM_addStyle ( filter );
        }
    }
    xmlHttp.open("GET", "https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/enhanced.css");
    xmlHttp.send();
}

//채널버튼, 텔러버튼 없애버리기
function killTellerChannel() {
    document.getElementsByClassName("storyteller_gnb")[0].remove();
    document.getElementsByClassName("group_gnb")[0].remove();
}

//전체 설정 추가
function addCustomFontSetting() {
    //다크모드 설정 웹 HTML 설정용
    document.body.innerHTML = '<div class="cover _cover" id="enhancedLayer" style="display: none;  overflow-y: scroll;">'
        + '<div class="dimmed dimmed50" style="z-index: 201;"></div>'
        + '<div class="cover_wrapper" style="z-index: 201;">'
        + '<div class="write cover_content cover_center">'
        + '<div class="_layerWrapper layer_write">'
        + '<div class="section _dropZone account_modify">'
        + '<strong class="subtit_modify subtit_enhanced">\' Enhanced 설정</strong>'
        + '<dl class="list_account">'
          //폰트 설정
        + '<dt>폰트 설정</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_font1" class="inp_radio _friendListExposure" id="fontNoto" value="Noto Sans KR"> <label for="fontNoto">NotoSans</label></div><div class="radio_inp"> <input type="radio" name="open_font1" class="inp_radio _friendListExposure" id="fontNanum" value="나눔고딕"> <label for="fontNanum">나눔고딕</label></div><div class="radio_inp"> <input type="radio" name="open_font1" class="inp_radio _friendListExposure" id="fontCustom" value="Custom"> <label for="fontCustom">사용자 설정</label></div></div></dd>'
          //폰트 크기 설정
        + '<dt>폰트 크기</dt>'
        + '<dd><input type="text" class="tf_profile _input" id="ksdark_font_size_add" value="' + GM_getValue('ksDarkFontSize', '') + '" style="background-color: ' + GM_getValue('ksDarkThemeStyle', '') + '; border: 0px; font-size: 13px; width: 30px; height: 16px; padding: 6px 8px;"> px 추가</dd>'
          //사용자 설정 폰트 이름
        + '<dt>사용자 설정 폰트명</dt>'
        + '<dd><input type="text" class="tf_profile _input" id="ksdark_font_css_name" value="' + GM_getValue('ksDarkCustomFontName', '') + '" style="background-color: ' + GM_getValue('ksDarkThemeStyle', '') + '; border: 0px; font-size: 13px; width: 316px; height: 16px; padding: 6px 8px;"></dd>'
        + '<dt>사용자 설정 폰트<br>CSS URL</dt>'
          //사용자 설정 폰트 CSS
        + '<dd><input type="text" class="tf_profile _input" id="ksdark_font_css_url" style="background-color: ' + GM_getValue('ksDarkThemeStyle', '') + '; border: 0px; font-size: 13px; width: 316px; height: 16px; padding: 6px 8px;" value="' + GM_getValue('ksDarkCustomFontCss', '') + '"></dd>'
          //다크테마 설정
        + '<dt>테마 설정</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarkstyle1" class="inp_radio _friendListExposure" id="ksDarkThemeWhite" value="#ffffff"> <label for="ksDarkThemeWhite">Light Mode</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarkstyle1" class="inp_radio _friendListExposure" id="ksDarkThemeDark" value="#40444b"> <label for="ksDarkThemeDark">Discord Dark Mode</label></div></div></dd>'
          //스토리 텔러, 채널 버튼 삭제 설정
        + '<dt>스토리텔러/채널<br>버튼</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarktellerkill" class="inp_radio _friendListExposure" id="ksDarkTellerNoKill" value="F"> <label for="ksDarkTellerNoKill">보이기</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarktellerkill" class="inp_radio _friendListExposure" id="ksDarkTellerKill" value="T"> <label for="ksDarkTellerKill">안보이기</label></div></div></dd>'
          //알림 알림기능
        + '<dt>스토리 알림 기능</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarknoty" class="inp_radio _friendListExposure" id="ksDarkNotyUse" value="T"> <label for="ksDarkNotyUse">사용</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarknoty" class="inp_radio _friendListExposure" id="ksDarkNotyNotUse" value="F"> <label for="ksDarkNotyNotUse">사용안함</label></div></div></dd>'
          //알림 사운드 출력할거야 말거야(false가 소리켜는거임 사일런트옵션이라)
        + '<dt>알림 사운드</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarknotysound" class="inp_radio _friendListExposure" id="ksDarkNotySound" value="false"> <label for="ksDarkNotySound">켜기</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarknotysound" class="inp_radio _friendListExposure" id="ksDarkNotyNoSound" value="true"> <label for="ksDarkNotyNoSound">끄기</label></div></div></dd>'
          //알림 체크주기
        + '<dt>알림 체크 주기</dt>'
        + '<dd><input type="text" class="tf_profile _input" id="ksdark_notytime" value="' + GM_getValue('ksDarkNotyTime', '') + '" style="background-color: ' + GM_getValue('ksDarkThemeStyle', '') + '; border: 0px; font-size: 13px; width: 30px; height: 16px; padding: 6px 8px;"> 초마다 로드<br>※20초를 권장하며 이보다 더 짧게 설정하는 것은 권장하지 않습니다.</dd>'
          //강화된 차단
        + '<dt>강화된 차단 사용</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarkban" class="inp_radio _friendListExposure" id="ksDarkBan" value="true"> <label for="ksDarkBan">사용</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarkban" class="inp_radio _friendListExposure" id="ksDarkNoBan" value="false"> <label for="ksDarkNoBan">미사용</label></div></div><br>※해당 기능을 사용하면 차단한 유저의 댓글이 어느 게시글에서도 보이지 않습니다.</dd>'
        + '<dt>카카오스토리<br>숨기기</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarkhidelogo" class="inp_radio _friendListExposure" id="ksDarkHideLogo" value="true"> <label for="ksDarkHideLogo">숨기기</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarkhidelogo" class="inp_radio _friendListExposure" id="ksDarkNoHideLogo" value="false"> <label for="ksDarkNoHideLogo">숨기지 않기</label></div></div></dd>'
          //다크테마 정보 보여주기
        + '<dt>다크테마 정보</dt>'
        + '<dd>버전: ' + versionString + '<br>개발: <a href="/_jYmvy" data-id="_jYmvy" data-profile-popup="_jYmvy" style="color: #00b5ff" class="_decoratedProfile">Reflection</a>, <a href="/ldc6974" data-id="ldc6974" data-profile-popup="ldc6974" style="color: #00b5ff" class="_decoratedProfile">박종우</a><br>도움주신 분들: <a href="/_2ZQlS7" data-id="_2ZQlS7" data-profile-popup="_2ZQlS7" style="color: #00b5ff" class="_decoratedProfile">AppleWebKit</a>, 사일<br><a href="/_jYmvy/IJRIyFQOVWA" data-id="_jYmvy" data-profile-popup="_jYmvy" style="color: #00b5ff" class="_decoratedProfile">\' Enhanced 정보</a></dd>'
          //Apply
//        + '<dt></dt>'
//        + '<dd><div class="btn_area"><a id="ksdarkApplyCustom" class="btn_com btn_wh" style="background-color: #7289da !important">적용</a><p class="info_msg" id="ksdarkFontSave" style="display: none">저장되었습니다. 일부 설정은 새로고침 하셔야 반영됩니다.</p></div></dd>'
        + '</dl>'
        + '<div class="inp_footer"><div class="bn_group"><a href="#" class="_cancelBtn btn_com btn_wh" id="ksdarkCancel"><em>취소</em></a> <a class="btn_com btn_or" id="ksdarkApplyCustom"><em>올리기</em></a></div><div id="ksdarkSaveInfo">일부 설정은 새로고침 해야 반영됩니다.</div></div>'
        + '</div></div></div></div></div>'
        + document.body.innerHTML;

    if (GM_getValue('ksDarkCustomFontName', '') == "Noto Sans KR") {
        document.getElementById("fontNoto").checked = true;
    } else if (GM_getValue('ksDarkCustomFontName', '') == "나눔고딕") {
        document.getElementById("fontNanum").checked = true;
    } else {
        document.getElementById("fontCustom").checked = true;
    }

    if (GM_getValue('ksDarkThemeStyle', '') == "#40444b") {
        document.getElementById("ksDarkThemeDark").checked = true;
    } else {
        document.getElementById("ksDarkThemeWhite").checked = true;
    }

    if (GM_getValue('ksDarkHideLogo', '') == "true") {
        document.getElementById("ksDarkHideLogo").checked = true;
    } else {
        document.getElementById("ksDarkNoHideLogo").checked = true;
    }

    if (GM_getValue('ksDarkKillTeller', '') == "T") {
        document.getElementById("ksDarkTellerKill").checked = true;
    } else {
        document.getElementById("ksDarkTellerNoKill").checked = true;
    }

    if (GM_getValue('ksDarkNotyUse', '') == "T") {
        document.getElementById("ksDarkNotyUse").checked = true;
    } else {
        document.getElementById("ksDarkNotyNotUse").checked = true;
    }

    if (GM_getValue('ksDarkNotySound', '') == "true") {
        document.getElementById("ksDarkNotyNoSound").checked = true;
    } else {
        document.getElementById("ksDarkNotySound").checked = true;
    }

    if (GM_getValue('ksDarkBan', '') == "true") {
        document.getElementById("ksDarkBan").checked = true;
    } else {
        document.getElementById("ksDarkNoBan").checked = true;
    }

    $(document).on("change",'input[name="open_font1"]',function(){
        var fontName = $('[name="open_font1"]:checked').val();
        if (fontName == 'Custom') {
            fontName = GM_getValue('ksDarkCustomFontName', '');
        }
        GM_setValue('ksDarkCustomFontName', fontName);
        GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: '" + fontName + "' !important;}" );
        document.getElementById("ksdark_font_css_name").value = fontName;
    });

    $(document).on("change",'input[name="open_ksdarkstyle1"]',function(){
        GM_setValue("ksDarkThemeStyle", $('[name="open_ksdarkstyle1"]:checked').val());
    });

    $(document).on("change",'input[name="open_ksdarknoty"]',function(){
        GM_setValue("ksDarkNotyUse", $('[name="open_ksdarknoty"]:checked').val());
    });

    $(document).on("change",'input[name="open_ksdarkhidelogo"]',function(){
        GM_setValue("ksDarkHideLogo", $('[name="open_ksdarkhidelogo"]:checked').val());
    });

    $(document).on("change",'input[name="open_ksdarktellerkill"]',function(){
        GM_setValue("ksDarkKillTeller", $('[name="open_ksdarktellerkill"]:checked').val());
    });

    $(document).on("change",'input[name="open_ksdarknotysound"]',function(){
        GM_setValue("ksDarkNotySound", $('[name="open_ksdarknotysound"]:checked').val());
    });

    $(document).on("change",'input[name="open_ksdarkban"]',function(){
        GM_setValue("ksDarkBan", $('[name="open_ksdarkban"]:checked').val());
    });

    $('body').on('click', '#ksdarkApplyCustom', function() {
        GM_setValue('ksDarkCustomFontName', document.getElementById("ksdark_font_css_name").value);
        GM_setValue('ksDarkCustomFontCss', document.getElementById("ksdark_font_css_url").value);
        GM_setValue('ksDarkFontSize', document.getElementById("ksdark_font_size_add").value);
        GM_setValue('ksDarkNotyTime', document.getElementById("ksdark_notytime").value);
        GM_addStyle("@import url(" + GM_getValue('ksDarkCustomFontCss', '') + ")");
        GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: " + GM_getValue('ksDarkCustomFontName', '') + " !important;}" );
        setFontSize();
        document.getElementById("enhancedLayer").style.display = 'none';
        enableScroll();
    });

    $('body').on('click', '#ksdarkCancel', function() {
        document.getElementById("enhancedLayer").style.display = 'none';
        enableScroll();
    });
}

function setNotify(content, title_, url) {
    GM_notification ({
        text: content,
        title: title_,
        image: 'https://i.imgur.com/FSvg18g.png',
        highlight: false,
        silent: (GM_getValue('ksDarkNotySound', '') === 'true'),
        timeout: 5000,
        onclick: function () {
            space.Router.navigate("/" + url);
        }
    });
}

function initializeNotify() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var jsonNoty = JSON.parse(xmlHttp.responseText);
            GM_setValue('latestNotyID', String(jsonNoty[0]["id"]));
            //setNotify(String(notyContent), String(notyMessage), String(notyID));
        }
    }
    xmlHttp.open("GET", "https://story.kakao.com/a/notifications");
    xmlHttp.setRequestHeader("x-kakao-apilevel", "49");
    xmlHttp.setRequestHeader("x-kakao-deviceinfo", "web:d;-;-");
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlHttp.send();
}

//최신 알림 받아오기
function getLatestNotify() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var jsonNoty = JSON.parse(xmlHttp.responseText);
            var notyID = jsonNoty[0]["id"];
            var notyMessage = jsonNoty[0]["message"];
            var notyScheme = jsonNoty[0]["scheme"];
            var notyContent = jsonNoty[0]["content"];
            var tmpNotyURL = String(notyScheme).split("/");
            var notyURL = tmpNotyURL[tmpNotyURL.length-1].replace(".", "/");
            //console.log(notyURL);
            if (String(notyID) == GM_getValue('latestNotyID', '')) {
            } else {
                GM_setValue('latestNotyID', String(notyID));
                if (String(jsonNoty[0]["is_new"]) == 'false') {
                    return;
                }
                //console.log((GM_getValue('ksDarkNotySound', '') === 'true'));
                if (notyContent == undefined) {
                    notyContent = ' ';
                }
                setNotify(String(notyContent), String(notyMessage), String(notyURL));
            }
        }
    }
    xmlHttp.open("GET", "https://story.kakao.com/a/notifications");
    xmlHttp.setRequestHeader("x-kakao-apilevel", "49");
    xmlHttp.setRequestHeader("x-kakao-deviceinfo", "web:d;-;-");
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlHttp.send();
}

//폰트 사이즈 변경
function setFontSize() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var lines = xmlHttp.responseText.split("\n");
            for (var i = 0; i < lines.length; i++) {

                var originSize = lines[i].split("font-size: ")[1].split("px")[0];
                var modifiedCSS = lines[i].replace( originSize , parseInt(parseInt(originSize) + parseInt(GM_getValue('ksDarkFontSize', ''))))
                GM_addStyle ( modifiedCSS );
            }
        }
    }
    xmlHttp.open("GET", "https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/font_size.css");
    xmlHttp.send();
}

function viewUpdate() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var filter = xmlHttp.responseText
            document.body.innerHTML = '<div id="updateNoticeLayer" class="cover _cover" style="overflow-y: scroll"><div class="dimmed dimmed50" style="z-index: 201;"></div><div class="cover_wrapper" style="z-index: 201;"><div class="write cover_content cover_center" data-kant-group="wrt" data-part-name="view"><div class="_layerWrapper layer_write"><div class="section _dropZone account_modify"><div class="writing"><div class="inp_contents" data-part-name="editor"><strong class="subtit_modify subtit_enhanced">\' Enhanced 업데이트 내역</strong><div style="word-break: break-all">' + filter + '</div></div></div><div></div><div class="inp_footer"><div class="bn_group"> <a href="#" class="_postBtn btn_com btn_or" id="ksdarkUpdateNoticeOK"><em>알겠어용</em></a></div></div></div></div><div></div></div></div></div>' + document.body.innerHTML;
            disableScroll();
            $('body').on('click', '#ksdarkUpdateNoticeOK', function() {
                document.getElementById("updateNoticeLayer").style.display = 'none';
                enableScroll();
            });
        }
    }
    xmlHttp.open("GET", "https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/update_notice.html");
    xmlHttp.send();

}

$(document).ready(function(){
    //차단 시 밴 리스트에 추가함
    $(document).on('click', 'a[data-kant-id="1391"]', function(){
        $(document).on('click', 'a[class="btn_com btn_or _dialogOk _dialogBtn"]', function(){
            var splittedURL = $(location).attr('href').split('/');
            var bannedUserID = splittedURL[splittedURL.length - 1];
            banList.add(bannedUserID);
            $(document).off('click', 'a[class="btn_com btn_or _dialogOk _dialogBtn"]');
        });
    });
    //차단 해제 시 밴 리스트에서 삭제함
    $(document).on('click', 'a[data-kant-id="1392"]', function(){
        var splittedURL = $(location).attr('href').split('/');
        var bannedUserID = splittedURL[splittedURL.length - 1];
        banList.delete(bannedUserID);
        $(document).off('click', 'a[class="btn_com btn_or _dialogOk _dialogBtn"]');
    });
    //설정 창에서 차단 해제 시 밴 리스트에서 삭제함
    $(document).on('click', 'a[data-kant-id="845"]', function() {
        var userIdx = $('a[data-kant-id="845"]').index(this);
        var userID = $('a[data-kant-id="844"]').eq(userIdx).parent().attr('data-model');
        banList.delete(userID);
    });

});

//파비콘, 타이틀 네이버로 변경
function hideLogo() {
    document.getElementsByTagName('title')[0].innerText = "NAVER"
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/naver_favi.ico';
}

function loadValue(valueID, defaultValue) {
    if (GM_getValue(valueID, '') == "") {
        GM_setValue(valueID, defaultValue);
    }
    return GM_getValue(valueID, '');
}

function addEnhancedMenu() {
    document.getElementsByClassName("menu_util")[0].innerHTML = '<li><a id="ksdarkEnhancedOpen" class="link_menu _btnSettingProfile">Enhanced 설정</a></li>' + document.getElementsByClassName("menu_util")[0].innerHTML;
    $('body').on('click', '#ksdarkEnhancedOpen', function() {
        document.getElementById("enhancedLayer").style.display = 'block';
        $('html,body').scrollTop(0);
        disableScroll();
    });
}

function enableScroll() {
    window.onscroll = function() {};
}

function disableScroll() {
    window.onscroll = function() {
        window.scrollTo(0, 0);
    };
}


(function() {
    //GM_setValue('ksDarkVersion', '');
    //노토산스 폰트 기본 로드(바로 적용 위함)
    GM_addStyle ( "@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);" );
    loadValue('ksDarkFontSize', '0');
    loadValue('ksDarkNotyTime', '20');
    loadValue('ksDarkNotySound', 'true');
    loadValue('ksDarkBan', 'false');

    if (loadValue('ksDarkThemeStyle', '#40444b') == '#40444b') {
        loadAdguardFilter();
    } else {
        GM_addStyle('.head_story .tit_kakaostory .link_kakaostory { background: url(\'https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/logo_kseh.png\'); } ');
    }

    loadValue('ksDarkNotyUse', 'T');

    setFontSize();
    initializeNotify();
    getBanUsers();
    loadEnhancedCSS();
    addCustomFontSetting();
    if (GM_getValue("ksDarkVersion", '') !== versionString) {
        viewUpdate();
        GM_setValue('ksDarkVersion', versionString);
    }

    GM_addStyle ("@import url(" + loadValue('ksDarkCustomFontCss', 'https://fonts.googleapis.com/css2?family=Gaegu&display=swap') + ");");
    GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: '" + loadValue('ksDarkCustomFontName', 'Noto Sans KR') + "' !important;}" );

    if (loadValue('ksDarkHideLogo', 'false') == 'true') {
        GM_addStyle('.head_story .tit_kakaostory .link_kakaostory { width: 60px !important; }');
        GM_addStyle('.kakao_search { margin-left: 40px !important; }');
        GM_addStyle('.head_story .tit_kakaostory .link_kakaostory  { background: rgba(0,0,0,0) !important; }');
        GM_addStyle('.head_story .tit_kakaostory { width: 60px !important; }');
    } else {
        GM_addStyle('.head_story .tit_kakaostory .link_kakaostory { width: 144px !important; }');
    }

    GM_addStyle('.head_story .tit_kakaostory .logo_kakaostory { width: 0px !important; }');
    GM_addStyle('.head_story .tit_kakaostory .link_kakaostory { height: 27px !important; }');

    if (loadValue('ksDarkKillTeller', 'T') == 'T') {
        setTimeout(() => killTellerChannel(), 500);
    }

    setTimeout(() => addEnhancedMenu(), 1000);

    setInterval(function() {
         if (GM_getValue('ksDarkNotyUse', '') == "T") {
             notyTimeCount += 1;
             if (notyTimeCount >= parseInt(GM_getValue('ksDarkNotyTime', '')) * 10) {
                 notyTimeCount = 0;
                 getLatestNotify();
             }
         }
        if (GM_getValue('ksDarkBan', '') == "true") {
            hideBannedUserComment();
        }

        hideRecommendFeed();

        if (currentPage != location.href) {
            currentPage = location.href;
            var url_parts = currentPage.split("/");
            var url_last_part = url_parts[url_parts.length-1];
            if (GM_getValue('ksDarkHideLogo', '') == 'true') {
                setTimeout(() => hideLogo(), 750);
            }
            //setTimeout(() => changeFontSize(), 5000);
        }
    }, 100);
})();
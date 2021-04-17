// ==UserScript==
// @name         KakaoStory Dark Theme
// @namespace    http://chihaya.kr
// @version      0.14
// @description  Make dark theme for KakaoStory
// @author       Reflection
// @match        https://story.kakao.com/*
// @downloadURL  https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @updateURL    https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.js
// @grant        GM_addStyle
// @grant        GM_notification
// ==/UserScript==

/* 내부 설정 값
   ksDarkFontSize: 테마 폰트 크기
   ksDarkThemeStyle: 테마 라이트 / 다크 모드 설정
   ksDarkCustomFontName: 사용자 설정 폰트 이름
   ksDarkCustomFontCss: 사용자 설정 폰트 CSS 파일
   ksDarkFontName: 테마 폰트 설정(일반적인) <-- 미사용
   ksDarkNotyTime: 알리미 시간 주기(초단위)
   ksDarkNotyUse: 알리미 쓸지말지
   ksDarkKillTeller: 스토리텔러/채널 버튼 제거
   ksDarkNotySound: 알리미 사운드 출력 할거임?
   ksDarkBan: 강화된 차단 사용 ㄱ?
*/

let currentPage = '';
let notyTimeCount = 0;
let banList = new Set();
let versionString = '0.14(210418)';

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
            filter = replaceAll(filter, "story.kakao.com#$#", "");
            GM_addStyle ( filter );
        }
    }
    xmlHttp.open("GET", "https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/darktheme.txt");
    xmlHttp.send();
}

//채널버튼, 텔러버튼 없애버리기
function killTellerChannel() {
    document.getElementsByClassName("storyteller_gnb")[0].remove();
    document.getElementsByClassName("group_gnb")[0].remove();
}

//폰트 설정 관련 함수(크기 설정 없음)
function addCustomFontSetting() {
    //다크모드 설정 웹 HTML 설정용
    document.getElementsByClassName("account_modify")[0].getElementsByTagName("fieldset")[0].innerHTML = '<strong class="subtit_modify">카카오스토리 다크모드 설정</strong>'
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
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarkstyle1" class="inp_radio _friendListExposure" id="ksDarkThemeWhite" value="#ffffff"> <label for="ksDarkThemeWhite">Light Mode</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarkstyle1" class="inp_radio _friendListExposure" id="ksDarkThemeDark" value="#40444b"> <label for="ksDarkThemeDark">Dark Mode</label></div></div></dd>'
          //스토리 텔러, 채널 버튼 삭제 설정
        + '<dt>스토리텔러/채널<br>버튼</dt>'
        + '<dd><div class="option_msg"><div class="radio_inp"> <input type="radio" name="open_ksdarktellerkill" class="inp_radio _friendListExposure" id="ksDarkTellerNoKill" value="F"> <label for="ksDarkTellerNoKill">보이기</label></div><div class="radio_inp"> <input type="radio" name="open_ksdarktellerkill" class="inp_radio _friendListExposure" id="ksDarkTellerKill" value="T"> <label for="ksDarkTellerKill">안보이기</label></div></div></dd>'
          //알림 알림기능
        + '<dt>스토리 알림 기능 (베타)</dt>'
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
          //다크테마 정보 보여주기
        + '<dt>다크테마 정보</dt>'
        + '<dd>버전: ' + versionString + '<br>개발: <a href="/_jYmvy" data-id="_jYmvy" data-profile-popup="_jYmvy" style="color: #00b5ff" class="_decoratedProfile">Reflection</a>, <a href="/ldc6974" data-id="ldc6974" data-profile-popup="ldc6974" style="color: #00b5ff" class="_decoratedProfile">박종우</a><br>도움주신 분들: <a href="/_2ZQlS7" data-id="_2ZQlS7" data-profile-popup="_2ZQlS7" style="color: #00b5ff" class="_decoratedProfile">AppleWebKit</a>, 사일</dd>'
          //Apply
        + '<dt></dt>'
        + '<dd><div class="btn_area"><a id="ksdarkApplyCustom" class="btn_com btn_wh" style="background-color: #f26a41 !important">적용</a><p class="info_msg" id="ksdarkFontSave" style="display: none">저장되었습니다. 일부 설정은 새로고침 하셔야 반영됩니다.</p></div></dd>'
        + '</dl>' + document.getElementsByClassName("account_modify")[0].getElementsByTagName("fieldset")[0].innerHTML;

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
        document.getElementById("ksdarkFontSave").style.display = "block";
        setTimeout(() => document.getElementById("ksdarkFontSave").style.display = "none", 3000);
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

$(document).ready(function(){
    $(document).on('click', 'a[data-kant-id="1391"]', function(){
        $(document).on('click', 'a[class="btn_com btn_or _dialogOk _dialogBtn"]', function(){
            var splittedURL = $(location).attr('href').split('/');
            var bannedUserID = splittedURL[splittedURL.length - 1];
            banList.add(bannedUserID);
            $(document).off('click', 'a[class="btn_com btn_or _dialogOk _dialogBtn"]');
        });
    });
    $(document).on('click', 'a[data-kant-id="1392"]', function(){
        var splittedURL = $(location).attr('href').split('/');
        var bannedUserID = splittedURL[splittedURL.length - 1];
        banList.delete(bannedUserID);
        $(document).off('click', 'a[class="btn_com btn_or _dialogOk _dialogBtn"]');
    });

    $(document).on('click', 'a[data-kant-id="845"]', function() {
        var userIdx = $('a[data-kant-id="845"]').index(this);
        var userID = $('a[data-kant-id="844"]').eq(userIdx).parent().attr('data-model');
        banList.delete(userID);
    });

});

(function() {
    //노토산스 폰트 기본 로드(바로 적용 위함)
    GM_addStyle ( "@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);" );
    if (GM_getValue('ksDarkFontSize', '') == "") {
        GM_setValue('ksDarkFontSize', '0');
    }
    if (GM_getValue('ksDarkThemeStyle', '') == "") {
        GM_setValue('ksDarkThemeStyle', '#40444b');
    }
    if (GM_getValue('ksDarkNotyTime', '') == "") {
        GM_setValue('ksDarkNotyTime', '20');
    }

    if (GM_getValue('ksDarkNotySound', '') == "") {
        GM_setValue('ksDarkNotySound', 'true'); //true가 알림사운드 꺼진거임 ㅇㅇ
    }

    if (GM_getValue('ksDarkBan', '') == "") {
        GM_setValue('ksDarkBan', 'false');
    }

    if (GM_getValue('ksDarkThemeStyle', '') == "#40444b") {
        GM_addStyle ( ".ico_ks2 {background: url(\'https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/ico_ks2.png\') no-repeat 0 0; !important;}" );
        //GM_addStyle ( ".ico_ks {background: url(\'https://raw.githubusercontent.com/reflection1921/KakaoStory-DarkTheme/master/ico_ks.png\') no-repeat 0 0; !important;}" );
        loadAdguardFilter();
    }

    if (GM_getValue('ksDarkNotyUse', '') == "") {
        GM_setValue('ksDarkNotyUse', 'T');
    }

    setFontSize();
    initializeNotify();
    getBanUsers();

    if (GM_getValue('ksDarkCustomFontName', '') == "") {
        GM_setValue('ksDarkCustomFontName', 'Noto Sans KR');
        GM_setValue('ksDarkCustomFontCss', 'https://fonts.googleapis.com/css2?family=Gaegu&display=swap');
        GM_addStyle ("@import url(https://fonts.googleapis.com/css2?family=Gaegu&display=swap);");
    } else {
        GM_addStyle("@import url(" + GM_getValue('ksDarkCustomFontCss', '') + ")");
    }

    GM_addStyle ( "body, button, input, select, td, textarea, th {font-family: '" + GM_getValue('ksDarkCustomFontName', '') + "' !important;}" );

    if (GM_getValue('ksDarkKillTeller', '') == '') {
        GM_setValue('ksDarkKillTeller', 'T');
    }
    if (GM_getValue('ksDarkKillTeller', '') == 'T') {
        setTimeout(() => killTellerChannel(), 500);
    }

    //addCustomFontSetting()의 경우 무조건 마지막에 로드하도록 설정해야함.
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

        if (currentPage != location.href) {
            currentPage = location.href;
            var url_parts = currentPage.split("/");
            var url_last_part = url_parts[url_parts.length-1];
            if (url_last_part == 'settings') {
                setTimeout(() => addCustomFontSetting(), 500);
            }
            //setTimeout(() => changeFontSize(), 5000);
        }
    }, 100);
})();
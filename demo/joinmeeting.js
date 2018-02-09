var joinmeeting = (function() {

    var paraMeetingID;
    var paraMeetingPassword;
    var paraMeetingScreenName;
    var paraMeetingLoginType;
    var paraMeetingUid;
    var paraDomain;
    var paraWebinarToken;
    var paraIsRejoin = false;

    var openedVideoStream;

    var inMeeting = false;

    function setInMeeting() {
        inMeeting = true;
    }

    function ifInMeeting() {
        return inMeeting;
    }

    function setJoinParameters(id, password, name, loginType, uid, domain, wtk, isRejoin) {
        paraMeetingID = id;
        paraMeetingPassword = password;
        paraMeetingScreenName = name;
        paraMeetingLoginType = loginType;
        paraMeetingUid = uid;
        paraDomain = domain;
        paraWebinarToken = wtk;
        paraIsRejoin = isRejoin;
    }

    function bindForm() {
        openLoginVideo();
        //keydown keyup keypress
        showConfnoArrowAndScreenName();
        joinFromUrl();
        clearConnetOption();

        $.getJSON('../manifest.json', function(data) {
            var companyName = data.name;
            $(".companyName").each(function() {
                var text = $(this).text();
                text = text.replace(/\$\{companyName\}/g, companyName);
                $(this).text(text);
            })
        });

        var maxLen = 11;
        var fmtChar = ' ';
        $('#join-confno').unbind('keyup').unbind('keypress').keyup(function(e) {
            var el = $(this);
            var oval = el.val();
            if (oval.length > 0) {
                if (isDigit(oval.charAt(0))) {
                    window.setTimeout(function() {
                        // delay some milliseconds to format input and re-calculate caret to make it work on Android webkit browser
                        var caretPos = el.caret();
                        var nval = formatConfNo(oval, fmtChar, maxLen);
                        if (caretPos === 3 || caretPos === 7) {
                            // BACK: delete previous digit as well
                            if (e.keyCode == 8) {
                                caretPos--;
                                // re-format conf no
                                nval = formatConfNo(nval.substr(0, caretPos) + nval.substr(caretPos + 2), fmtChar, maxLen);
                            } else {
                                caretPos++;
                            }
                        }
                        if (oval !== nval) {
                            //el.removeClass("error");
                            el.val(nval);
                            el.caret(caretPos);
                        }
                    }, 10);
                } else {
                    var nval = $.trim(oval).replace(/^\./, "").replace(/[^A-Za-z0-9\.]/g, '').toLowerCase();
                    //el.removeClass("error");
                    if (oval !== nval) {
                        el.val(nval);
                    }
                }
                return false;
            }
        }).keypress(function(e) {
            // Ignore ctrl keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.which < 32) {
                return true;
            }
            // 8: Back, 46: Delete, 35: End, 36: Home, 37: Left, 39: Right, 144: Num Lock
            if (e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 144) {
                return true;
            }

            var el = $(this);
            var caretPos = el.caret();
            var val = el.val();

            if (val.length == 0 || !isDigit(val.charAt(0))) {
                if (!/[A-Za-z0-9\.]/.test(String.fromCharCode(e.which))) {
                    return false;
                }
            } else {
                // only allow 0-9
                if (!/[0-9]/.test(String.fromCharCode(e.which))) {
                    return false;
                }
                if (val.length === maxLen + 2 && caretPos === maxLen + 2) {
                    return false;
                }

            }
        });

        $('#join-confno').bind("input propertychange", function() {
            var reg1 = /^[0-9]*$/;
            var inputValue = Trim(this.value);
            var userName = Trim($('#join-username').val());

            if (reg1.test(inputValue)) { // all is number
                if (inputValue.length > 8 && userName !== '') {
                    $('#btnSubmit').addClass("enabled");
                } else {
                    $('#btnSubmit').removeClass("enabled");
                }
            } else {
                if (inputValue.length > 4 && userName !== '') {
                    $('#btnSubmit').addClass("enabled");
                } else {
                    $('#btnSubmit').removeClass("enabled");
                }
            }
        });


        /*
         $('#join-confno').bind("input propertychange",function () {
         var reg1 = /^[0-9]*$/;
         var reg2 = /^[a-z][a-z0-9]*$/;
         var reg3 = /^[a-zA-Z][a-zA-Z0-9]*$/;

         var inputValue = Trim(this.value);

         //	setCursorPosition(document.getElementById('join-confno'),2);

         if(!(reg1.test(this.value)||reg2.test(this.value))){
         if(reg3.test(inputValue)){
         this.value = inputValue.toLowerCase();
         }else{
         this.value = this.value.replace(/[^0-9]/g,'');
         }

         }
         inputValue = Trim(this.value);
         if(reg1.test(inputValue)){// all is number
         var temp = inputValue;
         if(inputValue.length>11){
         temp = inputValue.substr(0,11);
         }
         this.value = common.addSpace(temp);

         if(inputValue.length>8){
         $('#btnSubmit').addClass("enabled");
         }else{
         $('#btnSubmit').removeClass("enabled");
         }
         }else{
         if(inputValue.length>4){
         $('#btnSubmit').addClass("enabled");
         }else{
         $('#btnSubmit').removeClass("enabled");
         }
         }
         })
         */
        $('#join-username').bind("input propertychange", function() {
            inputValue = Trim(this.value);

            if (inputValue.length >= 1) {
                $('#btnSubmit').addClass("enabled");
            } else {
                $('#btnSubmit').removeClass("enabled");
            }
        });

        $('.join-close').off('click').click(function() {
            if (!$('.waiting_container').hasClass('hideMe')) {
                inmeeting.createLeaveMeetingWindow('leaveConfirm');
            } else {
                window.close();
            }
        });

        $(".winbar .right").delegate("span", "click", function(e) {
            var spanName = $(this).attr('data-name');
            if (spanName == "minimize") {
                inmeeting.minimize();
            } else if (spanName == "maxmize") {
                //inmeeting.fullScreen();
            } else if (spanName == "restore") {
                inmeeting.restorScreen();
            }
        });

        $('.logo-icon').dblclick(function() {
            createPopWindow('file', 'file.html', 500, 260);
        });

        $(".confno").bind("click", function(e) {
            showConfList();
            e.stopPropagation();
        });

        $("body").bind("click", function(e) {
            $('.conflist').hide();
        });


        $(".conflist").delegate("li", "click", function(e) {
            if ($(this).text() == 'Clear History') {
                clearConfList();
            } else {
                $("#join-confno").val($(this).attr('data-name'));
                $('#btnSubmit').addClass("enabled");
            }
        });


        $(".checkbox").delegate("input", "click", function(e) {
            if ($(this).attr("data-name") == "audio") {
                setConnectOption();
            } else if ($(this).attr("data-name") == "video") {
                setVideoOption();
            }
        });

        $(".tabs li").off('click').click(function() {

            var width = document.documentElement.offsetWidth;
            var height = document.documentElement.offsetHeight;

            $(".tabs li").removeClass("selected").addClass("unselected"); //Remove any "active" class
            $(this).addClass("selected").removeClass("unselected"); //Add "active" class to selected tab
            $(".tab-content").hide(); //Hide all tab content
            var activeTab = $(this).find("span").attr("data-url"); //Find the rel attribute value to identify the active tab + content
            $(activeTab).show(); //Fade in the active content

        });

        $(".tab2").delegate(".button", "click", function(e) {
            var url;
            if ($(this).attr("data-name") == "withVideo") {
                url = "https://meetings.ringcentral.com/start/videomeeting?from=cc";
            } else if ($(this).attr("data-name") == "withoutVideo") {
                url = "https://meetings.ringcentral.com/start/webmeeting?from=cc";
            }

            if (navigator.userAgent.indexOf('CrOS') != -1) {
                util.openTab(url);
            } else {
                chrome.app.window.create(
                    'webview.html', {
                        id: "webviewWin",
                        hidden: true,
                        width: 1000,
                        height: 600,
                        resizable: false,
                        alwaysOnTop: false
                    }, // only show window when webview is configured
                    function(appWin) {
                        appWin.contentWindow.addEventListener('DOMContentLoaded',
                            function(e) {
                                // when window is loaded, set webview source
                                var webview = appWin.contentWindow.document.querySelector('webview');
                                webview.src = url;
                                // now we can show it:
                                appWin.show();
                            }
                        );
                    });
            }
        });
    }

    function bindRegister() {

        if (localStorage.registerName !== undefined) {
            $('#register-name').val(localStorage.registerName);
        } else {
            $('#register-name').val($('#join-username').val());
        }

        if (localStorage.registerEmail !== undefined) {
            $('#register-email').val(localStorage.registerEmail);
            $('#registerSubmit').addClass("enabled");
        }

        $('#register-email').bind("input propertychange", function() {
            //	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            //	var reg = /\w@\w+\.\w/;
            var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            if (reg.test(this.value)) {
                $('#registerSubmit').addClass("enabled");
            } else {
                $('#registerSubmit').removeClass("enabled");
            }
        });

        $("#registerSubmit").off('click').click(function() {
            if ($('#registerSubmit').hasClass('enabled')) {
                showRegister(0);
                showConnecting();
                var userName = $('#join-username').val();
                var email = $('#register-email').val();
                var name = $('#register-name').val();
                if (name === '') {
                    name = userName;
                }
                chrome.storage.local.set({ "registerEmail": email }, function() {});
                chrome.storage.local.set({ "registerName": name }, function() {});

                backgroundWindow.setRegisterEmail(email);
                backgroundWindow.setRegisterName(name);

                common.naclModule.postMessage({
                    type: "conf",
                    command: "conf.regWebinar",
                    name: name,
                    email: email
                });
            }
        });

        $("#register-form span.cancel").off('click').click(function() {
            joinmeeting.showRegister(0);
            joinmeeting.showJoinForm(1);
        });


        $('#register-form').unbind('keyup').keyup(function(e) {
            if ($('#registerSubmit').hasClass("enabled") && e.keyCode == 13) {
                $('#registerSubmit').click();
            }
        });
    }


    function joinBtnBindEventListener() {

        $("#btnSubmit").off('click').click(function() {
            if (formCheck()) {
                formSubmit();
            }
        });

        $("#join-form input[type=text]").keydown(function(event) {
            if (event.keyCode == "13") {
                if (formCheck()) {
                    formSubmit();
                }
            }
        });

    }

    function formSubmit() {
        var confNo = Trim($('#join-confno').val());
        var userName = $('#join-username').val();
        saveScreenName(userName);
        showConnecting();
        var notConnectAudioFlag = false;
        if (localStorage.connectOption === true) {
            notConnectAudioFlag = true;
        } else {
            if (localStorage.connectOption4Computer === true || localStorage.connectOption4Computer === undefined) {
                notConnectAudioFlag = false;
            } else {
                notConnectAudioFlag = true;
            }
        }
        var timer = setInterval(function() {
            if (common.naclModule !== null) {
                clearInterval(timer);

                if (paraIsRejoin) {
                    console.log("Try to rejoin meeting...");
                    chrome.storage.local.get("lcpString", function(o) {
                        if (o.lcpString) {
                            common.naclModule.postMessage({
                                type: 'user',
                                command: 'user.rejoinConf',
                                confNo: confNo,
                                lcpString: o.lcpString,
                                changeRole: backgroundWindow.getReconnectForChangeRole(),
                                domain: backgroundWindow.getWebDomain(),
                                registerEmail: backgroundWindow.getRegisterEmail(),
                                registerName: backgroundWindow.getRegisterName()
                            });

                            backgroundWindow.setReconnectForChangeRole(-1);
                        } else {
                            common.naclModule.postMessage({
                                type: 'user',
                                command: 'user.joinConf',
                                confNo: confNo,
                                userName: userName,
                                password: paraMeetingPassword,
                                loginType: paraMeetingLoginType,
                                uid: paraMeetingUid,
                                domain: paraDomain,
                                wtk: paraWebinarToken,
                                notConnectAudio: notConnectAudioFlag
                            });
                        }
                    });
                } else {
                    common.naclModule.postMessage({
                        type: 'user',
                        command: 'user.joinConf',
                        confNo: confNo,
                        userName: userName,
                        password: paraMeetingPassword,
                        loginType: paraMeetingLoginType,
                        uid: paraMeetingUid,
                        domain: paraDomain,
                        wtk: paraWebinarToken,
                        notConnectAudio: notConnectAudioFlag
                    });

                    var rejoinParam = {};
                    rejoinParam.meetingID = confNo;
                    rejoinParam.meetingScreenName = userName;
                    backgroundWindow.setRejoinParams(rejoinParam);
                }
            }

        }, 500);


    }

    function formCheck() {
        var confNo = Trim($('#join-confno').val());
        var userName = $('#join-username').val();
        if ((confNo === "") || (userName === "") || !$('#btnSubmit').hasClass('enabled')) {
            var timer;
            if (confNo === "") {
                //	$('#join-confno').focus();
                timer = inputRemind('join-confno');
            } else if (userName === "") {
                //	$('#join-username').focus();
                timer = inputRemind('join-username');
            }
            $('#join-confno,#join-username').one("focus", function() {
                $('#join-confno,#join-username').removeClass('focus');
                clearInterval(timer);
            });

            return false;
        } else {
            return true;
        }
    }

    function inputRemind(id) {
        var step = 0;
        var timer = setInterval(function() {
            step++;
            if (step >= 6) {
                clearInterval(timer);
                $('#' + id).removeClass('focus');
                $('#' + id).focus();
                return;
            }
            if (step % 2 == 1) { $('#' + id).addClass('focus'); }
            if (step % 2 == 0) { $('#' + id).removeClass('focus'); }
        }, 500);

        return timer;
    }

    function showConnecting() {
        $('#content').addClass('hideMe');
        $('.connecting').css('z-index', 20).removeClass('hideMe');
    }

    function showWaiting() {
        if (meetingStatusObject.isWebinar == 1) {
            $('.meeting-type').text('webinar');
        } else {
            $('.meeting-type').text('meeting');
        }
        $('.waiting_container').removeClass('hideMe');
        $('.connecting').addClass('hideMe');
        $("#register").addClass("hideMe");
        bindWaiting();
    }

    function showRegister(flag) {
        if (flag) {
            $('#content').addClass('hideMe');
            $("#register").removeClass("hideMe");
            $('.connecting').addClass('hideMe');
            bindRegister();
        } else {
            $("#register").addClass("hideMe");
        }
    }

    function showWebinarUrl() {
        $('#content').addClass('hideMe');
        $('.connecting').addClass('hideMe');
        $(".webinar-approve").removeClass("hideMe");
    }

    function showJoinForm() {
        $('#content').removeClass('hideMe');
        $('.connecting').addClass('hideMe');
    }


    function saveScreenName(screenName) {
        chrome.storage.local.set({ "screenName": screenName }, function() {
            $('#screenName').val(screenName);
        });
    }


    function saveConfList(msg) {
        var meetingno = common.addSpace(msg.meetingno);
        var meetingtopic = msg.meetingtopic;
        var meetingInfo = {
            meetingno: meetingno,
            meetingtopic: meetingtopic
        };
        var confList;
        if (localStorage.confList !== undefined) {
            confList = localStorage.confList;
            for (var i = 0; i < confList.length; i++) {
                if (confList[i].meetingno == meetingno) {
                    confList.splice(i, 1);
                    break;
                }
            }

        } else {
            confList = new Array();
        }

        confList.unshift(meetingInfo);

        while (confList.length > 10) {
            confList.pop();
        }

        chrome.storage.local.set({ "confList": confList }, function() {});
    }

    function showConfList() {
        $('.conflist').empty();
        if (localStorage.confList !== undefined) {
            var confList = localStorage.confList;
            for (var i = 0; i < confList.length; i++) {
                if (confList[i].meetingno !== undefined) { // compatible for old versions
                    var li = '<li class="conflist-text clearfix"  data-name="' + confList[i].meetingno + '">' +
                        '<span class="left">' + confList[i].meetingtopic + '</span>' +
                        '<span class="right">' + common.addShortLine(Trim(confList[i].meetingno)) + '</span>' +
                        '</li>';
                    $('.conflist').append(li);
                }
            }
            $('.conflist').append('<li class="conflist-text clearHistory">Clear History</li>');
        }
        $('.conflist').show();
    }

    function clearConfList() {
        chrome.storage.local.remove("confList", function() {
            $('.confno').hide();
        });
    }


    function showConfnoArrowAndScreenName() {

        if (localStorage.confList !== undefined) {
            var confList = localStorage.confList;
            if (confList.length > 0) {
                $('.confno').show();
            } else {
                $('.confno').hide();
            }
        } else {
            $('.confno').hide();
        }

        if (localStorage.screenName !== undefined) {
            $('#join-username').val(localStorage.screenName);
        }
    }

    function clearConnetOption() {
        chrome.storage.local.remove("connectOption", function() {});
    }

    function setConnectOption() {
        var connectOption = $('#connectOption').is(':checked');
        localStorage.connectOption = connectOption;
        chrome.storage.local.set({ "connectOption": connectOption }, function() {});
    }


    function setVideoOption() {
        var videoOption = $('#videoOption').is(':checked');
        if (videoOption) {
            $('#mask').removeClass("mask").addClass("mask-img");
            stopCamera();
            meetingAutoStartMyVideo = false;
        } else {
            $('#mask').removeClass("mask-img").addClass("mask");
            openLoginVideo();
            meetingAutoStartMyVideo = true;
        }
        //chrome.storage.local.set({"videoOption": videoOption}, function(){});
    }

    function joinFromUrl() {

        if (paraMeetingScreenName !== '') {
            $('#join-username').val(paraMeetingScreenName);
        }
        if (paraMeetingID !== '') {
            $('#join-confno').val(common.addSpace(paraMeetingID));
        }

        if ($('#join-confno').val() !== '' && $('#join-username').val() !== '') {
            $('#btnSubmit').addClass("enabled");
        }

        if (formCheck()) {
            formSubmit();
        }
    }


    function createJoinConfFailWindow(classFlag, meetingTopic, reason, param) {
        createPopWindow('invalidRoomWindow', 'window/invalidroomWindow.html?classFlag=' + classFlag + '&meetingTopic=' + meetingTopic + '&reason=' + reason + '&param=' + param, 510, 194);
    }

    function openLoginVideo() {
        var video = document.getElementById("videobcg");

        videoConstraints = { "video": true };
        errBack = function(error) {
            common.showLog("Video capture error: ", error.code);
        };

        navigator.webkitGetUserMedia(videoConstraints, function(stream) {
            openedVideoStream = stream;
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }

    function stopCamera() {
        if (!openedVideoStream)
            return;

        openedVideoStream.getVideoTracks().forEach(function(track) {
            track.stop();
        });
    }

    function bindWaiting() {
        $('.waiting .div2').html(meetingStatusObject.meetingTopic);
        // $('.waiting-close').off('click').click(function(){
        // 	console.log('waiting close..........')
        // 	inmeeting.createLeaveMeetingWindow('leaveConfirm');
        // });
    }

    function verifyJoinPassword(password) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.setPassword',
            password: password
        });

        var rejoinParam = {};
        rejoinParam.meetingPassword = password;
        backgroundWindow.setRejoinParams(rejoinParam);
    }

    function closeVerifyJoinWindow() {
        chrome.runtime.sendMessage({ message: "closeVerifyJoinWindow_fromMain" }, function(response) {});
    }

    function showJoinPasswordError() {
        chrome.runtime.sendMessage({ message: "showJoinPasswordError_fromMain" }, function(response) {
            common.showLog(response.reply);
        });
    }


    function formatConfNo(confNo, fmtChar, maxLen) {
        fmtChar = fmtChar || ' ';
        maxLen = maxLen || 11;
        confNo = $.trim(confNo).replace(/[^\d]/g, '');
        if (confNo.length > maxLen) {
            confNo = confNo.substr(0, maxLen);
        }
        var result = confNo.substr(0, 3);
        if (confNo.length == 11) {
            result += fmtChar + confNo.substr(3, 4) + fmtChar + confNo.substr(7);
        } else {
            if (confNo.length >= 3) {
                result += fmtChar + confNo.substr(3, 3);
            }
            if (confNo.length >= 6) {
                result += fmtChar + confNo.substr(6);
            }
        }
        return result;
    }

    function isDigit(c) {
        return (c >= '0' && c <= '9');
    }

    function showPasswordForm(flag, passwordError) {
        if (flag) {
            $('#password-value').val('');
            $('#password-submit').removeClass("enabled");

            $('#content').addClass('hideMe');
            $("#password-win").removeClass("hideMe");
            $('.connecting').addClass('hideMe');
            bindPasswordForm();
            if (passwordError) {
                $('#password-form .error-msg').removeClass('visibility-hidden');
            } else {
                $('#password-form .error-msg').addClass('visibility-hidden');
            }
            $('#password-value').focus();
        } else {
            $("#password-win").addClass("hideMe");
        }
    }

    function bindPasswordForm() {

        $('#password-value').unbind("input propertychange").bind("input propertychange", function() {
            if (util.Trim(this.value).length > 0) {
                $('#password-submit').addClass("enabled");
                $('#password-form .error-msg').addClass('visibility-hidden');
            } else {
                $('#password-submit').removeClass("enabled");
            }
        });

        $("#password-submit").off('click').click(function(e) {
            if ($('#password-submit').hasClass('enabled')) {
                showPasswordForm(0);
                showConnecting();
                var password = $('#password-value').val();
                verifyJoinPassword(util.Trim(password));
            }
        });

        $('#password-value').unbind('keyup').keyup(function(e) {
            if ($('#password-submit').hasClass("enabled") && e.keyCode == 13) {
                $('#password-submit').click();
            }
        });

        $("#password-form span.cancel").off('click').click(function() {
            joinmeeting.showPasswordForm(0);
            joinmeeting.showJoinForm(1);
        });
    }

    // The symbols to export.
    return {
        setInMeeting: setInMeeting,
        ifInMeeting: ifInMeeting,
        bindForm: bindForm,
        bindRegister: bindRegister,
        bindWaiting: bindWaiting,
        saveConfList: saveConfList,
        showWaiting: showWaiting,
        showJoinForm: showJoinForm,
        showRegister: showRegister,
        verifyJoinPassword: verifyJoinPassword,
        showJoinPasswordError: showJoinPasswordError,
        createJoinConfFailWindow: createJoinConfFailWindow,
        joinBtnBindEventListener: joinBtnBindEventListener,
        setJoinParameters: setJoinParameters,
        closeVerifyJoinWindow: closeVerifyJoinWindow,
        showPasswordForm: showPasswordForm,
        stopCamera: stopCamera
    };

}());
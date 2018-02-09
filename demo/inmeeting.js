var audioInputDevices = [];
var audioOutputDevices = [];
var videoInputDevices = [];

var videoConstraints = {};

var shareStream;
var lastShareStream;

var inmeeting = (function() {

    var isInMovingSharePicture = false;

    var rectTextShow = false;

    var videoIsSending = false;

    //chrome share capture
    function gotStream(stream) {
        var dys = document.getElementById("dummyShare");
        dys.src = URL.createObjectURL(stream);

        stream.oninactive = function() {
            common.showLog('Inactive, isFullscreen()=' + mainWindow.isFullscreen() + ', isMinimized()=' + mainWindow.isMinimized());
            stopShare();
            // for not stopped by user
            closeShareWindow();
            restoreMainWindow();
        };

        //stream.getVideoTracks()[0].onactive = function() {console.log('Active');}

        shareStream = stream;

        common.naclModule.postMessage({
            type: 'share',
            command: 'share.startShare',
            track: stream.getVideoTracks()[0]
        });

    }

    function getUserMediaError(e) {
        console.log("getUserMediaError");
    }


    function onAccessApproved(desktop_id) {
        console.log('onAccessApproved');
        if (!hostForceStartShare && !startShareCheck()) {
            return;
        }

        var shareMainWin = chrome.app.window.get('shareMainWindow');
        if (shareMainWin) shareMainWin.show();

        hostForceStartShare = false;
        if (!desktop_id) {
            common.showLog('Desktop Capture access rejected.');
            return;
        }
        if (lastShareStream) {
            lastShareStream.oninactive = null;
            lastShareStream.getTracks()[0].stop();
        }

        mainWindow.minimize();

        var maxFrameRateTmp = 10;
        if (machineInfo.archName.indexOf("x86") != -1)
            maxFrameRateTmp = 20;

        var maxCaptureWidth = 1920;
        if ((machineInfo.width > 0) && (machineInfo.width < 1920)) {
            maxCaptureWidth = machineInfo.width;
        }

        var maxCaptureHeight = 1200;
        if ((machineInfo.height > 0) && (machineInfo.height < 1200)) {
            maxCaptureHeight = machineInfo.height;
        }

        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: desktop_id,
                    maxWidth: maxCaptureWidth,
                    maxHeight: maxCaptureHeight,
                    maxFrameRate: maxFrameRateTmp
                }
            }
        }, gotStream, getUserMediaError);
    }


    function bindEvent() {
        setMainAppWindowObject(mainWindow);

        initUI();
        canStartCMRCheck();
        //initAudioStatus();


        //initHostLockWindow();
        $(document).delegate(".window-close", "click", function(e) {
            var spanName = $(this).attr('data-name');
            if (spanName == "inmeeting-window") {
                if (myStatusObject.isHost) {
                    createLeaveMeetingWindow('endConfirm');
                } else {
                    createLeaveMeetingWindow('leaveConfirm');
                }
            } else {
                closeDivWindow(spanName);
            }
        });

        $('.toolbar,.headbar,.navi,.webinar-viewer-bar').dblclick(function(e) {
            e.stopPropagation();
        });

        $(".winbar .right").delegate("span", "click", function(e) {
            var spanName = $(this).attr('data-name');
            if (spanName == "minimize") {
                minimize();
            } else if (spanName == "maxmize") {
                fullScreen();
            }
        });

        chrome.commands.onCommand.addListener(function(command) {
            if (meetingStatusObject.meetingNo != 0) {
                if (command == 'toggle-audio') {
                    if (myStatusObject.audioType == 'AUDIO_TELEPHONY') {
                        $('.toolbar li[data-name="phone"]').click();
                    } else {
                        $('.toolbar li[data-name="mute"]').click();
                    }
                } else if (command == 'toggle-video') {
                    $('.toolbar li[data-name="video"]').click();
                }
            }
        });
    }


    function initStartVideoWindow() {
        $('.confirm-startvideo').delegate("span", "click", function(e) {
            var spanName = $(this).attr('data-name');
            if (spanName == "yes") {
                if (meetingStatusObject.meetingIsViewOnly) return;
                startMyVideo();
            }
            closeDivWindow('window-startvideo');
        });
    }

    function initMeetingAlertWindow() {
        $('.confirm-meetingalert').delegate("span", "click", function(e) {
            closeDivWindow('window-meetingalert');
        });
    }

    function initStartShareWindow() {

        $('.confirm-startshare').delegate("span", "click", function(e) {
            var spanName = $(this).attr('data-name');
            if (spanName == "yes") {
                startShare();
                hostForceStartShare = true;
            } else {
                hostForceStartShare = false;
            }
            closeDivWindow('window-startshare');
        });
    }

    function initTalkingUserPanel() {

        $('.attendee').hover(function() {
            showTalkingUserBar(1);
        }, function() {
            if ($('.userlist-mode:hover').length > 0) {
                showTalkingUserBar(1);
            } else {
                showTalkingUserBar(0);
            }
        });


        $('.userlist-mode').hover(function() {}, function() {
            showTalkingUserBar(0);
        });

        $('.rect-text').hover(function() {
            showTalkingUserBar(1);
        }, function() {
            if ($('.userlist-mode:hover').length > 0) {
                showTalkingUserBar(1);
            } else {
                showTalkingUserBar(0);
            }
        });

    }

    function initListener() {
        $('#listener').css('z-index', 5);

        $('#listener').dblclick(function() {
            if (chrome.app.window.current().isFullscreen()) {
                restorScreen();
            } else {
                fullScreen();
            }
        });

        $('.screen-mode').delegate("i", "click", function(e) {
            if ($(this).hasClass('img-fullscreen')) {
                fullScreen();
            } else {
                restorScreen();
            }
        });

        $('.statistics-info').delegate("i", "click", function(e) {
            createPopWindow('settingWindow', 'window/settingWindow.html', 680, 500);
        });

        $('.switch-view').click(function(e) {
            if ($(this).find('span').attr('data-name') == 'speakerview') {
                switchToActiveSpeakerView();
            } else {
                switchToGalleryView();
            }
        });

        $('.turnpage-gallery').delegate("a", "click", function(e) {
            if ($(this).attr('data-name') == 'prev') {
                if ($(this).closest('.left').hasClass('enabled')) {
                    showPrePageVideo();
                }
            } else if ($(this).attr('data-name') == 'next') {
                if ($(this).closest('.right').hasClass('enabled')) {
                    showNextPageVideo();
                }
            }
        });


        $('#video-mode').delegate("i", "click", function(e) {
            if ($(this).hasClass('img-hidevideo')) {
                $('.img-hidevideo').addClass('forceHide');
                $('.img-showvideo').removeClass('forceHide');
            } else {
                $('.img-hidevideo').removeClass('forceHide');
                $('.img-showvideo').addClass('forceHide');
            }
        });

        $('.userlist-mode').delegate("span", "click", function(e) {
            if ($(this).hasClass('rect-small')) {
                $('.rect-small i').addClass("selected");
                $('.rect-medium i').removeClass("selected");
                $('.rect-text').removeClass("hideMe");
                common.naclModule.postMessage({
                    type: 'video',
                    command: 'fullscreen.hideThumbVideo'
                });
                rectTextShow = true;

            } else if ($(this).hasClass('rect-medium')) {
                $('.rect-medium i').addClass("selected");
                $('.rect-small i').removeClass("selected");
                $('.rect-text').addClass("hideMe");
                common.naclModule.postMessage({
                    type: 'video',
                    command: 'fullscreen.showThumbVideo'
                });
                rectTextShow = false;
            }
        });

        $('#dummyShare').resize(function(e) {

            var newWidth = document.getElementById("dummyShare").videoWidth;
            var newHeight = document.getElementById("dummyShare").videoHeight;

            common.naclModule.postMessage({
                type: 'share',
                command: 'share.newSize',
                width: newWidth,
                height: newHeight
            });

        });

    }

    function initParticipantPanelHeadMenu() {
        $('#participant-panel .headMenu').off('click').click(function(e) {
            $('#participant-panel .headBottom').removeClass('hideMe');
            clickOnce();
            e.stopPropagation();
        });

        $('#participant-panel .headMenuClose').off('click').click(function() {
            $('#participant-panel .headBottom').addClass('hideMe');
            toggleSidePanel('participant-panel');
        });

        $('#participant-panel .headMenuPop').off('click').click(function() {
            $('#participant-panel .headBottom').addClass('hideMe');
            toggleSidePanel('participant-panel');
            createParticipantListWindow(true);
        });
    }

    function initChatPanel() {
        $('#chat-panel .headMenu').off('click').click(function(e) {
            $('#chat-panel .headBottom').removeClass('hideMe');
            clickOnce();
            e.stopPropagation();

        });

        $('#chat-panel .headMenuClose').off('click').click(function() {
            $('#chat-panel .headBottom').addClass('hideMe');
            toggleSidePanel('chat-panel');
        });

        $('#chat-panel .headMenuPop').off('click').click(function() {
            $('#chat-panel .headBottom').addClass('hideMe');
            toggleSidePanel('chat-panel');
            createChatWindow(true);
        });
    }

    function autoShow(flag) {
        var isToolbarShown = true;
        if (flag && isInMovingSharePicture) return;

        if ($(".toolbar").css('display') == 'none') {
            isToolbarShown = false;
        }

        if (flag) {
            if (!isToolbarShown) {
                $(".toolbar,.screen-mode,.statistics-info").fadeIn(200);
                if (meetingStatusObject.activeShareUserId == 0) {
                    //$(".switch-view,.turnpage-gallery").fadeIn(200);
                    showSwitchView(1);
                }
                $(".active-speaker").css('bottom', '52px');
            }

            window.clearTimeout(mousemoveTimer);
            if ($('.toolbar:hover').length <= 0 && $('.audioSetting').hasClass('hideMe') && $('.videoSetting').hasClass('hideMe') && $('.webinar-more').hasClass('hideMe')) {
                mousemoveTimer = window.setTimeout(function() {
                    autoShow(0);
                }, 3000);
            }
        } else {
            if ($('.toolbar').hasClass('forceShow')) {
                return;
            }
            if (isToolbarShown) {
                $(".toolbar,.screen-mode,.statistics-info").fadeOut(200);
                showSwitchView(0);
                $(".active-speaker").css('bottom', '0px');
            }
        }
    }

    function showSwitchView(flag) {
        if (flag) {
            $(".switch-view,.turnpage-gallery").fadeIn(200);
        } else {
            $(".switch-view,.turnpage-gallery").fadeOut(1);
        }
    }

    function initUI() {
        $.getJSON('../manifest.json', function(data) {
            var companyName = data.name;
            $(".companyName").each(function() {
                var text = $(this).text();
                text = text.replace(/\$\{companyName\}/g, companyName);
                $(this).text(text);
            })
        });
        if (meetingStatusObject.isWebinar) {
            initPollingWindowUI();
        }

        if (meetingStatusObject.isWebinar && meetingStatusObject.meetingIsViewOnly) {
            $(".toolbar").addClass('forceHide');
            $(".switch-view").addClass('forceHide');
            $(".webinar-viewer-bar").removeClass('forceHide');
            initWebinarViewerBar();
            showQAOption();
            refreshWebinarViewerBarUI();
        } else if (meetingStatusObject.isWebinar) {
            $(".toolbar").removeClass('forceHide');
            $(".webinar-viewer-bar").addClass('forceHide');
            $(".toolbar li.invite").addClass('forceHide');
            $(".toolbar li.qa").removeClass('forceHide');
            $(".toolbar li.more").removeClass('forceHide');
            initToolbar();
            enumerateDevices();
            initParticipantPanelHeadMenu();
            initStartVideoWindow();
            initMuteAllWindow();
            initStartShareWindow();
            initParticipantListView();

            if (meetingStatusObject.isWebinar && myStatusObject.isHost) {
                showPollingButtonInToolbar(1);
            }

        } else {
            $(".toolbar").removeClass('forceHide');
            $(".webinar-viewer-bar").addClass('forceHide');
            initToolbar();
            enumerateDevices();
            initParticipantPanelHeadMenu();
            initStartVideoWindow();
            initMuteAllWindow();
            initStartShareWindow();
            initParticipantListView();
        }
        showMeetingNo();
        initChatPanel();
        initListener();
        initMeetingAlertWindow();
    }

    function initWebinarViewerBar() {
        $(".webinar-viewer-bar").delegate("li", "click", function(e) {
            var liName = $(this).attr('data-name');
            if (liName == "audio") {

            } else if (liName == "qa") {
                createPopWindowResizeable('qaWin', 'window/qaWindow.html', 500, 600, 500, 600);
                qa.showQARemind4Viewer(0);
            } else if (liName == "chat") {
                chat.showChat();
            } else if (liName == "raise") {
                raiseHandInWebinar();
            } else if (liName == "lower") {
                lowerHandInWebinar();
            }
        });
    }

    function initToolbar() {
        initToolbarHoverListener();

        $(".toolbar").hover(function() {
            window.clearTimeout(mousemoveTimer);
        }, function() {});

        $(".record-container li.recording-status").hover(function() {
            $(".record-container").addClass("recording-background-left");
        }, function() {
            $(".record-container").removeClass("recording-background-left");
        });
        $(".record-container li.stoprecord").hover(function() {
            $(".record-container").addClass("recording-background-right");
        }, function() {
            $(".record-container").removeClass("recording-background-right");
        });


        $('.leaveMeeting').off('click').click(function() {
            if (myStatusObject.isHost) {
                createLeaveMeetingWindow('endConfirm');
            } else {
                createLeaveMeetingWindow('leaveConfirm');
            }
        });

        if (meetingStatusObject.meetingIsViewOnly) {
            $('li.share').addClass('forceHide');
        } else {
            $('li.share').removeClass('forceHide');
        }

        $(".toolbar").delegate("li", "click", function(e) {

            var liName = $(this).attr('data-name');
            if (liName == "mute") {
                mute();
            } else if (liName == "phonemute") {
                mute();
            } else if (liName == "video") {
                toggleMyVideo();
            } else if (liName == "participant") {
                var plistWin = chrome.app.window.get('plistWin');
                if (plistWin === null) {
                    if (chrome.app.window.current().isFullscreen()) {
                        toggleDivWindow('window-participant');
                    } else {
                        if (meetingStatusObject.lastPlistInPopup) {
                            createParticipantListWindow(false);
                        } else {
                            toggleSidePanel('participant-panel');
                        }
                    }
                } else {
                    plistWin.focus();
                }

            } else if (liName == "audio") {
                showJoinAudioWindow();
                //joinAudio();
            } else if (liName == "invite") {
                toggleDivWindow('window-invite');
                //createPopWindow('inviteWin','window/inviteWindow.html',420,200);
            } else if (liName == "chat") {
                if (!meetingStatusObject.isInWaitingRoom)
                    chat.showChat();
            } else if (liName == "share") {
                if (startShareCheck()) {
                    startShare();
                }
            } else if (liName == "record") {
                startCMR();
            } else if (liName == "stoprecord") {
                stopCMR();
            } else if (liName == "pauserecord") {
                pauseCMR();
            } else if (liName == "resumerecord") {
                resumeCMR();
            } else if (liName == "qa") {
                createPopWindowResizeable('qaWin', 'window/qaWindow.html', 500, 600, 500, 600);
            } else if (liName == "poll") {
                showPollingWindow(1);
            }
        });

        $('.muteArrow').on("click", function(e) {
            if ($('.audioSetting').hasClass('hideMe')) {
                $('.audioSetting').removeClass('hideMe');
                enumerateDevices();
                clickOnce();
            } else {
                $('.audioSetting').addClass('hideMe');
            }
            $('.videoSetting').addClass('hideMe');
            $('.webinar-more').addClass('hideMe');
            e.stopPropagation();
        });

        $('.videoArrow').on("click", function(e) {

            if ($('.videoSetting').hasClass('hideMe')) {
                $('.videoSetting').removeClass('hideMe');
                enumerateDevices();
                clickOnce();
            } else {
                $('.videoSetting').addClass('hideMe');
            }
            $('.audioSetting').addClass('hideMe');
            $('.webinar-more').addClass('hideMe');
            e.stopPropagation();
        });

        $('.phoneArrow').on("click", function(e) {
            showJoinAudioWindow();
            $('.audioSetting').addClass('hideMe');
            $('.videoSetting').addClass('hideMe');
            $('.webinar-more').addClass('hideMe');
            e.stopPropagation();
        });


        $(".audioSetting").delegate("dd", "click", function(e) {
            if ($(this).attr('data-type') == 'Microphone') {
                changeAudioInput($(this).attr('data-value'));
            } else if ($(this).attr('data-type') == 'Speaker') {

            } else if ($(this).attr('data-value') == 'leaveAudio') {
                leaveAudio();
            } else if ($(this).attr('data-value') == 'audioOption') {
                showJoinAudioWindow();
            }
        });

        $(".videoSetting").delegate("dd", "click", function(e) {
            if ($(this).attr('data-type') == 'Camera') {
                changeVideoInput($(this).attr('data-value'));
            }
        });

        //if(meetingStatusObject.isWebinar){
        $('.toolbar li.more').on("click", function(e) {

            if ($('.webinar-more').hasClass('hideMe')) {
                $('.webinar-more').removeClass('hideMe');
                clickOnce();
            } else {
                $('.webinar-more').addClass('hideMe');
            }
            $('.audioSetting').addClass('hideMe');
            $('.videoSetting').addClass('hideMe');
            e.stopPropagation();
        });


        $(".webinar-more").delegate("dd", "click", function(e) {
            if ($(this).attr('data-value') == 'invite') {
                toggleDivWindow('window-invite');
            } else if ($(this).attr('data-value') == 'record') {
                startCMR();
            } else if ($(this).attr('data-value') == 'resumerecord') {
                resumeCMR();
            } else if ($(this).attr('data-value') == 'pauserecord') {
                pauseCMR();
            } else if ($(this).attr('data-value') == 'stoprecord') {
                stopCMR();
            }
        });
        //}
    }

    function startShareCheck() {
        var result = false;
        if (!myStatusObject.isHost && meetingStatusObject.isShareLocked) {
            //showNotice('Host disabled attendee screen sharing.');
            inmeeting.showMeetingAlert('Zoom', 'Host disabled attendee screen sharing.');
        } else if (meetingStatusObject.isInWaitingRoom) {
            inmeeting.showMeetingAlert('Zoom', 'Illegal operation!');
        } else if (meetingStatusObject.activeShareUserId != 0) {
            var attendeeObj = getAttendeeObject(meetingStatusObject.activeShareUserId);
            if (attendeeObj.isMyself) {
                result = true;
            } else if (!myStatusObject.isHost && !attendeeObj.isMyself) {
                inmeeting.showMeetingAlert('Zoom', 'You cannot start screen share while the other participant is sharing.');
            } else if (myStatusObject.isHost && !attendeeObj.isMyself) {
                showDivWindow('window-startshare');
            }
        } else {
            result = true;
        }

        return result;
    }

    function initToolbarHoverListener() {
        $("body").hover(function() {
            if ($('.sidePanel:hover').length <= 0) {
                autoShow(1);
            }
        }, function() {
            if ($('.audioSetting').hasClass('hideMe') && $('.videoSetting').hasClass('hideMe') && $('.webinar-more').hasClass('hideMe')) {
                autoShow(0);
            }
        });

        $('#listener').mousemove(function() {
            autoShow(1);
        });
    }

    function initOptionList() {
        $('.optionlist').empty();
        if ($('#shareScreenSizeFlag').val() == 'original') {
            $('.optionlist').append('<li data-name="fit">Fit to Window</li>');
        } else {
            $('.optionlist').append('<li data-name="original">Original Size</li>');
        }

        if (chrome.app.window.current().isFullscreen()) {
            $('.optionlist').append('<li data-name="exitfullscreen">Exit Full Screen</li>');
        } else {
            $('.optionlist').append('<li data-name="enterfullscreen">Enter Full Screen</li>');

        }

    }

    function initHeaderBar() {

        $('.headbar .optiontitle').off('click').click(function(e) {
            if ($('.optionlist').hasClass("hideMe")) {
                initOptionList();
                $('.optionlist').removeClass("hideMe");
                clickOnce();
            } else {
                $('.optionlist').addClass("hideMe");
            }
            e.stopPropagation();
        });

        $(".headbar .optionlist").undelegate("li", "click").delegate("li", "click", function(e) {
            $('.optionlist').addClass("hideMe");
            var name = $(this).attr('data-name');

            if (name == "fit") {
                $('#shareScreenSizeFlag').val('fit');

                common.naclModule.postMessage({
                    type: 'share',
                    command: 'share.setViewMode',
                    viewMode: 0,
                });

            } else if (name == "original") {
                $('#shareScreenSizeFlag').val('original');

                common.naclModule.postMessage({
                    type: 'share',
                    command: 'share.setViewMode',
                    viewMode: 1,
                });

            } else if (name == "exitfullscreen") {
                restorScreen();
            } else if (name == "enterfullscreen") {
                fullScreen();
            }
        });

        $(document).undelegate(".headbar", "dblclick").delegate(".headbar", "dblclick", function(e) {
            e.stopPropagation();
        });

        initMove('headbar', '', 1, null);
    }

    function uninitHeaderBar() {
        uninitMove('headbar', '');
    }

    function initMove(mainId, subId, onlyX, callback) {
        /*
         var params ={containment: "parent"};
         if(onlyX){
         params.axis = 'x';
         }
         $('#'+mainId).draggable(params);
         */

        var mausx = "0";
        var mausy = "0";
        var winx = "0";
        var winy = "0";
        var difx = mausx - winx;
        var dify = mausy - winy;
        var mousedownId = '';
        if (subId !== '') {
            mousedownId = "." + mainId + " ." + subId;
        } else {
            mousedownId = "." + mainId;
        }

        $(mousedownId).mousedown(function(evt) {

            if (typeof callback == 'function') {
                callback(mainId);
            }

            winx = $("." + mainId).offset().left;
            winy = $("." + mainId).offset().top;

            difx = evt.pageX - winx;
            dify = evt.pageY - winy;

            $("html").mousemove(function(event) {

                mausx = event.pageX;
                mausy = event.pageY;

                if ($("." + mainId).offset() === undefined) {
                    return;
                }
                winx = $("." + mainId).offset().left;
                winy = $("." + mainId).offset().top;

                var marginLeft = $("." + mainId).css("marginLeft").replace('px', '');
                var marginTop = $("." + mainId).css("marginTop").replace('px', '');
                var newx = event.pageX - difx - marginLeft;
                var newy = event.pageY - dify - marginTop;

                var xLimitLeft = 10 - marginLeft;
                var xLimitRight = chrome.app.window.current().innerBounds.width - $("." + mainId).css("width").replace('px', '') - marginLeft - 10;
                var yLimitTop = 30 - marginTop;
                var yLimitBottom = chrome.app.window.current().innerBounds.height - $("." + mainId).css("height").replace('px', '') - marginTop;

                if (newx < xLimitLeft) {
                    newx = xLimitLeft;
                } else if (newx > xLimitRight) {
                    newx = xLimitRight;
                }

                if (newy < yLimitTop) {
                    newy = yLimitTop;
                } else if (newy > yLimitBottom) {
                    newy = yLimitBottom;
                }

                if (winx != 0) {
                    if (onlyX) {
                        newy = $("." + mainId).css("top").replace('px', '');
                    }
                    $("." + mainId).css({ top: newy, left: newx });
                }
            });
        });

        $("html").mouseup(function(evt) {
            $("html").unbind('mousemove');
        });

    }

    function uninitMove(mainId, subId) {
        var mousedownId = '';
        if (subId !== '') {
            mousedownId = "." + mainId + " ." + subId;
        } else {
            mousedownId = "." + mainId;
        }

        $(mousedownId).unbind('mousedown');
    }

    function initResize(windowId, mWidth, mHeight) {
        $("#" + windowId).resizable({
            minWidth: mWidth,
            minHeight: mHeight
        });
    }

    function clickOnce() { // click anywhere outside pop menu to close
        $('body,#listener').one("click", function() {
            $(".optionlist").addClass('hideMe');
            $(".videoSetting").addClass('hideMe');
            $(".audioSetting").addClass('hideMe');
            $(".headBottom").addClass('hideMe');
            $(".webinar-more").addClass('hideMe');
            showHostMenu(0);
            showHostTbMenu(0);
            showHostMenu4PList(0);
        });
    }

    function showShareOption(flag) {
        if (flag) {
            initHeaderBar();
            $(".headbar").removeClass('hideMe');
        } else {
            $(".headbar").addClass('hideMe');
            uninitHeaderBar();
        }
    }

    function setShareUserName(name) {
        $(".share-user").text(common.formatNameByLength(name, 30));
    }


    function fullScreen() {
        // clear labels, temp solution, enter/exit fullscreen should be enhanced
        var listener = document.getElementById('listener');
        inmeeting.refreshCurrentActiveSpeaker(0);
        refreshResizeTimer();

        for (var i = listener.childElementCount - 1; i >= 0; i--) {
            if (listener.children[i].id && listener.children[i].id.indexOf('attendee_') != -1)
                listener.removeChild(listener.children[i]);
        }

        forceHideSidePanel();
        chrome.app.window.current().fullscreen();
    }

    function minimize() {
        chrome.app.window.current().minimize();
    }

    function onWindowMinimized() {
        disableMergeToWindow(true);
    }

    function onWindowMaximized() {
        if (meetingStatusObject.meetingNo != 0) {
            restorScreen();
            fullScreen();
        }
    }

    function onWindowFullScreened() {

        if (document.getElementById('join-panel') === null) {
            $('.winbar').hide();
            $('#listener').css('height', 'calc(100% + 2px)'); // for windows 7 video blinking issue
            //$('#listener').css('height','100%');
            $('#listener').css('top', '0px');
            $('.img-fullscreen').addClass('forceHide');
            $('.img-restorescreen').removeClass('forceHide');
            showNavi(0);
        } else {
            $('.winbar .window-maxmize').addClass('forceHide');
            $('.winbar .window-restore').removeClass('forceHide');
        }
        if (document.getElementById('waiting_room') != null) {
            $("#waiting_room").css("top", 0);
        }
        disableMergeToWindow(true);
    }

    function restorScreen() {
        inmeeting.refreshCurrentActiveSpeaker(0);
        refreshResizeTimer();
        chrome.app.window.current().restore();
    }

    function refreshResizeTimer(flag) {
        window.clearTimeout(resizeTimer);
        canShowActiveSpeakerUI = 0;
        resizeTimer = window.setTimeout(function() {
            canShowActiveSpeakerUI = 1;
            refreshCurrentActiveSpeaker(1);
        }, 1000);
    }

    function onWindowRestored() {

        if (document.getElementById('join-panel') === null) {
            $('.winbar').show();
            $('#listener').css('height', 'calc(100% - 30px)');

            if (!$('#window-chat').hasClass('hideMe')) {
                closeDivWindow('window-chat');
            }

            if (!$('#window-participant').hasClass('hideMe')) {
                closeDivWindow('window-participant');
            }
            $('#listener').css('top', '30px');
            $('.img-restorescreen').addClass('forceHide');
            $('.img-fullscreen').removeClass('forceHide');
            showNavi(1);
        } else {
            $('.winbar .window-maxmize').removeClass('forceHide');
            $('.winbar .window-restore').addClass('forceHide');
        }

        if (document.getElementById('waiting_room') != null) {
            $("#waiting_room").css("top", 30);
        }

        var attendeeObj = getAttendeeObject(meetingStatusObject.activeShareUserId);
        var flag = attendeeObj.isMyself && meetingStatusObject.activeShareUserId != 0;
        if (flag) {
            disableMergeToWindow(true);
        } else {
            disableMergeToWindow(false);
        }
    }

    function initDivWindow(windowId, resizable, minWidth, minHeight) {

        initMove(windowId, 'panel-head', 0, setDivWindowZIndex);
        if (resizable) {
            initResize(windowId, minWidth, minHeight);
        }

        $("." + windowId).undelegate("div", "dblclick").delegate("div", "dblclick", function(e) {
            e.stopPropagation();
        });

    }

    function getMaxDivWindowZIndex() {

        var zIndex = $("#window-chat").css('z-index');


        if ($("#window-participant").css('z-index') > zIndex) {
            zIndex = $("#window-participant").css('z-index');
        }

        return zIndex;

    }

    function setDivWindowZIndex(windowId) {
        $("." + windowId).css('z-index', parseInt(getMaxDivWindowZIndex()) + 1);
    }

    function switchToGalleryView() {
        common.naclModule.postMessage({
            type: 'video',
            command: 'video.switchToGalleryView',
        });
    }

    function switchToActiveSpeakerView() {
        common.naclModule.postMessage({
            type: 'video',
            command: 'video.switchToActiveSpeakerView',
        });
    }

    function showNextPageVideo() {
        common.naclModule.postMessage({
            type: 'video',
            command: 'video.showNextPageVideo',
        });
    }

    function showPrePageVideo() {
        common.naclModule.postMessage({
            type: 'video',
            command: 'video.showPrePageVideo',
        });
    }

    function refreshPageTurnButton4GalleryView(msg) {
        if (msg.totalPageNumber > 1) {
            $(".page-info").text(msg.currentPageIndex + "/" + msg.totalPageNumber);
            $(".turnpage-gallery").removeClass("forceHide");
            if (msg.pageTurnLeftButton) {
                if (msg.hide) {
                    $(".turnpage-gallery .left").removeClass("enabled");
                } else {
                    $(".turnpage-gallery .left").addClass("enabled");
                }
            } else {
                if (msg.hide) {
                    $(".turnpage-gallery .right").removeClass("enabled");
                } else {
                    $(".turnpage-gallery .right").addClass("enabled");
                }
            }
        } else {
            $(".turnpage-gallery").addClass("forceHide");
        }
    }

    function refreshCurrentActiveSpeaker(flag) {
        $(".attendee").removeClass('current-active-speaker-gallery');
        if (flag) {
            var userId = meetingStatusObject.currentActiveSpekerUserId;
            if ($("#attendee_" + userId).length > 0) {
                $("#attendee_" + userId).addClass('current-active-speaker-gallery');
            }
        }
    }

    function saveCurrentActiveSpeaker(tmpUserId) {
        meetingStatusObject.currentActiveSpekerUserId = (tmpUserId >> 10) << 10;
    }

    function refreshSwitchView() {
        if (meetingStatusObject.inGalleryView) {
            $(".switch-view span").text("Speaker View");
            $(".switch-view span").attr("data-name", "speakerview");
            $(".switch-view i").removeClass().addClass('img-speakerview img-sprite');
            $(".attendee").css("outline", "none");
            showTalkingUserBar(0);
            if (rectTextShow)
                showTalkingUserText(0);
        } else {
            $(".switch-view span").text("Gallery View");
            $(".switch-view span").attr("data-name", "galleryview");
            $(".switch-view i").removeClass().addClass('img-galleryview img-sprite');
            if (mainAppChromeWindow.isFullscreen()) {
                $(".attendee").css("outline", "solid 2px");
            }
            refreshCurrentActiveSpeaker(1);
            if (rectTextShow)
                showTalkingUserText(1);
        }
    }

    function startAudio() {
        common.naclModule.postMessage({
            type: 'audio',
            command: 'audio.start',
        });
        startAudioState();
    }

    function leaveAudio() {
        common.naclModule.postMessage({
            type: 'audio',
            command: 'audio.leave',
        });

    }

    function stopAudio() {
        stopAudioState();
        showAudio();
        hideMute();
        hidePhone();
    }

    function showDivWindow(windowId) {
        if (('window-chat' == windowId) || ('window-participant' == windowId)) {
            initDivWindow(windowId, true, 300, 200);
        } else if ('window-poll' == windowId) {
            initDivWindow(windowId, true, 450, 500);
        } else {
            initDivWindow(windowId, false);
            if ('window-invite' == windowId) {
                initInviteWindow();
            }
        }

        setDivWindowZIndex(windowId);
        $("#" + windowId).removeClass("hideMe");
        if (windowId == 'window-chat') {
            $('#window-chat .chat-input textarea').focus();
        }
    }

    function showDivOrPopupWindow(windowId, width, height, isInsideMainWindow, dataObj, needSavePos) {
        if (isInsideMainWindow) {
            // use DIV window
            initializeDivOrPopupWindow(windowId, dataObj, false, "");
            showDivWindow(windowId);
        } else {
            // use popup window
            chrome.app.window.create(
                'window/commonWindow.html', {
                    id: windowId,
                    outerBounds: {
                        width: width,
                        height: height
                    },
                    frame: 'none',
                    resizable: false,
                    alwaysOnTop: true,
                    hidden: true
                },
                function(appWindow) {
                    var left = Math.round((screen.availWidth - width) / 2);
                    var top = Math.round((screen.availHeight - height) / 2);
                    appWindow.outerBounds.setSize(width, height);
                    if (!needSavePos) appWindow.outerBounds.setPosition(left, top);
                    appWindow.contentWindow.addEventListener('load', function() {
                        appWindow.contentWindow.setMainAppWindowObject(mainWindow);
                        appWindow.contentWindow.commonWin.initCommonWin();
                        appWindow.contentWindow.initializeDivOrPopupWindow(windowId, dataObj, true, $("#" + windowId)[0].outerHTML);
                        appWindow.show();
                    });
                });
        }

    }

    function closeDivWindow(windowId) {
        uninitMove(windowId, 'panel-head'); // important, to remove mousemove listeners for audio performance
        $("#" + windowId).addClass("hideMe");
    }

    function toggleDivWindow(windowId) {
        if ($("#" + windowId).hasClass("hideMe")) {
            showDivWindow(windowId);
        } else {
            closeDivWindow(windowId);
        }
    }

    function mergeToWindow(windowId, panelId) {
        closeWindow(windowId);
        toggleSidePanel(panelId);
        if (windowId == 'plistWin') {
            meetingStatusObject.lastPlistInPopup = false;
        } else if (windowId == 'chatWin') {
            meetingStatusObject.lastChatWinInPopup = false;
            if (chatObject.curReceiverID == -1) {
                chat.switchChatUser(0, 'Everyone', 0);
            } else {
                chat.refreshChatToUser(mainAppHtmlWindow.chatObject.curReceiverID, mainAppHtmlWindow.chatObject.curReceiverName);
            }
        }
    }

    function disableMergeToWindow(flag) {
        var plistWin = chrome.app.window.get('plistWin');
        var chatWin = chrome.app.window.get('chatWin');
        if (plistWin) {
            plistWin.contentWindow.hideMerge(flag);
        }

        if (chatWin) {
            chatWin.contentWindow.hideMerge(flag);
        }
    }

    function toggleSidePanel(panelId) {

        refreshMuteAllButtonStatus(mainAppHtmlWindow.meetingStatusObject.isHostMuteAll);

        if (mainAppHtmlWindow.meetingStatusObject.isWebinar && !mainAppHtmlWindow.meetingStatusObject.meetingIsViewOnly) {
            $('.participant-common .participant-list').css('height', 'calc(100% - 150px)');
            if (mainAppHtmlWindow.myStatusObject.isHost) {
                $('.participant-common .viewer-list').css('height', 'calc(100% - 141px)');
            } else {
                $('.participant-common .viewer-list').css('height', 'calc(100% - 131px)');
            }
        }

        if ($('body').hasClass('hasSidePanel')) {
            if (!$('#participant-panel').hasClass('hideMe') && !$('#chat-panel').hasClass('hideMe')) {

                $('#' + panelId).addClass('hideMe');
                if (panelId != 'participant-panel') {
                    $('#participant-panel').css('height', '100%');
                } else {
                    $('#chat-panel').css('height', '100%');
                }

            } else {

                if (!$('#participant-panel').hasClass('hideMe')) {
                    if (panelId == 'participant-panel') {
                        $('#participant-panel').addClass('hideMe');
                        showSidePanel(false);
                    } else {
                        $('#participant-panel').css('height', '50%');
                        $('#chat-panel').css('height', '50%');
                        $('#chat-panel').removeClass('hideMe');
                        $('#chat-panel .chat-input textarea').focus();
                    }
                } else if (!$('#chat-panel').hasClass('hideMe')) {
                    if (panelId == 'chat-panel') {
                        $('#chat-panel').addClass('hideMe');
                        showSidePanel(false);
                    } else {
                        $('#participant-panel').css('height', '50%');
                        $('#chat-panel').css('height', '50%');
                        $('#participant-panel').removeClass('hideMe');
                    }
                }
            }

        } else {

            $('#' + panelId).removeClass('hideMe').css('height', '100%');
            showSidePanel(true);
            if (panelId == 'chat-panel') {
                window.setTimeout(function() { // to resolve twinkle bug when open chat panel
                    $('#chat-panel .chat-input textarea').focus();
                }, 2000);
            }
        }
    }




    function forceHideSidePanel() {

        if ($('body').hasClass('hasSidePanel')) {
            showSidePanel(false);
            $('#chat-panel').addClass('hideMe');
            $('#window-chat').addClass('hideMe');
            $('#participant-panel').addClass('hideMe');
            $('#window-participant').addClass('hideMe');
        }
    }

    function showSidePanel(flag) {
        var width = document.documentElement.offsetWidth;
        var height = document.documentElement.offsetHeight - 30; // - 30 titlebar height



        if (flag) {
            $('body').addClass('hasSidePanel');
            $('body').removeClass('noSidePanel');
            $('#listener').css('width', width + 'px');
            $('.toolbar').css('width', width + 'px');
            $('.viewport').css('width', (width + 320) + 'px');
            $('.sidePanel').removeClass('hideMe');

            resizeMainWindow((width + 320), height, false);
        } else {
            if (width === 962) {
                width = 1282;
            }
            $('body').removeClass('hasSidePanel');
            $('body').addClass('noSidePanel');
            $('.viewport').css('width', (width - 320) + 'px');
            $('#listener').css('width', (width - 320) + 'px');
            $('.toolbar').css('width', (width - 320) + 'px');
            $('.sidePanel').addClass('hideMe');
            resizeMainWindow((width - 320), height, false);
        }


    }



    function refreshMuteButton(muted) {
        if (myStatusObject.audioType == 'AUDIO_TELEPHONY') {
            if (muted) {
                $('.phoneImg').removeClass().addClass('phoneImg img-sprite');
                $('.phoneImg').addClass('img-phonemute');
                $('.phonemuteText').text('Unmute');
                $('.phone-li a').attr('title', 'Unmute My Phone (Alt+A)');
                $('.phone-li').removeClass('phonemute').addClass('phoneunmute');
            } else {
                $('.phoneImg').removeClass('img-phonemute').addClass('img-phoneunmute');
                $('.phonemuteText').text('Mute');
                $('.phone-li a').attr('title', 'Mute My Phone (Alt+A)');
                $('.phone-li').removeClass('phoneunmute').addClass('phonemute');
            }
        } else {
            if (muted) {
                $('.muteImg').removeClass().addClass('muteImg img-sprite');
                $('.muteImg').addClass('img-mute');
                $('.muteText').text('Unmute');
                $('.mute-li a').attr('title', 'Unmute My Audio (Alt+A)');
                $('.mute-li').removeClass('mute').addClass('unmute');
                stopAudioState();
            } else {
                $('.muteImg').removeClass('img-mute').addClass('img-unmute');
                $('.muteText').text('Mute');
                $('.mute-li a').attr('title', 'Mute My Audio (Alt+A)');
                $('.mute-li').removeClass('unmute').addClass('mute');
                startAudioState();
            }
        }

    }




    function mute() {
        common.naclModule.postMessage({
            type: 'audio',
            command: 'audio.muteSelf'
        });
    }

    function updateVideoButton(toShowStart) {
        if (toShowStart) {
            $('.videoImg').removeClass('img-stopvideo').addClass('img-startvideo');
            $('.videoText').text('Start Video');
            $('.video-li a').attr('title', 'Start Video (Alt+V)');

            $('.video-li').removeClass('startvideo').addClass('stopvideo');
        } else {
            $('.videoImg').addClass('img-stopvideo').removeClass('img-startvideo');
            $('.videoText').text('Stop Video');
            $('.video-li a').attr('title', 'Stop Video (Alt+V)');

            $('.video-li').removeClass('stopvideo').addClass('startvideo');
        }
    }

    function setVideoIsSending(sending) {
        videoIsSending = sending;
    }

    function getVideoIsSending() {
        return videoIsSending;
    }

    function startShare() {
        lastShareStream = shareStream;
        chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], onAccessApproved);
    }

    function stopShare() {
        common.naclModule.postMessage({
            type: 'share',
            command: 'share.stopShare'
        });
    }

    function pauseShare() {
        common.naclModule.postMessage({
            type: 'share',
            command: 'share.pauseShare',
        });
    }

    function resumeShare() {
        common.naclModule.postMessage({
            type: 'share',
            command: 'share.resumeShare',
        });
    }

    function toggleMyVideo() {
        if (meetingStatusObject.meetingIsViewOnly) return;

        if ($('.videoImg').hasClass('img-stopvideo')) {
            stopMyVideo();
        } else {
            if (myStatusObject.videoMuteByHost) {
                inmeeting.showMeetingAlert("Meeting Alert", "You can't start your video because the host has stopped it.");
                return;
            }
            startMyVideo();
        }
    }

    function startMyVideo() {
        updateVideoButton(false);
        navigator.webkitGetUserMedia(videoConstraints, videoSuccess2, videoFailure);
        //		navigator.webkitGetUserMedia({'video': true}, videoSuccess2, videoFailure);
    }

    function stopMyVideo() {
        updateVideoButton(true);
        common.naclModule.postMessage({
            type: 'video',
            command: 'video.stopSendMyVideo'
        });

		if (videoStream !== undefined) {
			var videoTrack = videoStream.getVideoTracks()[0];
			if (videoTrack.readyState != "ended")
				videoTrack.stop();
		}
    }

    function showJoinAudioWindow() {
        //chrome.app.window.create(string url, CreateWindowOptions options, function callback);
        var joinAudioWindow = chrome.app.window.get('joinAudioWindow');
        if (joinAudioWindow === null) {
            createPopWindow('joinAudioWindow', 'window/joinaudioWindow.html', 570, 278, false);
        }
    }


    function leaveMeeting() {

        if (backgroundWindow) backgroundWindow.setNormalExit();
        common.naclModule.postMessage({
            type: 'user',
            command: 'user.leaveConf'
        });

        setTimeout(function() {
            closeAllWindow();
        }, 5000);
    }

    function endMeeting() {

        if (backgroundWindow) backgroundWindow.setNormalExit();

        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.termConf'
        });
    }


    function createLeaveMeetingWindow(classFlag) {
        createPopWindow('leaveMeetingWindow', 'window/leavemeetingWindow.html?classFlag=' + classFlag, 450, 172);
    }

    function createEndedMeetingWindow(classFlag) {
        var windowid = 'endedWin';
        createPopWindow(windowid, 'window/leavemeetingWindow.html?classFlag=' + classFlag, 450, 172);
        return windowid;
    }

    function createParticipantListWindow(popup) {
        if (popup) { //It depends on the popup created in where,by popout button or in share more window
            meetingStatusObject.lastPlistInPopup = true;
        }
        createPopWindowResizeable('plistWin', 'window/participantlistWindow.html', 400, 400, 300, 200);
    }

    function createChatWindow(popup) {
        if (popup) {
            meetingStatusObject.lastChatWinInPopup = true;
        }
        createPopWindowResizeable('chatWin', 'window/chatWindow.html', 400, 400, 300, 200);
    }

    function initAudioStatus() {
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
        if (!notConnectAudioFlag) {
            if (meetingStatusObject.isSupportVoip) {
                joinAudio();
            }
        }

    }

    function joinAudio() {
        if (meetingStatusObject.meetingIsViewOnly) {
            common.showLog("view-only, not starting microphone");
        } else {
            navigator.webkitGetUserMedia({
                'audio': {
                    "mandatory": {
                        "echoCancellation": false,
                        "googEchoCancellation": false,
                        "googAutoGainControl": true,
                        "googNoiseSuppression": true,
                        "googHighpassFilter": true
                    }
                }
            }, audioSuccess, audioFailure);
        }
        hideAudio();
        showMute();
        startAudio();
    }

    function joinPhone() {
        hideAudio();
        showPhone();
    }

    function enumerateDevices() {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(gotDevices)
                .catch(function() {});
        } else {
            MediaStreamTrack.getSources(gotDevices);
        }
    }

    function gotDevices(deviceInfos) {

        // clear original list
        audioInputDevices = [];
        audioOutputDevices = [];
        videoInputDevices = [];

        $('.Microphone').empty().append('<dt><span>Microphone</span></dt>');
        $('.Speaker').empty().append('<dt><span>Speaker</span></dt>');
        $('.Camera').empty().append('<dt><span>Camera</span></dt>');

        for (var i = 0; i !== deviceInfos.length; ++i) {
            var device = deviceInfos[i];
            var className = '';
            if (device.deviceId == 'communications') {
                continue;
            }

            if (device.kind === 'audioinput' || device.kind === 'audio') {
                if (audioTrack && (device.label == audioTrack.label)) {
                    className = "selected";
                }

                audioInputDevices.push(device);

                $('.Microphone').append('<dd data-value="' + device.deviceId + '" data-type="Microphone">' +
                    '<i class="' + className + ' img-sprite">  </i>' +
                    '<span>' + device.label + '</span></dd>');
            }

            if (device.kind === 'audiooutput') {
                if (device.deviceId != 'default') {
                    continue;
                }

                audioOutputDevices.push(device);

                $('.Speaker').append('<dd data-value="' + device.deviceId + '"  data-type="Speaker">' +
                    '<i class="selected img-sprite">  </i>' +
                    '<span>' + device.label + '</span></dd>');
            }

            if (device.kind === 'videoinput') {
                if (videoTrack && (device.label == videoTrack.label)) {
                    className = "selected";
                }

                videoInputDevices.push(device);

                $('.Camera').append('<dd data-value="' + device.deviceId + '"  data-type="Camera">' +
                    '<i class="' + className + ' img-sprite">  </i>' +
                    '<span>' + device.label + '</span></dd>');
            }
        }

        if (videoInputDevices.length == 0) {
            $('.video-li, .videoArrow').addClass('visibility-hidden');
            myStatusObject.videoHasCamera = 0;
        } else {
            $('.video-li, .videoArrow').removeClass('visibility-hidden');
            myStatusObject.videoHasCamera = 1;
        }


    }

    function changeAudioInput(audioSource) {

        var constraints = {};
        constraints.audio = {
            optional: [{
                sourceId: audioSource
            }]
        };

        // invoke getUserMedia to capture this device
        navigator.webkitGetUserMedia(constraints, function(stream) {
            // pass to nacl
            audioSuccess(stream);
        }, console.error);
    }

    function changeVideoInput(videoSource) {

        //stop previous video source capture and send
        common.naclModule.postMessage({
            type: 'video',
            command: 'video.stopSendMyVideo'
        });

		if (videoStream !== undefined) {
			var videoTrack = videoStream.getVideoTracks()[0];
			if (videoTrack.readyState != "ended")
				videoTrack.stop();
		}

        videoConstraints.video = {
            optional: [{
                sourceId: videoSource
            }]
        };

        // invoke getUserMedia to capture this device
        if ($('.videoImg').hasClass('img-stopvideo')) {
            navigator.webkitGetUserMedia(videoConstraints, videoSuccess2, console.error);
        }
    }


    var noticeTimer;

    function showNotice(text) {
        clearTimeout(noticeTimer);
        $('.notice').text(text).css('z-index', 30).show(300);
        noticeTimer = window.setTimeout(function() {
            $('.notice').hide();
        }, 5000);
    }

    function showCMRConnectingNotice(flag) {
        if (flag) {
            $('.notice').hide();
            if ($('.cmr-connecting-notice').css('display') != 'block') {
                $('.cmr-connecting-notice').css('z-index', 30).show(300).delay(3000).fadeOut(300);
                // $('.cmr-connecting-notice').css('z-index',30).show(300)
                // window.setTimeout(function(){
                // 	$('.cmr-connecting-notice').hide();
                // }, 5000);
            }
        } else {
            $('.cmr-connecting-notice').css('z-index', 30).hide();
        }

    }


    function clearConnetOption() {

        chrome.storage.local.remove("connectOption", function() {});
    }

    function showMuteIcon(flag, userId, audioType) {
        var tmpUserId = (userId >> 10) << 10;
        if (audioType == 'AUDIO_TELEPHONY') {
            if (flag) {
                $('#attendee_' + tmpUserId).find('i.img-listPhoneOff').removeClass('forceHide');
                $('#activeSpeaker_' + tmpUserId).find('i.img-listPhoneOff').removeClass('forceHide');

                $('#attendee_' + tmpUserId).find('i.img-listAudioOff').addClass('forceHide');
                $('#activeSpeaker_' + tmpUserId).find('i.img-listAudioOff').addClass('forceHide');
            } else {
                $('#attendee_' + tmpUserId).find('i.img-listPhoneOff').addClass('forceHide');
                $('#activeSpeaker_' + tmpUserId).find('i.img-listPhoneOff').addClass('forceHide');
            }
        } else if (audioType == 'AUDIO_VOIP') {
            if (flag) {
                $('#attendee_' + tmpUserId).find('i.img-listAudioOff').removeClass('forceHide');
                $('#activeSpeaker_' + tmpUserId).find('i.img-listAudioOff').removeClass('forceHide');

                $('#attendee_' + tmpUserId).find('i.img-listPhoneOff').addClass('forceHide');
                $('#activeSpeaker_' + tmpUserId).find('i.img-listPhoneOff').addClass('forceHide');
            } else {
                $('#attendee_' + tmpUserId).find('i.img-listAudioOff').addClass('forceHide');
                $('#activeSpeaker_' + tmpUserId).find('i.img-listAudioOff').addClass('forceHide');
            }
        } else if (audioType == 'AUDIO_NONE') {
            $('#attendee_' + tmpUserId).find('i.img-listAudioOff').addClass('forceHide');
            $('#activeSpeaker_' + tmpUserId).find('i.img-listAudioOff').addClass('forceHide');
            $('#attendee_' + tmpUserId).find('i.img-listPhoneOff').addClass('forceHide');
            $('#activeSpeaker_' + tmpUserId).find('i.img-listPhoneOff').addClass('forceHide');
        }
    }

    function showNetworkBandwidth(className, userId) {
        var tmpUserId = (userId >> 10) << 10;
        $('#activeSpeaker_' + tmpUserId).find('i.img-bandwidth').removeClass().addClass('img-bandwidth img-sprite').addClass(className);
    }

    function refreshMeetingStatus() {
        if (meetingStatusObject.isMuteOnEntryOn) {
            $(this).find('i').addClass('selected');
        } else {
            $(this).find('i').removeClass('selected');
        }

        if (meetingStatusObject.isMeetingLocked) {
            $(this).find('a').text('Unlock Meeting');
        } else {
            $(this).find('a').text('Lock Meeting');
        }
        if (meetingStatusObject.isShareLocked) {
            $(this).find('a').text('Unlock Screen Share');
        } else {
            $(this).find('a').text('Lock Screen Share');
        }
    }

    function refreshForHost(isHost) {
        if (isHost) {
            $('.participants-text').text("Manage Participants");
            $('.participants-number').css('right', '40px');
            $('.leavemeeting-text').text("End Meeting");
        } else {
            $('.participants-text').text("Participants");
            $('.participants-number').css('right', '16px');
            $('.leavemeeting-text').text("Leave Meeting");
        }
    }





    function sendHostLockCommand(command, flag) {
        common.showLog(command + ':' + flag);
        common.naclModule.postMessage({
            type: 'conf',
            command: command,
            lock: flag
        });
    }

    function sendHostMuteEntryCommand(flag) {
        common.showLog('conf.setMuteOnEntry' + ':' + flag);
        meetingStatusObject.isMuteOnEntryOn = flag;
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.setMuteOnEntry',
            muteOnEntry: flag
        });
    }

    function sendHostCommand(command, userId) {
        common.naclModule.postMessage({
            type: 'conf',
            command: command,
            userId: Number(userId)
        });
    }

    function renameUser(command, userId, newName) {
        common.naclModule.postMessage({
            type: 'conf',
            command: command,
            userId: Number(userId),
            name: newName
        });
    }

    function muteAll(allowUnmute) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.muteAll',
            allowUnmute: allowUnmute
        });
    }

    function unmuteAll() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.unmuteAll'
        });
    }

    function reclaimHost() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.claimHost'
        });
    }

    function showMeetingNo() {
        var content = 'Meeting ID: ' + common.addShortLine(meetingStatusObject.meetingNo);
        $('.zoom-meetingNo').text(content);
    }



    function showTalkingUserBar(flag) {
        if (flag) {
            $('.rect-bar').removeClass('hideMe');
        } else {
            $('.rect-bar').addClass('hideMe');
        }
    }

    function relocationTalkingUserPanel(top, left) {
        $('.userlist-mode').css({ top: (top - 30), left: (left - 2) });
    }

    function showTalkingUserText(flag) {
        if (flag) {
            if ($('.rect-small i').hasClass("selected")) {
                $('.userlist-mode .rect-text').removeClass('hideMe');
            }
        } else {
            $('.userlist-mode .rect-text').addClass('hideMe');
        }
    }

    function showNavi(flag) {
        if (flag) {
            $('.navi').removeClass('hideMe');
        } else {
            $('.navi').addClass('hideMe');
        }
    }

    function refreshUserDisplayName(userId, attendeeObj) {
        $('.' + 'name_' + userId).html(attendeeObj.name);

        if ((meetingStatusObject.activeShareUserId >> 10) == (userId >> 10)) {
            $('span.share-user').html(common.formatNameByLength(attendeeObj.shortName, 30));
        }
    }



    function showMeetingAlert(iconText, divText) {
        closeDivWindow('window-meetingalert');
        $('.window-meetingalert .logo-icon-text').text(iconText);
        $('.confirm-meetingalert .div-text').text(divText);
        window.setTimeout(function() {
            showDivWindow('window-meetingalert');
        }, 100);

    }

    function showLockStatusOnTitle(flag) {
        if (flag) {
            $('.zoom-lockstatus').removeClass('hideMe');
        } else {
            $('.zoom-lockstatus').addClass('hideMe');
        }
    }

    function showRemainingMeetingTime(flag, time) {
        if (chrome.app.window.current().isFullscreen()) {
            $('.remaining-meeting-time').css('top', '10px');
        } else {
            $('.remaining-meeting-time').css('top', '160px');
        }
        $('span.remaining-time').text(time);
        if (flag) {
            $('.remaining-meeting-time').removeClass('hideMe');
        } else {
            $('.remaining-meeting-time').addClass('hideMe');
        }
    }

    function refreshByAttendeeList(attendeeList) {
        var participantlistWin = chrome.app.window.get('plistWin');
        var chatWin = chrome.app.window.get('chatWin');
        refreshParticipantListView(attendeeList);
        chat.refreshChatUserList(attendeeList);

        if (participantlistWin !== null) {
            participantlistWin.contentWindow.refreshParticipantListView(attendeeList);
        }
        if (chatWin !== null) {
            chatWin.contentWindow.chat.refreshChatUserList(attendeeList);
        }
    }

    function setupShareAreaMovePicture(renderWidth, renderHeight, shareWidth, shareHeight) {

        if (($('#shareScreenSizeFlag').val() == 'original') && ((shareWidth > renderWidth) || (shareHeight > renderHeight))) {
            $('#shareArea').css("cursor", "-webkit-grab");

            $('#shareArea').unbind("mousedown").mousedown(function(e) {

                $('#shareArea').css("cursor", "-webkit-grabbing");

                autoShow(0);

                var oldX = e.clientX;
                var oldY = e.clientY;

                $('html').unbind("mousemove").mousemove(function(e) {
                    var newX = e.clientX;
                    var newY = e.clientY;

                    isInMovingSharePicture = true;

                    common.naclModule.postMessage({
                        type: "share",
                        command: "share.movePicture",
                        oldX: oldX,
                        oldY: oldY,
                        newX: newX,
                        newY: newY
                    });

                    oldX = newX;
                    oldY = newY;
                });

            });

            $('#shareArea').unbind("mouseup").mouseup(function(e) {
                $('#shareArea').css("cursor", "-webkit-grab");
                isInMovingSharePicture = false;

                $('html').unbind("mousemove");
            });

            if ('undefined' != document.ontouchstart) {
                $('#shareArea').unbind('touchstart').bind('touchstart', function(e) {

                    var oldX = e.originalEvent.changedTouches[0].clientX;
                    var oldY = e.originalEvent.changedTouches[0].clientY;

                    $('html').unbind("touchmove").bind('touchmove', function(e) {
                        var newX = e.originalEvent.changedTouches[0].clientX;
                        var newY = e.originalEvent.changedTouches[0].clientY;

                        if ((newX != oldX) && (newY != oldY)) {
                            isInMovingSharePicture = true;
                            autoShow(0);

                            common.naclModule.postMessage({
                                type: "share",
                                command: "share.movePicture",
                                oldX: oldX,
                                oldY: oldY,
                                newX: newX,
                                newY: newY
                            });

                            oldX = newX;
                            oldY = newY;
                        }
                    });

                });

                $('#shareArea').unbind("touchend").bind('touchend', function(e) {
                    if (isInMovingSharePicture) {
                        isInMovingSharePicture = false;
                    } else {
                        autoShow(1);
                    }

                    $('html').unbind("touchmove");

                    e.preventDefault();
                });
            }
        } else {
            $('#shareArea').css("cursor", "");
            $('#shareArea').unbind("mousedown").unbind("mouseup");
            $('#shareArea').unbind("touchstart").unbind("touchend");
            isInMovingSharePicture = false;
        }
    }

    function refreshTalkingUserIcon(msg) {
        refreshTalkingUser(msg);
        var plistWin = chrome.app.window.get('plistWin');
        if (plistWin !== null) {
            plistWin.contentWindow.refreshTalkingUser(msg);
        }
    }

    function getOverallStat() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getStat',
            statType: 'overall'
        });
    }

    function getAudioStat() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getStat',
            statType: 'audio'
        });
    }

    function getVideoStat() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getStat',
            statType: 'video'
        });
    }

    function getShareStat() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getStat',
            statType: 'share'
        });
    }

    function canStartCMRCheck() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.canStartCMRCheck'
        });
    }

    function startCMR() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.startCMR'
        });
    }

    function stopCMR() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.stopCMR'
        });
    }

    function pauseCMR() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.pauseCMR'
        });
    }

    function resumeCMR() {
        startCMR();
    }

    function askQAQuestion(question, anonymously) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.QA.addQuestion',
            question: question,
            anonymously: anonymously
        });
    }

    function answerQAQuestion(questionID, answer, privately) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.QA.addAnswer',
            questionID: questionID,
            answer: answer,
            privately: privately
        });
    }

    function startQALiving(questionID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.QA.startLiving',
            questionID: questionID
        });
    }

    function endQALiving(questionID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.QA.endLiving',
            questionID: questionID
        });
    }

    function refreshPlistRecord() {
        refreshPlistRecordStatus();
        var plistWin = chrome.app.window.get('plistWin');
        if (plistWin) {
            plistWin.contentWindow.refreshPlistRecordStatus();
        }
    }

    function getCallInInfo() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getCallInInfo'
        });
    }

    function getCallOutInfo() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getCallOutInfo'
        });
    }

    function startCallOut(callOutNumber) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.startCallOut',
            callOutNumber: callOutNumber
        });
    }

    function hangUp() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.hangUp'
        });
    }

    function getPhoneCallInNumber() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getPhoneCallInNumber'
        });
    }

    function getTollFreeCallInNumber() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.getTollFreeCallInNumber'
        });
    }

    function saveCallInInfo(msg) {
        var arr = new Array();
        for (var i = 0; i < msg.length; i++) {
            arr.push(msg['countryItem' + i]);
        }
        arr.sort(function(x, y) {
            if (x.name < y.name) {
                return -1;
            } else if (x.name > y.name) {
                return 1;
            } else {
                return 0;
            }
        });
        callInInfoObject.callInInfoList = arr;
        callInInfoObject.isPSTNPassWordOn = msg.isPSTNPassWordOn;
        callInInfoObject.PSTNPassWord = msg.PSTNPassWord;
        callInInfoObject.defaultCallInCountryCodeID = msg.defaultCallInCountryCodeID;
    }


    function saveCallOutInfo(msg) {
        var arr = new Array();
        for (var i = 0; i < msg.length; i++) {
            arr.push(msg['countryItem' + i]);
        }
        arr.sort(function(x, y) {
            if (x.name < y.name) {
                return -1;
            } else if (x.name > y.name) {
                return 1;
            } else {
                return 0;
            }
        });
        callOutInfoObject.callOutInfoList = arr;
        callOutInfoObject.defaultCallOutCountryCodeID = msg.defaultCallOutCountryCodeID;
    }

    /************************* webinar viewer start **********************************************/
    function refreshWebinarViewerBarUI() {
        if ($('.webinar-viewer-bar li').length > 0) {
            $('.webinar-viewer-bar li').removeClass('first last');
            $('.webinar-viewer-bar li:not(.forceHide):first').addClass('first');
            $('.webinar-viewer-bar li:not(.forceHide):last').addClass('last');
        }
    }

    function showHandOption(flag) {
        if (flag) {
            $('.webinar-viewer-bar li.hand').removeClass('forceHide');
        } else {
            $('.webinar-viewer-bar li.hand').addClass('forceHide');
        }
    }

    function showQAOption() {
        if (meetingStatusObject.isQAoff) {
            $('.webinar-viewer-bar li.qa').addClass('forceHide');
        } else {
            $('.webinar-viewer-bar li.qa').removeClass('forceHide');
        }
    }

    function showWebinarAttendeeNumber(msg) {
        if (msg.panelistCount === undefined) {
            return;
        }
        if (msg.needShowAttendeNumber) {
            var attendeeNo = 'Panelist(' + msg.panelistCount + ')' + ' Viewer(' + msg.viewOnlyUserCount + ')';
            $('.zoom-webinarAttendeeNo').removeClass('hideMe');
            $('.zoom-webinarAttendeeNo').text(attendeeNo);
        } else {
            $('.zoom-webinarAttendeeNo').addClass('hideMe');
            $('.zoom-webinarAttendeeNo').text('');
        }
    }

    /************************* raise&lower hand start **********************************************/
    function refreshPlistHand(flag, userid) {
        var attendeeObj = getAttendeeObject(userid, true);
        if (attendeeObj !== null) {
            attendeeObj.isRaiseHand = flag;
        }
    }

    function raiseHand(userID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.raiseHand',
            userID: userID
        });
    }

    function lowerHand(userID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.lowerHand',
            userID: Number(userID)
        });
    }

    function lowerAllHands() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.lowerAllHands'
        });
    }

    function raiseHandInWebinar() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.raiseHandInWebinar'
        });
    }

    function lowerHandInWebinar(userID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.lowerHandInWebinar',
            userID: userID
        });
    }

    function lowerAllHandsInWebinar() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.lowerAllHandsInWebinar'
        });
    }

    function refreshWebinarViewerHand(flag, msg) {
        if (msg.isMe) {
            if (flag == 'raise') {
                $('.webinar-viewer-bar .hand').attr('data-name', 'lower');
                $('.webinar-viewer-bar .hand a').text('Lower Hand');
                $('.webinar-viewer-bar .hand').addClass('raised');
                $('.webinar-viewer-bar i.img-viewerhand').removeClass('forceHide');
            } else {
                $('.webinar-viewer-bar .hand').attr('data-name', 'raise');
                $('.webinar-viewer-bar .hand a').text('Raise Hand');
                $('.webinar-viewer-bar .hand').removeClass('raised');
                $('.webinar-viewer-bar i.img-viewerhand').addClass('forceHide');

            }
        }
    }

    function refreshViewerHand4Plist(flag, userid) {
        var viewerObject = util.getViewerObject(userid);
        viewerObject.raiseHandStatus = flag;
        showViewerHand4Plist(flag, userid);
        showViewerHandNum4Plist();
        var plistWin = chrome.app.window.get('plistWin');
        if (plistWin) {
            plistWin.contentWindow.showViewerHand4Plist(flag, userid);
            plistWin.contentWindow.showViewerHandNum4Plist();
        }
    }

    /************************* raise&lower hand end **********************************************/

    /************************* polling start **********************************************/
    function setCheckToAnswer(pollingID, questionID, answerID, isChecked) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.setCheckToAnswer',
            pollingID: pollingID,
            questionID: questionID,
            answerID: answerID,
            isChecked: isChecked
        });
    }

    function startPoll(pollingID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.startPoll',
            pollingID: pollingID
        });
    }

    function reopenPoll(pollingID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.reopenPoll',
            pollingID: pollingID
        });
    }

    function closePoll(pollingID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.closePoll',
            pollingID: pollingID
        });
    }

    function sharePollResult(pollingID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.sharePollResult',
            pollingID: pollingID
        });
    }

    function stopSharePollResult(pollingID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.stopSharePollResult',
            pollingID: pollingID
        });
    }

    function getEditPollingURL() {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.getEditPollingURL'
        });
    }

    function submitPoll(pollingID) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.polling.submitPoll',
            pollingID: pollingID
        });
    }

    function saveEditPollingURL(url) {
        editPollingURL = url;
    }

    function showPollingWindow(flag) {
        var pollWindow = chrome.app.window.get('pollWindow');
        if (flag) {
            if (pollWindow === null) {
                if (pollingDocObject === undefined) { //OnPollingDocReceived  after UI ready
                    window.setTimeout(function() {
                        createPopWindow('pollWindow', 'window/pollWindow.html', 450, 500, true);
                    }, 2000);
                } else {
                    createPopWindow('pollWindow', 'window/pollWindow.html', 450, 500, true);
                }
            }
        } else {
            if (pollWindow !== null) {
                pollWindow.close();
            }
        }
    }

    function countPollingTime(elaspedTime) {
        elaspedPollingTimeSec = elaspedTime / 1000;
        window.clearInterval(pollingTimeInterval);
        pollingTimeInterval = window.setInterval(function() {
            elaspedPollingTimeSec++;
            var pollWindow = chrome.app.window.get('pollWindow');
            refreshPollingTime();
            if (pollWindow !== null) {
                pollWindow.contentWindow.refreshPollingTime();
            }
        }, 1000);
    }

    function stopCountPollingTime() {
        elaspedPollingTimeSec = '';
        window.clearInterval(pollingTimeInterval);
        var pollWindow = chrome.app.window.get('pollWindow');
        if (pollWindow !== null) {
            pollWindow.contentWindow.refreshPollingTime();
        }
    }

    function getPollingWindowHtml() {

        return $('#window-poll').html();
    }
    /************************* polling end **********************************************/
    /************************* webinar viewer end **********************************************/

    /***************************** webinar attendee start*************************************************************/

    function refreshByViewerList() {
        refreshViewer4Plist();
        chat.refreshChatUserList(attendeeList);
        var plistWin = chrome.app.window.get('plistWin');
        if (plistWin) {
            plistWin.contentWindow.refreshViewer4Plist();
        }
        var chatWin = chrome.app.window.get('chatWin');
        if (chatWin !== null) {
            chatWin.contentWindow.chat.refreshChatUserList(attendeeList);
        }
    }

    /***************************** webinar attendee end*************************************************************/

    function removeForceShow4Toolbar() {
        if (chatObject.chatNum == 0 && qaObject.openNum == 0) {
            $(".toolbar").removeClass('forceShow');
        }
    }

    function disconnectPhone() {
        hidePhone();
        var joinAudioWindow = chrome.app.window.get('joinAudioWindow');
        if (joinAudioWindow !== null) {
            joinAudioWindow.contentWindow.refreshCallOutStatus("CALLOUT_STATUS_ZOOM_CALL_CACELED");
            joinAudioWindow.contentWindow.showConnectedUI("none");
        }
    }

    function saveTelephoneUserNum() {
        var num = 0;
        for (var i = 0; i < attendeeList.length; i++) {
            if (attendeeList[i].isTelephoneUser) {
                num++;
            }
        }
        telephoneUserNum = num;
    }

    function expelAttendee(userId) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.expelAttendee',
            userId: Number(userId)
        });
    }

    function promotePanelist(userId) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.promotePanelist',
            userId: Number(userId)
        });
    }

    function downgradetoAttendee(userId) {
        common.naclModule.postMessage({
            type: 'conf',
            command: 'conf.downgradetoAttendee',
            userId: Number(userId)
        });
    }

    function enterWaitingRoom() {
        var meetingTopic = meetingStatusObject.meetingTopic;
        meetingStatusObject.isInWaitingRoom = true;
        
        if (shareStream)
            shareStream.getTracks()[0].stop();
        inmeeting.stopShare();
        closeShareWindow();
        restoreMainWindow();
        
        closeWindow('plistWin');
        closeWindow('chatWin');
        closeWindow('pollWindow');
        closeWindow('qaWin');
        $(".dl-sidePanel").addClass("hideMe");
        if (chrome.app.window.current().isFullscreen())
            restorScreen();
        if (meetingStatusObject.isInSharing)
            inmeeting.showShareOption(0);
        if ($('body').hasClass('hasSidePanel') && !$('#participant-panel').hasClass('hideMe')) {
            $('#participant-panel').addClass('hideMe');
            showSidePanel(false);
        }
        if ($('body').hasClass('hasSidePanel') && !$('#chat-panel').hasClass('hideMe')) {
            $('#chat-panel').addClass('hideMe');
            showSidePanel(false);
        }

        var waitingRoom = "<div id='waiting_room'>" +
            "<div class='waiting_room_main'>" +
            "<div class='waiting_room_notice'>Please wait,the meeting host will let you in soon</div>" +
            "<div class='topic'>" + meetingTopic + "</div>" +
            "</div>" +
            "</div>";
        $('body').append(waitingRoom);
    }

    function outWaitingRoom() {
        if (videoIsSending)
            startMyVideo();
        else
            stopMyVideo();
        $(".dl-sidePanel").removeClass("hideMe");
        meetingStatusObject.isInWaitingRoom = false;

        if (document.getElementById("waiting_room") != null)
            $("#waiting_room").remove();

        if (meetingStatusObject.isInSharing)
            showShareOption(1);
    }

    // The symbols to export.
    return {
        /** A reference to the NaCl module, once it is loaded. */
        showJoinAudioWindow: showJoinAudioWindow,
        joinPhone: joinPhone,
        joinAudio: joinAudio,
        leaveAudio: leaveAudio,
        disconnectPhone: disconnectPhone,
        saveTelephoneUserNum: saveTelephoneUserNum,
        stopAudio: stopAudio,
        bindEvent: bindEvent,
        leaveMeeting: leaveMeeting,
        endMeeting: endMeeting,
        showNotice: showNotice,
        initAudioStatus: initAudioStatus,
        refreshMuteButton: refreshMuteButton,
        showMeetingNo: showMeetingNo,
        showShareOption: showShareOption,
        fullScreen: fullScreen,
        onWindowFullScreened: onWindowFullScreened,
        onWindowMinimized: onWindowMinimized,
        onWindowMaximized: onWindowMaximized,
        restorScreen: restorScreen,
        onWindowRestored: onWindowRestored,
        minimize: minimize,
        setShareUserName: setShareUserName,
        refreshTalkingUserIcon: refreshTalkingUserIcon,
        relocationTalkingUserPanel: relocationTalkingUserPanel,
        showTalkingUserText: showTalkingUserText,
        initTalkingUserPanel: initTalkingUserPanel,
        refreshUserDisplayName: refreshUserDisplayName,
        refreshByAttendeeList: refreshByAttendeeList,
        createLeaveMeetingWindow: createLeaveMeetingWindow,
        showDivWindow: showDivWindow,
        closeDivWindow: closeDivWindow,
        showMeetingAlert: showMeetingAlert,
        stopMyVideo: stopMyVideo,
        toggleDivWindow: toggleDivWindow,
        toggleSidePanel: toggleSidePanel,
        refreshMeetingStatus: refreshMeetingStatus,
        updateVideoButton: updateVideoButton,
        showLockStatusOnTitle: showLockStatusOnTitle,
        refreshForHost: refreshForHost,
        showMuteIcon: showMuteIcon,
        showNetworkBandwidth: showNetworkBandwidth,
        showRemainingMeetingTime: showRemainingMeetingTime,
        createEndedMeetingWindow: createEndedMeetingWindow,
        startShare: startShare,
        stopShare: stopShare,
        pauseShare: pauseShare,
        resumeShare: resumeShare,
        mute: mute,
        renameUser: renameUser,
        startMyVideo: startMyVideo,
        toggleMyVideo: toggleMyVideo,
        clickOnce: clickOnce,
        sendHostCommand: sendHostCommand,
        unmuteAll: unmuteAll,
        muteAll: muteAll,
        reclaimHost: reclaimHost,
        sendHostLockCommand: sendHostLockCommand,
        sendHostMuteEntryCommand: sendHostMuteEntryCommand,
        showDivOrPopupWindow: showDivOrPopupWindow,
        createParticipantListWindow: createParticipantListWindow,
        createChatWindow: createChatWindow,
        mergeToWindow: mergeToWindow,
        disableMergeToWindow: disableMergeToWindow,
        setupShareAreaMovePicture: setupShareAreaMovePicture,
        getOverallStat: getOverallStat,
        getAudioStat: getAudioStat,
        getVideoStat: getVideoStat,
        getShareStat: getShareStat,
        canStartCMRCheck: canStartCMRCheck,
        startCMR: startCMR,
        stopCMR: stopCMR,
        pauseCMR: pauseCMR,
        resumeCMR: resumeCMR,
        askQAQuestion: askQAQuestion,
        answerQAQuestion: answerQAQuestion,
        startQALiving: startQALiving,
        endQALiving: endQALiving,
        raiseHand: raiseHand,
        lowerHand: lowerHand,
        lowerAllHands: lowerAllHands,
        raiseHandInWebinar: raiseHandInWebinar,
        refreshWebinarViewerHand: refreshWebinarViewerHand,
        lowerHandInWebinar: lowerHandInWebinar,
        lowerAllHandsInWebinar: lowerAllHandsInWebinar,
        setCheckToAnswer: setCheckToAnswer,
        startPoll: startPoll,
        reopenPoll: reopenPoll,
        closePoll: closePoll,
        sharePollResult: sharePollResult,
        stopSharePollResult: stopSharePollResult,
        getEditPollingURL: getEditPollingURL,
        submitPoll: submitPoll,
        saveEditPollingURL: saveEditPollingURL,
        showPollingWindow: showPollingWindow,
        refreshWebinarViewerBarUI: refreshWebinarViewerBarUI,
        showHandOption: showHandOption,
        showQAOption: showQAOption,
        showWebinarAttendeeNumber: showWebinarAttendeeNumber,
        refreshViewerHand4Plist: refreshViewerHand4Plist,
        refreshByViewerList: refreshByViewerList,
        removeForceShow4Toolbar: removeForceShow4Toolbar,
        refreshPlistHand: refreshPlistHand,
        refreshPlistRecord: refreshPlistRecord,
        getCallInInfo: getCallInInfo,
        getCallOutInfo: getCallOutInfo,
        startCallOut: startCallOut,
        hangUp: hangUp,
        getPhoneCallInNumber: getPhoneCallInNumber,
        getTollFreeCallInNumber: getTollFreeCallInNumber,
        saveCallInInfo: saveCallInInfo,
        saveCallOutInfo: saveCallOutInfo,
        showCMRConnectingNotice: showCMRConnectingNotice,
        expelAttendee: expelAttendee,
        promotePanelist: promotePanelist,
        countPollingTime: countPollingTime,
        getPollingWindowHtml: getPollingWindowHtml,
        stopCountPollingTime: stopCountPollingTime,
        downgradetoAttendee: downgradetoAttendee,
        switchToGalleryView: switchToGalleryView,
        showNextPageVideo: showNextPageVideo,
        showPrePageVideo: showPrePageVideo,
        refreshPageTurnButton4GalleryView: refreshPageTurnButton4GalleryView,
        refreshSwitchView: refreshSwitchView,
        showSwitchView: showSwitchView,
        refreshCurrentActiveSpeaker: refreshCurrentActiveSpeaker,
        saveCurrentActiveSpeaker: saveCurrentActiveSpeaker,
        switchToActiveSpeakerView: switchToActiveSpeakerView,
        enterWaitingRoom: enterWaitingRoom,
        outWaitingRoom: outWaitingRoom,
        setVideoIsSending: setVideoIsSending,
        getVideoIsSending: getVideoIsSending
    };

}());
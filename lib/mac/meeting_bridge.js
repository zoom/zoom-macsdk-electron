var $ = require('/usr/local/lib/node_modules/electron/node_modules/nodobjc');


var meetingServiceObj;
var zoomMeetingBridge = (function(){
return{
  SetMeetingStatusCB: function(onMeetingStatus){
       var ZOOMSDK = require('./zoomsdk_bridge.js');
       var ZOOMSDKMEETIGNMOD = require('./../zoom_meeting.js');
       var meetingServiceDelegate = ZOOMSDK.meetingServiceDelegate;
       
       meetingServiceDelegate.addMethod('onMeetingStatusChange:meetingError:', 'v@:@@', function (self, _cmd, obj, meetingerror) {
      var meetingstatus = ZOOMSDKMEETIGNMOD.ZoomMeetingStatus.MEETING_STATUS_IDLE
      if(8 == obj)
          meetingstatus = ZOOMSDKMEETIGNMOD.ZoomMeetingStatus.MEETING_STATUS_AUDIO_READY;
      else if( 9 == obj)
         meeetingstatus = ZOOMSDKMEETIGNMOD.ZoomMeetingStatus.MEETING_STATUS_OTHER_MEETING_INPROGRESS;
      else if (10 == obj)
         meetingstatus = ZOOMSDKMEETIGNMOD.ZoomMeetingStatus.MEETING_STATUS_IN_WAITING_ROOM;
      else 
         meetingstatus = obj;
       onMeetingStatus(meetingstatus, meetingerror);
      })
       meetingServiceDelegate.register();
  },
  SetMeetingUserJoinCB: function(onUserJoin){
     var ZOOMMEETINGACTION  = require('./meeting_action_bridge.js');
     ZOOMMEETINGACTION.zoomMeetingActionBridge.SetUserJoin(onUserJoin);
  },
  SetMeetingUserLeftCB: function(onUserLeft){
     var ZOOMMEETINGACTION  = require('./meeting_action_bridge.js');
     ZOOMMEETINGACTION.zoomMeetingActionBridge.SetUserLeft(onUserLeft);
  },
  SetMeetingHostChangeCB: function(onHostChange){ 
     var ZOOMMEETINGACTION  = require('./meeting_action_bridge.js');
     ZOOMMEETINGACTION.zoomMeetingActionBridge.SetHostChange(onHostChange);
  },
  SetMeetingService: function(meetingService){
     meetingServiceObj  = meetingService;
  },

  StartMeeting: function(meetingnum, directshareappwndhandle, participantid, isvideooff, isaudiooff, isdirectsharedesktop){
    var meetingnumber = $.NSString('stringWithUTF8String', '');
    var userid = $.NSString('stringWithUTF8String', '');
    var usertoken = $.NSString('stringWithUTF8String', '');
    var displayname = $.NSString('stringWithUTF8String', '');
    return meetingServiceObj('startMeeting', 100,'userID',userid, 'userToken', usertoken, 'displayName', displayname, 'meetingNumber', meetingnumber,'isDirectShare',isdirectsharedesktop,'sharedApp', directshareappwndhandle,'isVideoOff',isvideooff, 'isAuidoOff', isaudiooff);
  },

  StartMeetingWithOutLogin: function(userid, usertoken, username, meetingnumber, directshareappwndhandle, participantid, isdirectsharedesktop){
    var useridstring = $.NSString('stringWithUTF8String', userid);
    var usertokenstring = $.NSString('stringWithUTF8String', usertoken);
    var meetingnumberstring = $.NSString('stringWithUTF8String', String(meetingnumber));
    var displayname = $.NSString('stringWithUTF8String', username);
    return meetingServiceObj('startMeeting', 99,'userID',useridstring, 'userToken', usertokenstring, 'displayName', displayname, 'meetingNumber', meetingnumberstring,'isDirectShare',isdirectsharedesktop,'sharedApp',directshareappwndhandle,'isVideoOff',true, 'isAuidoOff', true);
  },

  JoinMeeting: function(meetingnum, username, psw, directshareappwndhandle, participantid, webinartoken, isvideooff, isaudiooff, isdirectsharedesktop){
    var toke4enfrocelogin = $.NSString('stringWithUTF8String', '');
    var meetingnumberstring = $.NSString('stringWithUTF8String', String(meetingnum));
    var displayname = $.NSString('stringWithUTF8String', username);
    var password = $.NSString('stringWithUTF8String', psw);
    var participantidstring = $.NSString('stringWithUTF8String', participantid);
    var webinartokenstring = $.NSString('stringWithUTF8String', webinartoken);
    return meetingServiceObj('joinMeeting', 100, 'toke4enfrocelogin', toke4enfrocelogin, 'webinarToken', webinartokenstring, 'participantId', participantidstring, 
    'meetingNumber', meetingnumberstring, 'displayName', displayname, 'password', password, 'isDirectShare', isdirectsharedesktop, 'sharedApp', directshareappwndhandle, 'isVideoOff', isvideooff, 'isAuidoOff', isaudiooff);
  },

  JoinMeeting_APIUSER: function(meetingnum, username, psw, directshareappwndhandle, toke4enfrocelogin, 
                    participantid, webinartoken, isdirectsharedesktop, isvideooff, isaudiooff){
    var toke4enfrocelogin = $.NSString('stringWithUTF8String', toke4enfrocelogin);
    var meetingnumberstring = $.NSString('stringWithUTF8String', String(meetingnum));
    var displayname = $.NSString('stringWithUTF8String', username);
    var password = $.NSString('stringWithUTF8String', psw);
    var participantidstring = $.NSString('stringWithUTF8String', participantid);
    var webinartokenstring = $.NSString('stringWithUTF8String', webinartoken);
    return meetingServiceObj('joinMeeting', 99, 'toke4enfrocelogin', toke4enfrocelogin, 'webinarToken', webinartokenstring, 'participantId', participantidstring, 
    'meetingNumber', meetingnumberstring, 'displayName', displayname, 'password', password, 'isDirectShare', isdirectsharedesktop, 'sharedApp', directshareappwndhandle, 'isVideoOff', isvideooff, 'isAuidoOff', isaudiooff);
  },
  LeaveMeeting: function(endMeeting){
    return meetingServiceObj('leaveMeetingWithCmd', endMeeting);
  },

}
})()

module.exports = 
{
  zoomMeetingBridge: zoomMeetingBridge,
}
var $ = require('../../node_modules/nodobjc');

var actionCommand = {
    ActionCommand_MuteVideo : 0,
    ActionCommand_UnMuteVideo: 1, 
    //audio cmd
    ActionCommand_MuteAudio: 2, 
    ActionCommand_UnMuteAudio: 3, 
    //can unmute by self when mute by host
    ActionCommand_EnableUnmuteBySelf: 4,
    ActionCommand_DisableUnmuteBySelf: 5, 
    //mute/unmute all only for host
    ActionCommand_MuteAll: 6,
    ActionCommand_UnmuteAll: 7,
    //lock meeting cmd
    ActionCommand_LockMeeting: 8,
    ActionCommand_UnLockMeeting: 9,
    //remote control cmd
    ActionCommand_RequestRemoteControl: 10,
    ActionCommand_GiveUpRemoteControl: 11,
    ActionCommand_GiveRemoteControlTo: 12,
    ActionCommand_DeclineRemoteControlRequest: 13,
    ActionCommand_RevokeRemoteControl: 14,
    //lock share cmd
    ActionCommand_LockShare: 15,
    ActionCommand_UnlockShare: 16,
    //lower all hands
    ActionCommand_LowerAllHands: 17,
    //switch share mode
    ActionCommand_ShareFitWindowMode: 18,
    ActionCommand_ShareOriginSizeMode: 19,
    //Pin video
    ActionCommand_PinVideo: 20,
    ActionCommand_UnPinVideo: 21,
    //spotlight video
    ActionCommand_SpotlightVideo: 22,
    ActionCommand_UnSpotlightVideo: 23,
    //pause share
    ActionCommand_PauseShare: 24,
    //resume share
    ActionCommand_ResumeShare: 25,
    //Join Voip
    ActionCommand_JoinVoip: 26,
    //Leave Voip
    ActionCommand_LeaveVoip: 27,
}

var meetingActionObj;

var zoomMeetingActionBridge = (function(){

return{
    SetMeetingAction: function(meetingAction){
     meetingActionObj  = meetingAction;
  },
    
    SetUserJoin: function(onUserJoin)
    {
       var ZOOMSDK = require('./zoomsdk_bridge.js');
       var meetingActionDelegate = ZOOMSDK.meetingActionDelegate;
       meetingActionDelegate.addMethod('onUserJoin:', 'v@:@', function(self, _cmd, obj){
           onUserJoin(obj);
       })
    },
    SetUserLeft: function(onUserLeft)
    {
       var ZOOMSDK = require('./zoomsdk_bridge.js');
       var meetingActionDelegate = ZOOMSDK.meetingActionDelegate;
       meetingActionDelegate.addMethod('onUserLeft:', 'v@:@', function(self, _cmd, obj){
           onUserLeft(obj);
       })
    },
    SetHostChange: function(onHostChange)
    {
       var ZOOMSDK = require('./zoomsdk_bridge.js');
       var meetingActionDelegate = ZOOMSDK.meetingActionDelegate;
       meetingActionDelegate.addMethod('onHostChange:','v@:@', function(self, _cmd, obj){
         onHostChange(obj);
       })
    },

    SetMeetingAudioStatusCB: function(onUserAudioStatusChange)
    {
       var ZOOMSDK = require('./zoomsdk_bridge.js');
       var meetingActionDelegate = ZOOMSDK.meetingActionDelegate;
       meetingActionDelegate.addMethod('onUserAudioStatusChange:','v@:@', function(self, _cmd, obj){
         onUserAudioStatusChange(obj);
       })
    },

    SetMeetingVideoStatusCB: function(onUserVideoStatusChange)
    {
       var ZOOMSDK = require('./zoomsdk_bridge.js');
       var meetingActionDelegate = ZOOMSDK.meetingActionDelegate;
       meetingActionDelegate.addMethod('onVideoStatusChange:UserID:','v@:@@', function(self, _cmd, status, id){
         console.log('test video callback')
         console.log(status)
         var convertstatus = !status
         onUserVideoStatusChange(id, convertstatus);
       })
    },

     MeetingAudio_MuteAudio: function(userid, allowunmutebyself){
     var ret;
     var user = $.NSNumber('numberWithUnsignedInt', userid);
     if(0 != user){// mute user 
       var mutecommand = $.NSNumber('numberWithInt', actionCommand.ActionCommand_MuteAudio);
       ret =  meetingActionObj('actionMeetingWithCmd', mutecommand, 'userID', user, 'onScreen', null)
    }else{ // mute all and set can be unmute by self
        var muteallcommand = $.NSNumber('numberWithInt', actionCommand.ActionCommand_MuteAll);
        ret =  meetingActionObj('actionMeetingWithCmd', muteallcommand, 'userID', user, 'onScreen', null)
     }
      if(allowunmutebyself != undefined){
        if('true' == allowunmutebyself)
        {
          var enableunmutebyselfcommand = $.NSNumber('numberWithInt', actionCommand.ActionCommand_EnableUnmuteBySelf)
          meetingActionObj('actionMeetingWithCmd', enableunmutebyselfcommand, 'userID', user, 'onScreen', null)
        }else{
          var enablemutebyselfcommand = $.NSNumber('numberWithInt', actionCommand.ActionCommand_DisableUnmuteBySelf)
          meetingActionObj('actionMeetingWithCmd', enablemutebyselfcommand, 'userID', user, 'onScreen', null)
        }
    }    
    return ret;
  },
  
  MeetingAudio_UnMuteAudio: function(userid){
    var user = $.NSNumber('numberWithUnsignedInt', userid);
    var ret;
    if(0 != userid){
       var unmutecommand = $.NSNumber('numberWithInt', actionCommand.ActionCommand_UnMuteAudio);
       ret = meetingActionObj('actionMeetingWithCmd', unmutecommand, 'userID', user, 'onScreen', null)
    }else{
      var unmuteallcommand = $.NSNumber('numberWithInt', actionCommand.ActionCommand_UnmuteAll);
      ret = meetingActionObj('actionMeetingWithCmd', unmuteallcommand, 'userID', user, 'onScreen', null)
    }
    return ret
  },

  MeetingAudio_JoinVoip: function(){
    var joinvoipcommand = $.NSNumber('numberWithInt',actionCommand.ActionCommand_JoinVoip)
    var ret  = meetingActionObj('actionMeetingWithCmd', joinvoipcommand, 'userID', null, 'onScreen', null)
    return ret
  },
  
  MeetingAudio_LeaveVoip: function(){
   var leavevoipcommand = $.NSNumber('numberWithInt',actionCommand.ActionCommand_LeaveVoip)
   var ret  = meetingActionObj('actionMeetingWithCmd', leavevoipcommand, 'userID', null, 'onScreen', null)
   return ret
  },

  MeetingVideo_MuteVideo: function(){
   var mutevideocommand = $.NSNumber('numberWithInt',actionCommand.ActionCommand_MuteVideo)
   var ret  = meetingActionObj('actionMeetingWithCmd', mutevideocommand, 'userID', null, 'onScreen', null)
   return ret
  },

  MeetingVideo_UnMuteVideo: function(){
   var unmutevideocommand = $.NSNumber('numberWithInt',actionCommand.ActionCommand_UnMuteVideo)
   var ret  = meetingActionObj('actionMeetingWithCmd', unmutevideocommand, 'userID', null, 'onScreen', null)
   return ret
  }
}
})()

module.exports = 
{
  zoomMeetingActionBridge: zoomMeetingActionBridge,
}
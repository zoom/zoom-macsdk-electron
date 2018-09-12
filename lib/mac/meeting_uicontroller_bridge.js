var $ = require('../../node_modules/nodobjc');

var  MeetingComponent = {
  MeetingComponent_MainWindow: 0,
  MeetingComponent_Audio:1,
  MeetingComponent_Chat:2,
  MeetingComponent_Participants:3,
  MeetingComponent_MainToolBar:4,
  MeetingComponent_MainShareToolBar:5,
  MeetingComponent_AuxShareToolBar:6,
  MeetingComponent_Setting:7,
  MeetingComponent_JBHWindow:8,
  MeetingComponent_ShareOptionWindow:9,
  MeetingComponent_ThumbnailVideo:10,
}

var meetingUIControllerObj;
var zoomMeetingUIController = (function(){
var ZOOMSDKMOD_4MEET = require('./../zoom_sdk.js')
var ZOOMMEETINGMOD = require('./../zoom_meeting.js')
var ZOOMMEETINGCONTROLLERMODE = require('./../zoom_meeting_ui_ctrl.js')
return{
     
     SetMeetingUIController: function(meetingUIController){
      meetingUIControllerObj  = meetingUIController;
     },

     setSDKButtonClickedCB: function(onSDKButtonClicked){
      var ZOOMSDK = require('./zoomsdk_bridge.js');
      var meetingUIControllerDelegate = ZOOMSDK.meetingUIControllerDelegate;
      meetingUIControllerDelegate.addMethod('onToolbarInviteButtonClick:','v@:@',function(self, _cmd, show){
         onSDKButtonClicked(ZOOMMEETINGCONTROLLERMODE.ZoomMeetingButtonType.ButtonType_ToolBarInvite);
      })
      meetingUIControllerDelegate.addMethod('onToolbarShareButtonClick','v@:',function(self, _cmd){
        onSDKButtonClicked(ZOOMMEETINGCONTROLLERMODE.ZoomMeetingButtonType.ButtonType_ToolBarShare);
      })
     meetingUIControllerDelegate.addMethod('onParticipantButtonClicked','v@:',function(self, _cmd){
      onSDKButtonClicked(ZOOMMEETINGCONTROLLERMODE.ZoomMeetingButtonType.ButtonType_ToolBarParticipant);
      })
      meetingUIControllerDelegate.register();
     },
    
     MeetingUI_ShowChatDlg: function(hParent, left, top, right, bottom)
     {
       var rect = $.NSMakeRect(left, top, right, bottom)
       return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_Chat, 'window',null, 'show', 1, 'InPanel', 0, 'frame', rect)
     },

    MeetingUI_HideChatDlg: function()
    {
     return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_Chat, 'window',null, 'show', 0, 'InPanel', 0, 'frame', null)
    },

    MeetingUI_EnterFullScreen: function(bFirstView, bSecView)
    {
      return meetingUIControllerObj('enterFullScreen', 1, 'firstMonitor', bFirstView, 'DualMonitor', bSecView)
    },

    MeetingUI_ExitFullScreen: function(bFirstView, bSecView)
    {
      return meetingUIControllerObj('enterFullScreen', 0, 'firstMonitor', bFirstView, 'DualMonitor', bSecView)
    },

    MeetingUI_SwitchToVideoWall: function(){
      return meetingUIControllerObj('switchToVideoWallView')
    },

    MeetingUI_SwtichToAcitveSpeaker: function(){
      return meetingUIControllerObj('switchToActiveSpeakerView')
    },

    MeetingUI_MoveFloatVideoWnd: function(left, top){
      var rect = $.NSMakeRect(left, top, 0, 0)
      return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_ThumbnailVideo, 'window',null, 'show', 1, 'InPanel', 0, 'frame', rect)
    },

    MeetingUI_ShowSharingToolbar:function(show)
    {
      return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_MainShareToolBar, 'window',null, 'show', show, 'InPanel', 0, 'frame', null)
    },

    MeetingUI_SwitchFloatVideoToActiveSpkMod: function(){
      return meetingUIControllerObj('switchFloatVideoToActiveSpeakerMode')
    },

    MeetingUI_SwitchFloatVideoToGalleryMod: function(){
      return meetingUIControllerObj('switchFloatVideoToGalleryMode')
    },

    MeetingUI_ShowParticipantsListWnd: function(show){
      return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_Participants, 'window',null, 'show', show, 'InPanel', 1, 'frame', null)
    },

    MeetingUI_ShowBottomFloatToolbarWnd: function(show){
      return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_MainToolBar, 'window',null, 'show', show, 'InPanel', 0, 'frame', null)
    },

    MeetingUI_ShowJoinAudioDlg:function(){
      //hard code by totti need modify interface later
      var rect = $.NSMakeRect(300, 300, 0,0)
      return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_Audio, 'window',null, 'show', 1, 'InPanel', 0, 'frame', rect)
    },

    MeetingUI_HideJoinAudioDlg:function(){
      return meetingUIControllerObj('showMeetingComponent', MeetingComponent.MeetingComponent_Audio, 'window',null, 'show', 0, 'InPanel', 0, 'frame', null)
    },

    MeetingUI_ChangeFloatActiveSpkVideoSize: function(floatvideotype){
      if(ZOOMMEETINGCONTROLLERMODE.ZoomMeetingUIFloatVideoType.FLOATVIDEO_List == floatvideotype || ZOOMMEETINGCONTROLLERMODE.ZoomMeetingUIFloatVideoType.FLOATVIDEO_Small == floatvideotype)
       return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_NO_IMPL
      else if(ZOOMMEETINGCONTROLLERMODE.ZoomMeetingUIFloatVideoType.FLOATVIDEO_Minimize == floatvideotype)
        return meetingUIControllerObj('minimizeShareFloatVideoWindow', 1)
      else if (ZOOMMEETINGCONTROLLERMODE.ZoomMeetingUIFloatVideoType.FLOATVIDEO_Large == floatvideotype)
        return meetingUIControllerObj('minimizeShareFloatVideoWindow', 0)
      return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_WRONG_USEAGE
    }
}
})()

module.exports = 
{
  zoomMeetingUIController: zoomMeetingUIController,
}
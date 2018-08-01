var ZoomMeetingUIFloatVideoType = {
	FLOATVIDEO_List:0,
	FLOATVIDEO_Small:1,
	FLOATVIDEO_Large:2,
	FLOATVIDEO_Minimize:3,
};

var ZoomMeetingButtonType = {
    ButtonType_ToolBarParticipant:0,
    ButtonType_ToolBarShare:1,
    ButtonType_ToolBarInvite:2,

};
var ZoomMeetingUICtrl = (function () {
  var instance;
   /**
 * Zoom SDK Meeting UI Controller Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomMeetingUICtrl}
 */
  function init(opts) {
 
    var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var ZOOMSDKMEETINGMOD = require('./zoom_meeting.js')
    var clientOpts = opts || {};
    var sdkbuttonclickcb = opts.sdkbuttonclickcb;
    var _ostype = opts.ostype;
    var _addon
    // Private methods and variables
    if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _ostype)
         _addon = clientOpts.addon || null
    else{
        var MEETINGUIBRIDGE = require('./mac/meeting_uicontroller_bridge.js')
        _addon = MEETINGUIBRIDGE.zoomMeetingUIController
    }
    if(_addon)
    {
        if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS== _ostype)
        {
            _addon.setSDKButtonClickedCB(onSDKButtonClicked);
        }
    }

    function onSDKButtonClicked(buttonType)
    {
        sdkbuttonclickcb(buttonType);
    }

    return {
 
      // Public methods and variables
      /** Show inmeeting chat window
        * @param {{
        *  hParent: parent window handle.
        *  left: chat window left pos
        *  top: chat window top pos
        *  right: chat window right pos
        *  bottom: chat window bottom pos
        * }} opts
        * @return {ZoomSDKError}
        */
       MeetingUI_ShowChatDlg: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var hParent = clientOpts.hParent || 0
                var left = clientOpts.left || 0
                var top = clientOpts.top || 0
                var right = clientOpts.right || 0
                var bottom = clientOpts.bottom || 0
                return _addon.MeetingUI_ShowChatDlg(hParent, left, top, right, bottom)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Hide inmeeting chat window
        * @return {ZoomSDKError}
        */
        MeetingUI_HideChatDlg: function () {
            if (_addon){
                return _addon.MeetingUI_HideChatDlg()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Enter full screen mode
        * @param {{
        *  viewtype: view type of the meeting ui, define at ZoomMeetingUIViewType.
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingUI_EnterFullScreen: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETINGMOD.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                var bFirstView = (ZOOMSDKMEETINGMOD.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR == viewtype) ? true : false
                var bSecView = (ZOOMSDKMEETINGMOD.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR == viewtype) ? false : true
                return _addon.MeetingUI_EnterFullScreen(bFirstView, bSecView)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Exit full screen mode
        * @param {{
        *  viewtype: view type of the meeting ui, define at ZoomMeetingUIViewType.
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingUI_ExitFullScreen: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETINGMOD.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                var bFirstView = (ZOOMSDKMEETINGMOD.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR == viewtype) ? true : false
                var bSecView = (ZOOMSDKMEETINGMOD.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR == viewtype) ? false : true
                return _addon.MeetingUI_ExitFullScreen(bFirstView, bSecView)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Switch to video wall mode
        * @return {ZoomSDKError}
        */
        MeetingUI_SwitchToVideoWall: function () {
            if (_addon){
                return _addon.MeetingUI_SwitchToVideoWall()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Switch to active speaker mode
        * @return {ZoomSDKError}
        */
        MeetingUI_SwtichToAcitveSpeaker: function () {
            if (_addon){
                return _addon.MeetingUI_SwtichToAcitveSpeaker()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Move float video window
        * @param {{
        *  left: chat window left pos
        *  top: chat window top pos
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingUI_MoveFloatVideoWnd : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var left = clientOpts.left || 0
                var top = clientOpts.top || 0
                return _addon.MeetingUI_MoveFloatVideoWnd(left, top)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Show or hide the toolbar of sharing
        * @param {{
        *  show: show or not
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingUI_ShowSharingToolbar : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var show = clientOpts.show
                return _addon.MeetingUI_ShowSharingToolbar(show)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Switch float video to active speaker mode
        * @return {ZoomSDKError}
        */
        MeetingUI_SwitchFloatVideoToActiveSpkMod: function () {
            if (_addon){
                return _addon.MeetingUI_SwitchFloatVideoToActiveSpkMod()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE            
        },

      /** Switch float video to gallery mode
        * @return {ZoomSDKError}
        */
        MeetingUI_SwitchFloatVideoToGalleryMod: function() {
            if (_addon){
                return _addon.MeetingUI_SwitchFloatVideoToGalleryMod()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE  
        },

      /** Show or hide the window of participants list
        * @param {{
        *  show: show or not
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingUI_ShowParticipantsListWnd: function(opts) {
            if (_addon){
                var clientOpts = opts || {}
                var show = clientOpts.show
                return _addon.MeetingUI_ShowParticipantsListWnd(show)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Show or hide the window of bottom float tool bar
        * @param {{
        *  show: show or not
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingUI_ShowBottomFloatToolbarWnd: function(opts) {
            if (_addon){
                var clientOpts = opts || {}
                var show = clientOpts.show
                return _addon.MeetingUI_ShowBottomFloatToolbarWnd(show)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Show join audio dialog
        * @return {ZoomSDKError}
        */
        MeetingUI_ShowJoinAudioDlg: function() {
            if (_addon){
                return _addon.MeetingUI_ShowJoinAudioDlg()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE  
        },

      /** Hide join audio dialog
        * @return {ZoomSDKError}
        */
        MeetingUI_HideJoinAudioDlg: function() {
            if (_addon){
                return _addon.MeetingUI_HideJoinAudioDlg()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE  
        },

        /** Change float active speaker window type and size
        * @param {{
        *  floatvideotype: the type of float active speaker window, define at ZoomMeetingUIFloatVideoType.
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingUI_ChangeFloatActiveSpkVideoSize : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var floatvideotype = clientOpts.floatvideotype || ZoomMeetingUIFloatVideoType.FLOATVIDEO_Small
                return _addon.MeetingUI_ChangeFloatActiveSpkVideoSize(floatvideotype)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        }
    };
 
  };
 
  return {
    /**
     * Get Zoom SDK Meeting Service Module
     * @return {ZoomMeetingUICtrl}
    */
    getInstance: function (opts) {
 
      if ( !instance ) {
        instance = init(opts)
      }
 
      return instance
    }
 
  };
 
})();

module.exports = {
    ZoomMeetingUIFloatVideoType: ZoomMeetingUIFloatVideoType,
    ZoomMeetingUICtrl: ZoomMeetingUICtrl,
    ZoomMeetingButtonType: ZoomMeetingButtonType,
}
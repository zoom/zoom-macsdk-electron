
//var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')

var ZoomMeetingConfiguration = (function () {
  var instance;
   /**
 * Zoom SDK Meeting configuration module Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomMeetingConfiguration}
 */
  function init(opts) {
    var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var clientOpts = opts || {};
    var _osType = clientOpts.ostype
    // Private methods and variables
    var _addon
    if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _osType)
    {
      _addon = clientOpts.addon || null
    }else if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _osType){
      var MEETINGCONFIGBRIDGE = require('./mac/meeting_config_bridge.js');
      _addon = MEETINGCONFIGBRIDGE.zoomMeetingConfigBridge;
    }
    return {

   // Public methods and variables
  /** Set Float VideoPos
  * @param {{
  *  hSelfWnd:SelfWnd.
  *  left: Float Video left pos
  *  top: Float Video pos
  * }} opts
  * @return {ZoomSDKError}
  */
        MeetingConfig_SetFloatVideoPos: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var hSelfWnd = clientOpts.hSelfWnd || 0
                var hParent = clientOpts.hParent || 0
                var left = clientOpts.left || 0
                var top = clientOpts.top || 0
                return _addon.MeetingConfig_SetFloatVideoPos(hSelfWnd, hParent, left, top)
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Set visibility of the meeting bottom float toolbar 
        * @param {{
        *  show: show or not
        * }} opts
        * @return {ZoomSDKError}
        */
       MeetingConfig_SetBottomFloatToolbarWndVisibility: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var show = clientOpts.show
                return _addon.MeetingConfig_SetBottomFloatToolbarWndVisibility(show)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },
       
        /** Set Sharing Toolbar Visibility 
          * @param {{
          *  show: show or not
          * }} opts
          * @return {ZoomSDKError}
          */
       MeetingConfig_SetSharingToolbarVisibility: function (opts) {
           if (_addon) {
               var clientOpts = opts || {}
               var show = clientOpts.show
               return _addon.MeetingConfig_SetSharingToolbarVisibility(show)
           }
           return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },

        /** Set Direct Share MonitorID:
          * @param {{
          * monitorID:String
          * }} opts
          * @return {ZoomSDKError}
          */
       MeetingConfig_SetDirectShareMonitorID: function (opts) {
           if (_addon) {
               var clientOpts = opts || {}
               var monitorID = clientOpts.monitorID
               return _addon.MeetingConfig_SetDirectShareMonitorID(monitorID)
           }
           return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },

          /** Set Meeting UI Pos
           * @param {{
           *  hSelfWnd:SelfWnd.
           * hParent:hParent
           *  left: Float Video left pos
           *  top: Float Video pos
           * }} opts
           * @return {ZoomSDKError}
           */
            MeetingConfig_SetMeetingUIPos: function (opts) {
               if (_addon) {
                   var clientOpts = opts || {}
                   var hSelfWnd = clientOpts.hSelfWnd || 0
                   var hParent = clientOpts.hParent || 0
                   var left = clientOpts.left || 0
                   var top = clientOpts.top || 0
         
                   return _addon.MeetingConfig_SetMeetingUIPos(hSelfWnd, hParent, left, top)
               }

               return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
           },



        /** Disable Waiting For Host Dialog
          * @param {{
          *  Disable: disable or enable 
          * }} opts
          * @return {ZoomSDKError}
          */
       MeetingConfig_DisableWaitingForHostDialog: function (opts) {
           if (_addon) {
               var clientOpts = opts || {}
               var Disable = clientOpts.Disable
               return _addon.MeetingConfig_DisableWaitingForHostDialog(Disable)
           }

           return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },


        /** Hide Meeting Info From Meeting UI Title
          * @param {{
          *  Disable: Hide or not
          * }} opts
          * @return {ZoomSDKError}
          */
       MeetingConfig_HideMeetingInfoFromMeetingUITitle: function (opts) {
           if (_addon) {
               var clientOpts = opts || {}
               var Hide = clientOpts.Hide
               return _addon.MeetingConfig_HideMeetingInfoFromMeetingUITitle(Hide)
           }
           return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },



        /** Set Meeting ID For Meeting UI Title
          * @param {{
          *  meetingNumber:UINT64
          * }} opts
          * @return {ZoomSDKError}
          */
          MeetingConfig_SetMeetingIDForMeetingUITitle: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var meetingNumber = clientOpts.meetingNumber
                return _addon.MeetingConfig_SetMeetingIDForMeetingUITitle(meetingNumber)
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
          },


        /** Disable Popup Meeting Wrong PSW Dlg
          * @param {{
          *  bDisable:disable or enable 
          * }} opts
          * @return {ZoomSDKError}
          */
          MeetingConfig_DisablePopupMeetingWrongPSWDlg: function (opts) {
              if (_addon) {
                  var clientOpts = opts || {}
                  var Disable = clientOpts.Disable
                  return _addon.MeetingConfig_DisablePopupMeetingWrongPSWDlg(Disable)
              }
              return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
          },



        /** Enable Auto End Other Meeting When Start Meeting
          * @param {{
          *  Enable:Enable or not
          * }} opts
          * @return {ZoomSDKError}
          */
          MeetingConfig_EnableAutoEndOtherMeetingWhenStartMeeting: function (opts) {
              if (_addon) {
                  var clientOpts = opts || {}
                  var Enable = clientOpts.Enable
                  return _addon.MeetingConfig_EnableAutoEndOtherMeetingWhenStartMeeting(Enable)
              }
              return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
          },


        /** Enable Button DB Click Switch Full Screen Mode
         * @param {{
         *  Enable: Enable or not
         * }} opts
         * @return {ZoomSDKError}
         */
          MeetingConfig_EnableLButtonDBClick4SwitchFullScreenMode: function (opts) {
              if (_addon) {
                  var clientOpts = opts || {}
                  var Enable = clientOpts.Enable
                  return _addon.MeetingConfig_EnableLButtonDBClick4SwitchFullScreenMode(Enable)
              }
              return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
          },
        

        /** Set Float Video Wnd Visibility
         * @param {{
         *  show: show or not
         * }} opts
         * @return {ZoomSDKError}
         */
          MeetingConfig_SetFloatVideoWndVisibility: function (opts) {
              if (_addon) {
                  var clientOpts = opts || {}
                  var show = clientOpts.show
                  return _addon.MeetingConfig_SetFloatVideoWndVisibility(show)
              }

              return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
          },


        /** Pre Populate Webinar Registration Information
       * @param {{
       *  email: String, username :string 
       * }} opts
       * @return {ZoomSDKError}
       */

          MeetingConfig_PrePopulateWebinarRegistrationInfo: function (opts) {
              if (_addon) {
                  var clientOpts = opts || {}
                  var email = clientOpts.email
                  var username = clientOpts.username
                  return _addon.MeetingConfig_PrePopulateWebinarRegistrationInfo(email, username)
              }
              return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
          },

       /** config disable or enable free user original UI 
       * @param {{
       * }} opts
       * @return {ZoomSDKError}
       */
          MeetingConfig_DisableFreeUserOriginAction: function (opts) {
            if (_addon) {
                var disable = opts.disable
                return _addon.MeetingConfig_DisableFreeUserOriginAction(disable)
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },
		
        /** Set the visibility of Invite button in te toolbar
         * @param {{
         *  show: show or not
         * }} opts
         * @return {ZoomSDKError}
         */
          MeetingConfig_EnableInviteButtonOnMeetingUI: function (opts) {
              if (_addon) {
                  var clientOpts = opts || {}
                  var show = clientOpts.show
                  return _addon.MeetingConfig_EnableInviteButtonOnMeetingUI(show)
              }

              return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
          },		

    };
 
  };
 
  return {
    /**
     * Get Zoom SDK Meeting Configuration Module
     * @return {ZoomMeetingConfiguration}
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
    ZoomMeetingConfiguration: ZoomMeetingConfiguration,
}
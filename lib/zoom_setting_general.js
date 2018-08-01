var ZOOMSDKMOD_4GeneralSetting = require('./zoom_sdk.js')
var ZoomGeneralSetting = (function () {
  var instance;
   /**
 * Zoom SDK GeneralSettings Service Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomGeneralSetting}
 */
  function init(opts) {
 
    var clientOpts = opts || {};

    // Private methods and variables
    var _addon = clientOpts.addon || null
    
    return {
        /** Enable Dual Screen Mode
       * @param {{
       *  EnableDualScreenMode: EnableDualScreenMode or not
       * }} opts
       * @return {ZoomSDKError}
       */

        Setting_EnableDualScreenMode: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var Enable = clientOpts.Enable
                return _addon.Setting_EnableDualScreenMode(Enable)
            }
            return ZOOMSDKMOD_4GeneralSetting.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        
 
        /** Turn Off Aero Mode In Sharing
      * @param {{
      *  Turnoff: Turnoff or not
      * }} opts
      * @return {ZoomSDKError}
      */
        Setting_TurnOffAeroModeInSharing: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var bTurnoff = clientOpts.bTurnoff
                return _addon.Setting_TurnOffAeroModeInSharing(bTurnoff)
            }
            return ZOOMSDKMOD_4GeneralSetting.ZoomSDKError.SDKERR_UNINITIALIZE
        },
 
        /** Enable Auto Fit To Window When View Sharing
        * @param {{
        *  Enable: Enable or not
        * }} opts
        * @return {ZoomSDKError}
        */
        Setting_EnableAutoFitToWindowWhenViewSharing: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var Enable = clientOpts.Enable
                return _addon.Setting_EnableAutoFitToWindowWhenViewSharing(Enable)
            }
            return ZOOMSDKMOD_4GeneralSetting.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Enable Auto Full Screen Video When Join Meeting
        * @param {{
        *  Enable: Enable or not
        * }} opts
        * @return {ZoomSDKError}
        */
        Setting_EnableAutoFullScreenVideoWhenJoinMeeting: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var Enable = clientOpts.Enable
                return _addon.Setting_EnableAutoFullScreenVideoWhenJoinMeeting(Enable)
            }
            return ZOOMSDKMOD_4GeneralSetting.ZoomSDKError.SDKERR_UNINITIALIZE
        },
 
        /** Enable Split Screen Mode
       * @param {{
       *  Enable: Enable or not
       * }} opts
       * @return {ZoomSDKError}
       */
        Setting_EnableSplitScreenMode: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var Enable = clientOpts.Enable
                return _addon.Setting_EnableSplitScreenMode(Enable)
            }
            return ZOOMSDKMOD_4GeneralSetting.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Check if Is Dual Screen Mode Enabled.
        * @return {bool}
       */
        Checking_IsDualScreenModeEnabled: function (opts) {
            if (_addon) {
                return _addon.Checking_IsDualScreenModeEnabled()
            }
            return false
        },

        /** Check if Is Aero Mode In Sharing Turn Off.
         * @return {bool}
        */
        Checking_IsAeroModeInSharingTurnOff: function (opts) {
        if (_addon) {
            return _addon.Checking_IsAeroModeInSharingTurnOff()
        }
        return false
        },

        /** Check if Is Auto Fit To Window When View Sharing Enabled.
        * @return {bool}
        */
        Checking_IsAutoFitToWindowWhenViewSharingEnabled: function (opts) {
            if (_addon) {
                return _addon.Checking_IsAutoFitToWindowWhenViewSharingEnabled()
            }
            return false
        },

        /** Check if IsAutoFullScreenVideoWhenJoinMeetingEnabled.
         * @return {bool}
        */
        Checking_IsAutoFullScreenVideoWhenJoinMeetingEnabled: function (opts) {
            if (_addon) {
                return _addon.Checking_IsAutoFullScreenVideoWhenJoinMeetingEnabled()
            }
            return false
        },

        /** Check if Is Split Screen Mode Enabled.
         * @return {bool}
         */
        Checking_IsSplitScreenModeEnabled: function (opts) {
            if (_addon) {
                return _addon.Checking_IsSplitScreenModeEnabled()
            }
            return false
        },

  };
};
  return {
    /**
     * Get Zoom SDK General Setting Service Module
     * @return {ZoomGeneralSetting}
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
    ZoomGeneralSetting: ZoomGeneralSetting,
}
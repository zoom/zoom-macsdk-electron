
var ZOOMSDKMOD_4Setting = require('./zoom_sdk.js')
 
var ZOOMSDKMOD_AudioSetting = require('./zoom_setting_audio.js')
var ZOOMSDKMOD_VideoSetting = require('./zoom_setting_video.js')
var ZOOMSDKMOD_GeneralSetting = require('./zoom_setting_general.js')
var ZOOMSDKMOD_RecordingSetting = require('./zoom_setting_recording.js')
 
var ZoomSetting = (function () {
  var instance;
   /**
 * Zoom SDK Settings Service Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomSetting}
 */
  function init(opts) {
 
    var clientOpts = opts || {};

    // Private methods and variables
    var _addon = clientOpts.addon || null
    return {
    
        /** Show The Setting Dlg
          * @param {{
          *  hParent: parent setting handle.
          *  left: setting dlg left pos
          *  top: setting dlg top pos
	  *  hSettingWnd:Setting Wnd
          *  bShow: show or not 
          * }} opts
          * @return {ZoomSDKError}
          */
        SettingUI_ShowTheSettingDlg: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                clientOpts.addon = _addon
                var hParent = clientOpts.hParent || 0
                var top = clientOpts.top || 0
                var left = clientOpts.left || 0
		var hSettingWnd = clientOpts.hSettingWnd || 0
                var bShow = clientOpts.bShow || true
                return _addon.SettingUI_ShowTheSettingDlg(hParent, top, left, hSettingWnd,bShow)
            }
            return ZOOMSDKMOD_4Setting.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Hide Setting Dlg
          * @return {ZoomSDKError}
          */
        SettingUI_HideSettingDlg: function () {
            if (_addon) {
                return _addon.SettingUI_HideSettingDlg()
            }
            return ZOOMSDKMOD_4Setting.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /**
          *  Get General Setting Module
          * @return {ZoomSetting}
         */
        GetGeneralSetting: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                clientOpts.addon = _addon
                return ZOOMSDKMOD_GeneralSetting.ZoomGeneralSetting.getInstance(clientOpts)
            }
            return null
        },

        /**
          *  Get Recording Setting
          * @return {ZoomSetting}
         */
        GetRecordingSetting: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                clientOpts.addon = _addon
                return ZOOMSDKMOD_RecordingSetting.ZoomRecordingSetting.getInstance(clientOpts)
            }
            return null
        },

      /**
        * Get Zoom SDK Audio Setting Module
        * @return {ZoomSetting}
       */
      GetAudioSetting : function (opts) {
        if (_addon){
            var clientOpts = opts || {}
            clientOpts.addon = _addon
            return ZOOMSDKMOD_AudioSetting.ZoomAudioSetting.getInstance(clientOpts)
        }

        return null
    },

    /**
        * Get Zoom SDK Video Setting Module
        * @return {ZoomSetting}
       */
      GetVideoSetting : function (opts) {
        if (_addon){
            var clientOpts = opts || {}
            clientOpts.addon = _addon
            return ZOOMSDKMOD_VideoSetting.ZoomVideoSetting.getInstance(clientOpts)
        }
        return null
      },
    //
  };
};
  return {
    /**
     * Get Zoom SDK Setting Service Module
     * @return {ZoomSetting}
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
  ZoomSetting: ZoomSetting,
}
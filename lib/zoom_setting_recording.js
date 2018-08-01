var ZOOMSDKMOD_4RecordingSetting = require('./zoom_sdk.js')
 var ZoomRecordingSetting = (function () {
  var instance;
   /**
 * Zoom SDK RecordingSetting Service Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomRecordingSetting}
 */
  function init(opts) {
    var clientOpts = opts || {};
    // Private methods and variables
    var _addon = clientOpts.addon || null
    return {

        /** Set Recording Path
        * @param {{
        *  szPath: String 
        * }} opts
        * @return {ZoomSDKError}
        */
        Setting_SetRecordingPath: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var szPath = clientOpts.szPath
                return _addon.Setting_SetRecordingPath(szPath)
            }
            return ZOOMSDKMOD_4RecordingSetting.ZoomSDKError.SDKERR_UNINITIALIZE
        },

           /** Get Recording Path
            * @return {string Recording Path}
            */
        Getting_GetRecordingPath: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                return _addon.Getting_GetRecordingPath()
            }
            return ""
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
    ZoomRecordingSetting: ZoomRecordingSetting,
} 
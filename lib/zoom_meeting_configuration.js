
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
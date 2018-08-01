//var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')

var ZoomMeetingShare = (function () {
  var instance;
   /**
 * Zoom SDK Meeting share module Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomMeetingShare}
 */
  function init(opts) {
    var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var clientOpts = opts || {};
    var _ostype = clientOpts.ostype
    // Private methods and variables
    var _addon
    if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _ostype)
       _addon = clientOpts.addon || null
    else{
       var MEETINGASBRIDGE = require('./mac/meeting_as_bridge.js')
       _addon = MEETINGASBRIDGE.zoomMeetingASBridge
    }
    return {
 
      // Public methods and variables
      /** Start app share
        * @param {{
        *  apphandle: Specifies which the window is to be shared.
        * }} opts
        * @return {ZoomSDKError}
        */
       MeetingShare_StartAppShare: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var apphandle = clientOpts.apphandle
                return _addon.MeetingShare_StartAppShare(apphandle)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** start desktopshare 
        * @param {{
        *  monitorid: Specifies which the monitor is to be shared.Using EnumDisplayMonitors System api to get this value.
        * }} opts
        * @return {ZoomSDKError}
        */
       MeetingShare_StartMonitorShare: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var monitorid = clientOpts.monitorid            
                return _addon.MeetingShare_StartMonitorShare(monitorid)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

         /** stop share 
        * @return {ZoomSDKError}
        */
       MeetingShare_StopShare: function () {
            if (_addon){
                return _addon.MeetingShare_StopShare()
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },
    };
 
  };
 
  return {
    /**
     * Get Zoom SDK Meeting Audio Module
     * @return {ZoomMeetingShare}
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
    ZoomMeetingShare: ZoomMeetingShare,
}
var ZoomMeetingVideoStatus = {
  Video_ON: 0,
  Video_OFF: 1,
};

//var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')

var ZoomMeetingVideo = (function () {
  var instance;
   /**
 * Zoom SDK Meeting video module Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomMeetingVideo}
 */
  function init(opts) {
    var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var clientOpts = opts || {};
    var _ostype = clientOpts.ostype
    var _videostatuscb = clientOpts.videostatuscb || null
    var _zoommeeting = clientOpts.zoommeeting || null

    // Private methods and variables
    var _addon
    if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _ostype)
        _addon = clientOpts.addon || null
    else if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _ostype){
        var MEETINGACTIONBRIDGE = require('./mac/meeting_action_bridge.js')
        _addon = MEETINGACTIONBRIDGE.zoomMeetingActionBridge
    }
    if (_addon){
      _addon.SetMeetingVideoStatusCB(onUserVideoStatusChange)
    }

    function onUserVideoStatusChange(userid, status) {
        if (_zoommeeting)
            _zoommeeting.UpdateVideoStatus(userid, status)
        if (null != _videostatuscb) {
            _videostatuscb(userid, status)
        }
    }

    return {
         // Public methods and variables
        /** Mute video
        * @return {ZoomSDKError}
        */
       MeetingVideo_MuteVideo: function (opts) {
            if (_addon){
                return _addon.MeetingVideo_MuteVideo()
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

         /** Unmute video
        * @return {ZoomSDKError}
        */
       MeetingVideo_UnMuteVideo: function (opts) {
            if (_addon){
                return _addon.MeetingVideo_UnMuteVideo()
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },

        /**pin video
        * @param {{
       *  Pin: Pin or not
       *  FirstView: FirstView or not
       *  userid:Specifies which the user's video to pin
       * }}
       * @return {ZoomSDKError}
       */
       MeetingVideo_PinVideo: function (opts) {
        if (_addon){
            var clientOpts = opts || {}
            var Pin = clientOpts.Pin
            var FirstView = clientOpts.FirstView
            var userid = clientOpts.userid
  
            return _addon.MeetingVideo_PinVideo(Pin, FirstView, userid)
        }

        return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
    },



        /**Spotlight video
        * @param {{
       *  Spotlight: Spotlight or not
       *  userid:Specifies which the user's video to pin
       * }}
       * @return {ZoomSDKError}
       */
       MeetingVideo_SpotlightVideo: function (opts) {
           if (_addon) {
               var clientOpts = opts || {}
               var Spotlight = clientOpts.Spotlight
               var userid = clientOpts.userid
               return _addon.MeetingVideo_SpotlightVideo(Spotlight, userid)
           }
           return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },


        /**Hide Or Show No Video User On Video Wall 
        * @param {{
        Hide:Hide or not
       * }}
       * @return {ZoomSDKError}
       */
       MeetingVideo_HideOrShowNoVideoUserOnVideoWall: function (opts) {
           if (_addon) {
               var clientOpts = opts || {}
               var Hide = clientOpts.Hide
               return _addon.MeetingVideo_HideOrShowNoVideoUserOnVideoWall(Hide)
           }
           return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },

    };
  };
 
  return {
    /**
     * Get Zoom SDK Meeting Video Module
     * @return {ZoomMeetingVideo}
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
    ZoomMeetingVideo: ZoomMeetingVideo,
    ZoomMeetingVideoStatus: ZoomMeetingVideoStatus,
}
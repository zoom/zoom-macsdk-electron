var ZoomMeetingAudioStatus = {
  Audio_None: 0,
  Audio_Muted: 1,
  Audio_UnMuted: 2,
  Audio_Muted_ByHost: 3,
  Audio_UnMuted_ByHost: 4,
  Audio_MutedAll_ByHost: 5,
  Audio_UnMutedAll_ByHost: 6,
};


//var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')

var ZoomMeetingAudio = (function () {
  var instance;
   /**
 * Zoom SDK Meeting audio module Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomMeetingAudio}
 */
  function init(opts) {
    var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var clientOpts = opts || {};

    // Private methods and variables
    var _ostype = clientOpts.ostype
    var _addon
    if( ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _ostype)
        _addon = clientOpts.addon || null
    else if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _ostype)
    {
       var MEETINGACTIONBRIDGE = require('./mac/meeting_action_bridge.js')
        _addon = MEETINGACTIONBRIDGE.zoomMeetingActionBridge
    }    
    var _audiostatuscb = clientOpts.audiostatuscb || null
    var _zoommeeting = clientOpts.zoommeeting || null

    if (_addon){
      _addon.SetMeetingAudioStatusCB(onUserAudioStatusChange)
    }

    function onUserAudioStatusChange(audiostatusinfo) {
      if (typeof audiostatusinfo === 'string')
        var audiostatus = JSON.parse(audiostatusinfo);
      else
        var audiostatus = audiostatusinfo;

      audiostatus.audiostatusnotify.forEach(function (item, index) {
        var userid = parseInt(item.userid, 10)
        var audiostatus = item.audiostatus
        if (_zoommeeting)
          _zoommeeting.UpdateAudioStatus(userid, audiostatus)
        if (null != _audiostatuscb) {
          _audiostatuscb(userid, audiostatus)
        }
      });
    }
    return {
 
      // Public methods and variables
      /** Mute audio 
        * @param {{
        *  userid: Specifies which the user's audio to mute.if is zero, mute all of users
        *  allowunmutebyself: Specifies can unmute by self or not when mute all.[boolean]
        * }} opts
        * @return {ZoomSDKError}
        */
       MeetingAudio_MuteAudio: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var userid = clientOpts.userid
                var allowunmutebyself = clientOpts.allowunmutebyself
                
                return _addon.MeetingAudio_MuteAudio(userid, allowunmutebyself)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        // Public methods and variables
      /** Unmute audio 
        * @param {{
        *  userid: Specifies which the user's audio to mute.if is zero, unmute all of users
        * }} opts
        * @return {ZoomSDKError}
        */
       MeetingAudio_UnMuteAudio: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var userid = clientOpts.userid            
                return _addon.MeetingAudio_UnMuteAudio(userid)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Join Voip audio 
        * @param {{
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingAudio_JoinVoip: function (opts) {
          if (_addon){
            return _addon.MeetingAudio_JoinVoip();
          }
          return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

         /** Leave Voip audio 
        * @param {{
        * }} opts
        * @return {ZoomSDKError}
        */
        MeetingAudio_LeaveVoip: function (opts) {
          if (_addon) {
            return _addon.MeetingAudio_LeaveVoip();
          }
          return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },
    };
  };
 
  return {
    /**
     * Get Zoom SDK Meeting Audio Module
     * @return {ZoomMeetingAudio}
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
    ZoomMeetingAudio: ZoomMeetingAudio,
    ZoomMeetingAudioStatus: ZoomMeetingAudioStatus,
}
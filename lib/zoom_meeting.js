var ZoomMeetingStatus = {
	MEETING_STATUS_IDLE:0,///< Idle status, no meeting running
	MEETING_STATUS_CONNECTING:1,///< Connecting meeting server status
	MEETING_STATUS_WAITINGFORHOST:2,///< Waiting for host to start meeting
	MEETING_STATUS_INMEETING:3,///< Meeting is ready, in meeting status
	MEETING_STATUS_DISCONNECTING:4,///< Disconnecting meeting server status
	MEETING_STATUS_RECONNECTING:5,///< Reconnecting meeting server status
	MEETING_STATUS_FAILED:6,///< Meeting connection error
	MEETING_STATUS_ENDED:7,///< Meeting is ended
	MEETING_STATUS_UNKNOW:8,
	MEETING_STATUS_LOCKED:9,
	MEETING_STATUS_UNLOCKED:10,
	MEETING_STATUS_IN_WAITING_ROOM:11,
	MEETING_STATUS_WEBINAR_PROMOTE:12,
	MEETING_STATUS_WEBINAR_DEPROMOTE:13,
	MEETING_STATUS_JOIN_BREAKOUT_ROOM:14,
	MEETING_STATUS_LEAVE_BREAKOUT_ROOM:15,
    MEETING_STATUS_AUDIO_READY:16,
    MEETING_STATUS_OTHER_MEETING_INPROGRESS:17,
};

var ZoomMeetingFailCode = {
	MEETING_SUCCESS							: 0,
	MEETING_FAIL_NETWORK_ERR				: 1,
	MEETING_FAIL_RECONNECT_ERR				: 2,
	MEETING_FAIL_MMR_ERR					: 3,
	MEETING_FAIL_PASSWORD_ERR				: 4,
	MEETING_FAIL_SESSION_ERR				: 5,
	MEETING_FAIL_MEETING_OVER				: 6,
	MEETING_FAIL_MEETING_NOT_START			: 7,
	MEETING_FAIL_MEETING_NOT_EXIST			: 8,
	MEETING_FAIL_MEETING_USER_FULL			: 9,
	MEETING_FAIL_CLIENT_INCOMPATIBLE		: 10,///< RESULT_ZC_INCOMPATIBLE
	MEETING_FAIL_NO_MMR						: 11,
	MEETING_FAIL_CONFLOCKED					: 12,
	MEETING_FAIL_MEETING_RESTRICTED			: 13,
	MEETING_FAIL_MEETING_RESTRICTED_JBH		: 14,
	MEETING_FAIL_CANNOT_EMIT_WEBREQUEST		: 15,
	MEETING_FAIL_CANNOT_START_TOKENEXPIRE	: 16,
	SESSION_VIDEO_ERR						: 17,
	SESSION_AUDIO_AUTOSTARTERR				: 18,
	MEETING_FAIL_REGISTERWEBINAR_FULL		: 19,
	MEETING_FAIL_REGISTERWEBINAR_HOSTREGISTER		: 20,
	MEETING_FAIL_REGISTERWEBINAR_PANELISTREGISTER	: 21,
	MEETING_FAIL_REGISTERWEBINAR_DENIED_EMAIL		: 22,
	MEETING_FAIL_ENFORCE_LOGIN		: 23,
	MEETING_FAIL_WRITE_CONFIG_FILE			: 50,	///< Failed to write configure file
	MEETING_FAIL_FORBID_TO_JOIN_INTERNAL_MEETING: 60,
}; 

var ZoomMeetingUIViewType = {
	MEETINGUI_FIRST_MONITOR:0,
	MEETINGUI_SECOND_MONITOR:1,
};
/*! \enum ConnectionQuality
    \brief Connection quality.
    A more detailed struct description.
*/
var  ConnectionQuality =
{
	Conn_Quality_Unknow:0,
	Conn_Quality_Very_Bad:1,
	Conn_Quality_Bad:2,
	Conn_Quality_Not_Good:3,
	Conn_Quality_Normal:4,
	Conn_Quality_Good:5,
	Conn_Quality_Excellent:6,
};

var  ZoomUserType =
{
    ZoomUserType_APIUSER:0,
	ZoomUserType_EMAIL_LOGIN:1,
	ZoomUserType_FACEBOOK:2,
	ZoomUserType_GoogleOAuth:3,
	ZoomUserType_SSO:4,
	ZoomUserType_Unknown:5,
};
//var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
var ZoomMeetingUIMOD = require('./zoom_meeting_ui_ctrl.js')
var ZoomAnnotationMOD = require('./zoom_annotation_ctrl.js')
var ZoomMeetingConfigurationMOD = require('./zoom_meeting_configuration.js')
var ZoomMeetingAudioMOD = require('./zoom_meeting_audio.js')
var ZoomMeetingVideoMOD = require('./zoom_meeting_video.js')
var ZoomMeetingShareMOD = require('./zoom_meeting_share.js')
var ZoomMeetingINFOMOD = require('./zoom_meeting_info.js')
var ZoomMeetingH323MOD = require('./zoom_h323.js')


var ZoomMeeting = (function () {
  var instance;
   /**
 * Zoom SDK Meeting Service Init
 * @param {{
 *  addon: zoom sdk module
 *  meetingstatuscb: function, The logincb method specifies a callback method to call on meeting status changed.
 * }} opts
 * @return {ZoomMeeting}
 */
  function init(opts) {
    var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var clientOpts = opts || {};

    // Private methods and variables
    var _osType = clientOpts.ostype;  
    var _addon
    var _meetingpaymentreminder
    if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _osType)
    {
        _addon = clientOpts.addon || null
        _meetingpaymentreminder = clientOpts.meetingremindercb;
    }else if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS== _osType)
    {
        var MEETINGBRIDGE = require('./mac/meeting_bridge.js');
        _addon = MEETINGBRIDGE.zoomMeetingBridge;
        _meetingpaymentreminder = clientOpts.meetingpaymentreminder;
    }
    var _meetingstatuscb = clientOpts.meetingstatuscb || null
    var _meetinguserjoincb = clientOpts.meetinguserjoincb || null
    var _meetinguserleftcb = clientOpts.meetinguserleftcb || null
    var _meetinghostchangecb = clientOpts.meetinghostchangecb || null
	var _invitebuttonclickedcb = clientOpts.invitebuttonclickedcb || null
    var _isInmeeting = false
    var _lasthostid = 0
    if (_addon){
        _addon.SetMeetingStatusCB(onMeetingStatus)
        _addon.SetMeetingUserJoinCB(onUserJoin)
        _addon.SetMeetingUserLeftCB(onUserLeft)
        _addon.SetMeetingHostChangeCB(onHostChange)
        
        if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _osType)
        {
            _addon.SetPaymentReminderCB(onPaymentReminder)
		    _addon.SetInviteButtonClickedCB(onInviteButtonClicked)
        }
    }
    if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS== _osType)
    {
       _addon.SetPaymentReminderCB(onPaymentReminder)
    }
    var userlist = new Map();

    function UpdateHostId(newid, oldid) {
        var newhost = userlist.get(newid)
        if (newhost === undefined)
            return
        newhost.ishost = 'true'

        _lasthostid = newid

        var oldhost = userlist.get(oldid)
        if (oldhost === undefined)
            return
        oldhost.ishost = 'false'
    }
    function onHostChange(userid) {
        if (_lasthostid == userid)
            return
        UpdateHostId(userid, _lasthostid)
        if (_meetinghostchangecb)
            _meetinghostchangecb(userid)
    }

	function onInviteButtonClicked(bHandled) {
		if (null != _invitebuttonclickedcb){
			var handleobj = new Object()
			handleobj.bHandled = false
			_invitebuttonclickedcb(handleobj)
			return handleobj.bHandled
		}		
	}
    function onMeetingStatus(status, errorcode) {
        if (ZoomMeetingStatus.MEETING_STATUS_INMEETING == status
        || ZoomMeetingStatus.MEETING_STATUS_LOCKED == status
        || ZoomMeetingStatus.MEETING_STATUS_UNLOCKED == status){
            _isInmeeting = true
            if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _osType)
            {
              var zoomSDK = require('./mac/zoomsdk_bridge.js')
              zoomSDK.zoomSDKBridge.InitMeetingComponent()
            }
        } else if(ZoomMeetingStatus.MEETING_STATUS_ENDED == status || ZoomMeetingStatus.MEETING_STATUS_DISCONNECTING == status || ZoomMeetingStatus.MEETING_STATUS_RECONNECTING == status){
            _isInmeeting = false
            userlist.clear()
        } else {
            _isInmeeting = false
        }
        if (null != _meetingstatuscb)
            _meetingstatuscb(status, errorcode)
    }

    function onUserJoin(userinfolist) {
        if (typeof userinfolist === 'string')
            var userarray = JSON.parse(userinfolist);
        else
			var userarray = userinfolist;
		
        userarray.userlist.forEach(function (item, index) {
            var useritem = new Object();
            useritem.userid = parseInt(item.userid, 10)
            useritem.username = item.username
            useritem.isme = item.isme
            useritem.ishost = item.ishost
            if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS== _osType)
            {
                if (useritem.ishost === true)
                {
                    _lasthostid = useritem.userid
                }
            }
            else
            {
                if (useritem.ishost === 'true')
                    _lasthostid = useritem.userid
            }
            useritem.audiostatus = ZoomMeetingAudioMOD.ZoomMeetingAudioStatus.Audio_None
            useritem.videostatus = ZoomMeetingVideoMOD.ZoomMeetingVideoStatus.Video_OFF
            
            if(!userlist.has(useritem.userid))
                userlist.set(useritem.userid, useritem)
            if (null != _meetinguserjoincb){
                _meetinguserjoincb(useritem)
			}
        });
    }

		
    function onUserLeft(userinfolist, nouse) {
    	if (typeof userinfolist === 'string')
			var userarray = JSON.parse(userinfolist);
		else
			var userarray = userinfolist;		
        userarray.userlist.forEach(function (item, index) {
            var userid = parseInt(item.userid, 10)
            userlist.delete(userid)
            if (null != _meetinguserleftcb){
                _meetinguserleftcb(userid)
            }
        });
    }


   //
   /* note:this callback be called when u set MeetingConfig_DisableFreeUserOriginAction = 1
   */
    function onPaymentReminder(reminder){
        _meetingpaymentreminder(reminder);
    }

    return {
 
      // Public methods and variables
      /** Start meeting
        * @param {{
        *  meetingnum: Number, A number to the meeting to be started.
        *  directshareappwndhandle: Number, Windows handle of which window you want to share directly
        *  participantid: String, ID for meeting participant report list, need web backend enable.
        *  isvideooff: boolean
        *  isaudiooff: boolean
        *  isdirectsharedesktop: boolean
        * }} opts
        * @return {ZoomSDKError}
        */
       StartMeeting: function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var meetingnum = clientOpts.meetingnum || 0
                var directshareappwndhandle = clientOpts.directshareappwndhandle || 0
                var participantid = clientOpts.participantid || ''
                var isvideooff = (clientOpts.isvideooff === undefined) ? false : clientOpts.isvideooff
                var isaudiooff = (clientOpts.isaudiooff === undefined) ? false : clientOpts.isaudiooff
                var isdirectsharedesktop = (clientOpts.isdirectsharedesktop === undefined) ? false : clientOpts.isdirectsharedesktop

                return _addon.StartMeeting(meetingnum, directshareappwndhandle, participantid, isvideooff, isaudiooff, isdirectsharedesktop)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Start meeting without login
        * @param {{
        *  userid: String, user id. From Rest API
        *  usertoken: String, user token. From Rest API
        *  username: String
        *  meetingnumber: Number, A number to the meeting to be started.
        *  directshareappwndhandle: Number, Windows handle of which window you want to share directly
        *  participantid: String, ID for meeting participant report list, need web backend enable.
        *  isdirectsharedesktop: boolean
        *  zoomaccesstoekn: zoom access token
        * }} opts
        * @return {ZoomSDKError}
        */
       StartMeetingWithOutLogin: function (opts) {
           if (_addon) {
               var clientOpts = opts || {}
               var userid = clientOpts.userid || ''
               var usertoken = clientOpts.usertoken || ''
               var username = clientOpts.username || ''
               var meetingnumber = clientOpts.meetingnumber || 0
               var directshareappwndhandle = clientOpts.directshareappwndhandle || 0
               var participantid = clientOpts.participantid || ''
               var isdirectsharedesktop = (clientOpts.isdirectsharedesktop === undefined) ? false : clientOpts.isdirectsharedesktop
               var zoomaccesstoekn = clientOpts.zoomaccesstoekn || 'null'
               var zoomusertype = clientOpts.zoomusertype || ZoomUserType.ZoomUserType_APIUSER
			   if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _osType)	
               {
				   return _addon.StartMeeting_APIUSER(userid, usertoken, username, meetingnumber,
                 directshareappwndhandle, participantid, isdirectsharedesktop, zoomaccesstoekn, zoomusertype)
			   }
			   else if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _osType)
			   {
				   return _addon.StartMeeting_APIUSER(userid, usertoken, username, meetingnumber,
			     directshareappwndhandle, participantid, isdirectsharedesktop)
			   }
           }

           return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
       },

      /** Join meeting
        * @param {{
        *  meetingnum: Number, A number to the meeting to be joined.
        *  username: String, 
        *  psw: String, Meeting password
        *  directshareappwndhandle: Number, Windows handle of which window you want to share directly
        *  participantid: String, ID for meeting participant report list, need web backend enable.
        *  webinartoken: String, webinar token
        *  isvideooff: boolean
        *  isaudiooff: boolean
        *  isdirectsharedesktop: boolean
        * }} opts
        * @return {ZoomSDKError}
        */
        JoinMeeting: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var meetingnum = clientOpts.meetingnum || 0
                var username = clientOpts.username || ''
                var psw = clientOpts.psw || ''
                var directshareappwndhandle = clientOpts.directshareappwndhandle || 0
                var participantid = clientOpts.participantid || ''
                var webinartoken = clientOpts.webinartoken || ''
                var isvideooff = (clientOpts.isvideooff === undefined) ? false : clientOpts.isvideooff
                var isaudiooff = (clientOpts.isaudiooff === undefined) ? false : clientOpts.isaudiooff
                var isdirectsharedesktop = (clientOpts.isdirectsharedesktop === undefined) ? false : clientOpts.isdirectsharedesktop

                return _addon.JoinMeeting(meetingnum, username, psw, directshareappwndhandle, 
                    participantid, webinartoken, isvideooff, isaudiooff, isdirectsharedesktop)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Join meeting withoutlogin
        * @param {{
        *  meetingnum: Number, A number to the meeting to be joined.
        *  username: String, 
        *  psw: String, Meeting password
        *  directshareappwndhandle: Number, Windows handle of which window you want to share directly
        *  toke4enfrocelogin: String, Token of the meeting only for login user
        *  participantid: String, ID for meeting participant report list, need web backend enable.
        *  webinartoken: String, webinar token
        *  isdirectsharedesktop: boolean
        *  isvideooff: boolean
        *  isaudiooff: boolean
        * }} opts
        * @return {ZoomSDKError}
        */
        JoinMeetingWithoutLogin: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var meetingnum = clientOpts.meetingnum || 0
                var username = clientOpts.username || ''
                var psw = clientOpts.psw || ''
                var directshareappwndhandle = clientOpts.directshareappwndhandle || 0
                var toke4enfrocelogin = clientOpts.toke4enfrocelogin || ''
                var participantid = clientOpts.participantid || ''
                var webinartoken = clientOpts.webinartoken || ''
                var isdirectsharedesktop = (clientOpts.isdirectsharedesktop === undefined) ? false : clientOpts.isdirectsharedesktop
                var isvideooff = (clientOpts.isvideooff === undefined) ? false : clientOpts.isvideooff
                var isaudiooff = (clientOpts.isaudiooff === undefined) ? false : clientOpts.isaudiooff

                return _addon.JoinMeeting_APIUSER(meetingnum, username, psw, directshareappwndhandle, toke4enfrocelogin, 
                    participantid, webinartoken, isdirectsharedesktop, isvideooff, isaudiooff)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

      /** Leave meeting
        * @param {{
        *  endMeeting: Boolean,
        * }} opts
        * @return {ZoomSDKError}
        */
        LeaveMeeting: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                var endMeeting = clientOpts.endMeeting || false
                return _addon.LeaveMeeting(endMeeting)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

    /**Lock Meeting
   * @return {ZoomSDKError}
  */
        Lock_Meeting: function () {
            if (_addon) {
                return _addon.Lock_Meeting()
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

     /**Unlock Meeting
    * @return {ZoomSDKError}
    */
        Un_lock_Meeting: function () {
            if (_addon) {
                return _addon.Un_lock_Meeting()
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /**Get Meetin Info
       * @return {ZoomMeetingInfo}
         */
        Getting_GetMeetingInfo: function (opts) {
            if (_addon) {
                var clientOpts = opts || {}
                clientOpts.addon = _addon
                return ZoomMeetingINFOMOD.ZoomMeetingInfo.getInstance(clientOpts)
            }
            return null
        },

            /**Get Share Session ConnQuality
            * @return {MeetingConnQuality}
            */
            Getting_GetSharingConnQuality: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetSharingConnQuality()
                }
                return ""
            },

        /**Get Video Session ConnQuality
         * @return {Video ConnQuality}
         */
            Getting_GetVideoConnQuality: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetVideoConnQuality()
                }
                return ""
            },

        /**Get Audio Session ConnQuality
         * @return {Audio ConnQuality}
         */
            Getting_GetAudioConnQuality: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetAudioConnQuality()
                }
                return ""
            },

        GetUserList :function () {
            return userlist
        },

        GetMeetingUICtrl: function(opts) {
            if (_addon){
                var clientOpts = opts || {}
                clientOpts.ostype = _osType
                clientOpts.addon = _addon
                clientOpts.zoommeeting = instance
                return ZoomMeetingUIMOD.ZoomMeetingUICtrl.getInstance(clientOpts)
            }
        },
        
        GetAnnotationCtrl: function(opts) {
            if (_addon){
                var clientOpts = opts || {}
                clientOpts.ostype = _osType
                clientOpts.addon = _addon
                clientOpts.zoommeeting = instance
                return ZoomAnnotationMOD.ZoomAnnotationCtrl.getInstance(clientOpts)
            }
        },

        GetMeetingConfiguration : function(opts) {
            if (_addon){
                var clientOpts = opts || {}
                clientOpts.addon = _addon
                clientOpts.zoommeeting = instance
                clientOpts.ostype = _osType
                return ZoomMeetingConfigurationMOD.ZoomMeetingConfiguration.getInstance(clientOpts)
            }
        },

        GetMeetingAudio : function(opts) {
           if (_addon){
                var clientOpts = opts || {}
                clientOpts.ostype = _osType
                clientOpts.addon = _addon
                clientOpts.zoommeeting = instance
                return ZoomMeetingAudioMOD.ZoomMeetingAudio.getInstance(clientOpts)
            } 
        },

        GetMeetingVideo : function(opts) {
           if (_addon){
                var clientOpts = opts || {}
                clientOpts.ostype = _osType
                clientOpts.addon = _addon
                clientOpts.zoommeeting = instance
                return ZoomMeetingVideoMOD.ZoomMeetingVideo.getInstance(clientOpts)
            } 
        },

        GetMeetingShare : function(opts) {
           if (_addon){
                var clientOpts = opts || {}
                clientOpts.ostype = _osType
                clientOpts.addon = _addon
                clientOpts.zoommeeting = instance
                return ZoomMeetingShareMOD.ZoomMeetingShare.getInstance(clientOpts)
            } 
        },

		GetMeetingH323 : function(opts) {
           if (_addon){
                var clientOpts = opts || {}
                clientOpts.ostype = _osType
                clientOpts.addon = _addon
                clientOpts.zoommeeting = instance
                return ZoomMeetingH323MOD.ZoomH323.getInstance(clientOpts)
            }		
		},
         //internal interface
        UpdateAudioStatus: function (userid, status) {
            var useritem = userlist.get(userid)
            if (useritem === undefined)
                return
            
            useritem.audiostatus = status
            userlist.set(userid, useritem)
        },

        UpdateVideoStatus : function(userid, status) {
            var useritem = userlist.get(userid)
            if (useritem === undefined)
                return
            
            useritem.videostatus = status
            userlist.set(userid, useritem)
        },
    };
  };
 
  return {
    /**
     * Get Zoom SDK Meeting Service Module
     * @return {ZoomMeeting}
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
    ZoomMeetingStatus: ZoomMeetingStatus,
    ZoomMeetingFailCode: ZoomMeetingFailCode,
    ZoomAnnotationMOD: ZoomAnnotationMOD,
    ConnectionQuality:ConnectionQuality,
    ZoomMeetingUIViewType: ZoomMeetingUIViewType,
    ZoomMeeting: ZoomMeeting,
	ZoomMeetingH323MOD: ZoomMeetingH323MOD,

}
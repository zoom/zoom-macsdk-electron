var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')

var MeetingType={
    MEETING_TYPE_NONE:0,
	MEETING_TYPE_NORMAL:1,
	MEETING_TYPE_WEBINAR:2,
	MEETING_TYPE_BREAKOUTROOM:3,
 };
 
var ZoomMeetingInfo = (function () {
    var instance;
    /**
  * Zoom SDK Meeting Info module Init
  * @param {{
  *  addon: zoom sdk module
  * }} opts
  * @return {ZoomMeetingInfo}
  */
    function init(opts) {
        var clientOpts = opts || {};
        // Private methods and variables
        var _addon = clientOpts.addon || null
        return {

            /**Get Meeting Number
             * @return {Meeting Number}
             */
            Getting_GetMeetingNumber: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetMeetingNumber()
                }
                return ""
            },

        /**Get Meeting Topic
         * @return {Meeting Topic}
         */
            Getting_GetMeetingTopic: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetMeetingTopic()
                }
                return ""
            },

         /**Get Meeting ID
         * @return {Meeting ID}
         */
            Getting_GetMeetingID: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetMeetingID()
                }
                return ""
            },

            /**Get Meeting Type
            * @return {Meeting Type}
            */
            Getting_GetMeetingType: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetMeetingType()
                }
                return ""
            },

            /** Get Invite Email Teamplate
            * @return { Invite Email Teamplate}
            */
            Getting_GetInviteEmailTeamplate: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetInviteEmailTeamplate()
                }
                return ""
            },

            /** Get Invite Email Title
            * @return { Invite Email Title}
            */
            Getting_GetInviteEmailTitle: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetInviteEmailTitle()
                }
                return ""
            },

            /** Get Join Meeting Url
             * @return {Join Meeting Url}
              */
            Getting_GetJoinMeetingUrl: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetJoinMeetingUrl()
                }
                return ""
            },

            /** Get Meeting Host Tag
            * @return {Meeting Host Tag}
            */
            Getting_GetMeetingHostTag: function (opts) {
                if (_addon) {
                    var clientOpts = opts || {}
                    return _addon.Getting_GetMeetingHostTag()
                }
                return ""
            },

            /** Check if Internal Meeting.
            * @return {bool}
            */
            Checking_IsInternalMeeting: function (opts) {
                if (_addon) {
                    return _addon.Checking_IsInternalMeeting()
                }
                return false
            },
        };
    };

    return {
        /**
         * Get Meeting Info Module
         * @return {ZoomMeetingInfo}
        */
        getInstance: function (opts) {

            if (!instance) {
                instance = init(opts)
            }
            return instance
        }
    };
})();

module.exports = {
    ZoomMeetingInfo: ZoomMeetingInfo,
    MeetingType: MeetingType,
}
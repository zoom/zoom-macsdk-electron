var $ = require('/usr/local/lib/node_modules/electron/node_modules/nodobjc');
var ZOOMSDKMOD = require('../zoom_sdk.js')

var meetingConfigObj;
var zoomMeetingConfigBridge = (function(){
return{
  SetMeetingConfigService: function(meetingConfiguration){
     meetingConfigObj  = meetingConfiguration;
  },

  MeetingConfig_SetBottomFloatToolbarWndVisibility: function(show){
    meetingConfigObj('setMainToolBarVisible', show);
    return ZOOMSDKMOD.ZoomSDKError.SDKERR_SUCCESS;
  },

};
})()

module.exports = {
  zoomMeetingConfigBridge: zoomMeetingConfigBridge,
}
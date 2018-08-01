
var ZOOMSDKMOD = require('./../zoom_sdk.js')
var MEETINGBRIDGE = require('./meeting_bridge.js')
var MEETINGACTIONBRIDGE = require('./meeting_action_bridge.js')
var MEETINGCONFIGBRIDGE = require('./meeting_config_bridge.js')
var MEETINGASBRIDGE = require('./meeting_as_bridge.js')
var MEETINGUIBRIDGE = require('./meeting_uicontroller_bridge.js')
var path = require('path');
var $ = require('../../node_modules/nodobjc')
$.import('Cocoa')
$.import('Foundation')
$.import('AppKit')
$.import('StoreKit')
$.import('CoreFoundation')
$.import(path.resolve(__filename,'../../../node_modules/ZoomSDK/util.framework'));
$.import(path.resolve(__filename,'../../../node_modules/ZoomSDK/ZCommonUI.framework'));
$.import(path.resolve(__filename,'../../../node_modules/ZoomSDK/cmmlib.framework'));
$.import(path.resolve(__filename,'../../../node_modules/ZoomSDK/ZoomSDKChatUI.framework'));
$.import(path.resolve(__filename,'../../../node_modules/ZoomSDK/ZoomSDK.framework'));


var zoomSDK = $.ZoomSDK('sharedSDK');
//zoomSDK('initSDK', false);
var authService = zoomSDK('getAuthService');
var authServiceDelegate = $.NSObject.extend('ZoomSDKAuthDelegate');
var meetingServiceDelegate = $.NSObject.extend('ZoomSDKMeetingServiceDelegate');
var meetingActionDelegate = $.NSObject.extend('ZoomSDKMeetingActionControllerDelegate');
var meetingUIControllerDelegate = $.NSObject.extend('ZoomSDKMeetingUIControllerDelegate');
var pool = $.NSAutoreleasePool('alloc')('init');
var authservicedelegate = authServiceDelegate('alloc')('init');
authService('setDelegate', authservicedelegate);
pool('drain')

var zoomSDKBridge = (function(){
return{
   InitSDK: function(path,webdomain,langid,onApiCallResult,_threadsafemode){
        var webdomainStr = $.NSString('stringWithUTF8String', webdomain);
        zoomSDK('setZoomDomain', webdomainStr);
        onApiCallResult('InitSDK', ZOOMSDKMOD.ZoomSDKError.SDKERR_SUCCESS);
        return ZOOMSDKMOD.ZoomSDKError.SDKERR_SUCCESS;
    },

   InitComponent: function(){  
    var meetingService = zoomSDK('getMeetingService');
    MEETINGBRIDGE.zoomMeetingBridge.SetMeetingService(meetingService);
    var pool = $.NSAutoreleasePool('alloc')('init');
    var meetingservicedelegate = meetingServiceDelegate('alloc')('init');
    meetingService('setDelegate', meetingservicedelegate);
         // config
    var meetingConfiguration = meetingService('getMeetingConfiguration');
    MEETINGCONFIGBRIDGE.zoomMeetingConfigBridge.SetMeetingConfigService(meetingConfiguration);
    pool('drain');
  },
  
  InitMeetingComponent: function()
  {
      var meetingService = zoomSDK('getMeetingService');
      var pool = $.NSAutoreleasePool('alloc')('init');
      //action
      var meetingAction = meetingService('getMeetingActionController');
      MEETINGACTIONBRIDGE.zoomMeetingActionBridge.SetMeetingAction(meetingAction);
      var meetingactiondelegate = meetingActionDelegate('alloc')('init');
      meetingAction('setDelegate', meetingactiondelegate);
     //as
      var meetingAS = meetingService('getASController')
      if(undefined != meetingAS)
      {  
        MEETINGASBRIDGE.zoomMeetingASBridge.SetMeetingAS(meetingAS)
        var meetingAnnotation = meetingAS('getAnnotationController')
        MEETINGASBRIDGE.zoomMeetingASBridge.SetMeetingAnnotation(meetingAnnotation)
      }
     //meetingui
     var meetingUI = meetingService('getMeetingUIController')
     if(undefined != meetingUI)
     {
      MEETINGUIBRIDGE.zoomMeetingUIController.SetMeetingUIController(meetingUI)
     }
     var meetinguicontrollerdelegate = meetingUIControllerDelegate('alloc')('init')
     meetingUI('setDelegate', meetinguicontrollerdelegate);
     pool('drain');
  },
 }
})()

module.exports = 
{
  zoomSDKBridge: zoomSDKBridge,
  zoomSDK:zoomSDK,
  authService: authService,
  authServiceDelegate: authServiceDelegate,
  meetingServiceDelegate: meetingServiceDelegate, 
  meetingActionDelegate: meetingActionDelegate,
  meetingUIControllerDelegate: meetingUIControllerDelegate,
}
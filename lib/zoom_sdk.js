
var ZOOM_TYPE_OS_TYPE = {
    WIN_OS:0,
    MAC_OS:1,
}
var ZoomSDK_LANGUAGE_ID = {
	LANGUAGE_Unknow:0,
	LANGUAGE_English:1,
	LANGUAGE_Chinese_Simplified:2,
	LANGUAGE_Chinese_Traditional:3,
	LANGUAGE_Japanese:4,
	LANGUAGE_Spanish:5,
	LANGUAGE_German:6,
    LANGUAGE_French:7,
    LANGUAGE_Italian:8,
	LANGUAGE_Portuguese:9,
	LANGUAGE_Russian:10,
};

var ZoomSDKError = {
	SDKERR_SUCCESS:0,///< Success Result
	SDKERR_NO_IMPL:1,///< Not support this feature now 
	SDKERR_WRONG_USEAGE:2,///< Wrong useage about this feature 
	SDKERR_INVALID_PARAMETER:3,///< Wrong parameter 
	SDKERR_MODULE_LOAD_FAILED:4,///< Load module failed 
	SDKERR_MEMORY_FAILED:5,///< No memory allocated 
	SDKERR_SERVICE_FAILED:6,///< Internal service error 
	SDKERR_UNINITIALIZE:7,///< Not initialize before use 
	SDKERR_UNAUTHENTICATION:8,///< Not Authentication before use
	SDKERR_NORECORDINGINPROCESS:9,///< No recording in process
	SDKERR_TRANSCODER_NOFOUND:10,///< can't find transcoder module
	SDKERR_VIDEO_NOTREADY:11,///< Video service not ready
	SDKERR_NO_PERMISSION:12,///< No premission to do this
	SDKERR_UNKNOWN:13,///< Unknown error 
	SDKERR_OTHER_SDK_INSTANCE_RUNNING:14,
};

var ZoomSDKUIHOOKHWNDTYPE = {
	UIHOOKWNDTYPE_USERDEFIEND:0,
	UIHOOKWNDTYPE_MAINWND:1,
	UIHOOKWNDTYPE_BOTTOMTOOLBAR:2,
};

var ZoomSDKUIHOOKMSGID = {
    WM_CREATE:0x0001,
    WM_DESTROY:0x0002,
};


var ZOOMAUTHMOD = require('./zoom_auth.js')
var ZOOMMEETINGMOD = require('./zoom_meeting.js')
var ZOOMSETTINGMOD = require('./zoom_setting.js')

var ZoomSDK = (function () {
  var instance;
 /**
 * Zoom SDK JS Module Loader  
 * @param {{
 *  ostype: ZOOM_TYPE_OS_TYPE,
 *  apicallretcb: function, The apicallretcb method specifies a callback method to call on API call return.Only take effect when threadsafemode is 1.
 *  threadsafemode: 1 or 0
 *  path: String, zoom.node path on win os, todo: mac os.
 * }} opts
 * @return {ZoomSDK}
 */
  function init(opts) {
    // Private methods and variables
    var clientOpts = opts || {};
    var addon
    var _osType = clientOpts.ostype || ZOOM_TYPE_OS_TYPE.WIN_OS
    var _apicallresultCB = clientOpts.apicallretcb || null
    var _threadsafemode = clientOpts.threadsafemode || 1
    if (ZOOM_TYPE_OS_TYPE.WIN_OS == _osType){
        var _path = clientOpts.path || './windows/bin/'
        var zoomnodepath = _path + 'zoomsdk.node'
		addon = require(zoomnodepath)
    } else if (ZOOM_TYPE_OS_TYPE.MAC_OS == _osType){
        var _path = clientOpts.path || './mac/'
        var zoomsdkpath = _path + 'zoomsdk_bridge.js'
        var zoomsdk = require(zoomsdkpath)
        var addon = zoomsdk.zoomSDKBridge
    }

    var _isSDKInitialized = false

    function onApiCallResult(apiname, ret){
        if ('InitSDK' == apiname){
            if (ZoomSDKError.SDKERR_SUCCESS == ret){
                _isSDKInitialized = true
            } else {
                _isSDKInitialized = false
            }  
        } 

        if (null != _apicallresultCB)
            _apicallresultCB(apiname, ret)
    }

    return {
      // Public methods and variables
        /**
         * Zoom SDK Init
         * @param {{
         *  path: String, sdk.dll path on win os, todo: mac os.
         *  webdomain: String,
         *  langid: ZoomSDK_LANGUAGE_ID
         * }} opts
         * @return {ZoomSDKError}
         */
        InitSDK : function (opts) {
            var clientOpts=opts || {}
            var path= clientOpts.path || '' 
            var webdomain=clientOpts.webdomain || 'https://www.zoom.us' 
            var langid=clientOpts.langid || ZoomSDK_LANGUAGE_ID.LANGUAGE_English
            var ret = addon.InitSDK(path,webdomain,langid,onApiCallResult,_threadsafemode)
            if (0 == _threadsafemode) {
                if (ZoomSDKError.SDKERR_SUCCESS == ret){
                    _isSDKInitialized = true
                } else {
                    _isSDKInitialized = false
                }  
            }

            return ret
        },
        /**
         * Zoom SDK Cleanup
         * @return {ZoomSDKError}
         */
        CleanupSDK: function () {
            return addon.CleanupSDK()
        },

       /**
        * Get Zoom SDK Auth Service Module
        * @return {ZoomAuth}
       */
       GetAuth : function (opts){
           if (_isSDKInitialized){
                var clientOpts = opts || {}
                clientOpts.addon = addon
                clientOpts.ostype = _osType
                return ZOOMAUTHMOD.ZoomAuth.getInstance(clientOpts)
           }

           return null
       },

       /**
        * Get Zoom SDK Meeting Service Module
        * @return {ZoomMeeting}
       */
       GetMeeting : function (opts){
           if (_isSDKInitialized){
                var clientOpts = opts || {}
                clientOpts.addon = addon
                clientOpts.ostype = _osType
                return ZOOMMEETINGMOD.ZoomMeeting.getInstance(clientOpts)
           }
           
           return null
       },

       /**
        * Get Zoom SDK Meeting Setting Module
        * @return {ZoomSetting}
       */
       GetSetting : function (opts) {
            if (_isSDKInitialized){
                var clientOpts = opts || {}
                clientOpts.addon = addon
                clientOpts.ostype = _osType
                return ZOOMSETTINGMOD.ZoomSetting.getInstance(clientOpts)
        }
        
        return null
       },

       /**
        * Start to monitor the UI action, windows os only.
        * uiacitonCB: function, such as function uiacitoncb(ZoomSDKUIHOOKHWNDTYPE, ZoomSDKUIHOOKMSGID, HANDLE)
        */
        StartMonitorUIAction : function (opts){
            if (_isSDKInitialized){
                var clientOpts=opts || {}
                var uiacitonCB = clientOpts.uiacitonCB || null
                addon.UIHOOK_StartMonitorUIAction(uiacitonCB)
            }
        },

         /**
        * Stop to monitor the UI action, windows os only.
        */
        StopMonitorUIAction : function (){
            if (_isSDKInitialized){
                addon.UIHOOK_StopMonitorUIAction()
            }
        },
    };
 
  };
 
  return {
    /**
     * Get Zoom SDK Module
     * @return {ZoomSDK}
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
  ZoomSDKError: ZoomSDKError,
  ZoomSDK_LANGUAGE_ID: ZoomSDK_LANGUAGE_ID,
  ZOOMAUTHMOD: ZOOMAUTHMOD,
  ZOOMMEETINGMOD: ZOOMMEETINGMOD,
  ZOOM_TYPE_OS_TYPE: ZOOM_TYPE_OS_TYPE,
  ZOOMSETTINGMOD: ZOOMSETTINGMOD,
  ZoomSDK: ZoomSDK,
}
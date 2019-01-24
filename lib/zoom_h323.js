var ZoomH323deviceType = {
	H323DeviceType_Unknown:0,///<Unknown device, only for initialization.
	H323DeviceType_H323:1,///<H.323 device.
	H323DeviceType_SIP:2,///<SIP device.
	H323DeviceType_BOTH:3,///<H.323 device and SIP device.
};
var ZoomH323CalloutStatus = {
	H323Callout_Unknown:0, ///<Used only for initialization.
	H323Callout_Success:1,///<Call successfully.
	H323Callout_Ring:2,   ///<Bell during the call.
	H323Callout_Timeout:3, ///<Call timeout.
	H323Callout_Failed:4, ///<Call fails.
}
//var ZOOMSDKMOD_4AUTH = require('./zoom_sdk.js')

var ZoomH323 = (function () {
  var instance;

  /**
 * Zoom SDK H323 Service Init
 * @param {{
 *  calloutstatuscb: function, The calloutstatuscb method specifies a callback method to call on H323 callout request return.
 * }} opts
 * @return {ZoomH323}
 */
  function init(opts) {
	var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var clientOpts = opts || {};
    // Private methods and variables
    var _osType = clientOpts.ostype
    var _addon
    if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _osType)
    {
        _addon = clientOpts.addon || null
    }else if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _osType)
    {
        //var H323BRIDGE = require('./mac/H323_bridge.js');
        //_addon = H323BRIDGE.ZoomAuthBJ
    }
    var _calloutstatuscb = clientOpts.calloutstatuscb || null

    if (_addon){
		
		_addon.SetH323CallOutStatusCB(onH323CalloutStatusNotify)
		
		if (ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _osType)
		{
			//_addon.SetH323CallOutStatusCB(onH323CalloutStatusNotify)
		}		
    }

	var _h323Callinlist = new Array();
    function ParseDeviceList(_h323Callinlist, str) {
        var devicearray = JSON.parse(str);
        devicearray.h323addresslist.forEach(function (item, index) {
            var deviceItem = new Object();
            deviceItem.telnumber = item.telnumber
            _h323Callinlist.push(deviceItem)
        });
	}
    
	var _calloutlist = new Array();
    function ParseCalloutList(_calloutlist, str) {
        var devicearray = JSON.parse(str);
        devicearray.h323calloutlist.forEach(function (item, index) {
            var deviceItem = new Object();
            deviceItem.h323devicename = item.h323devicename
            deviceItem.h323deviceip = item.h323deviceip
            deviceItem.h323devicee164name = item.h323devicee164name
			deviceItem.h323devicetype = item.h323devicetype
            _calloutlist.push(deviceItem)
        });
	}	
    function onH323CalloutStatusNotify(result) {
		if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS == _osType)
		{
		  // var ZOOMSDKBRIDGE = require('./mac/zoomsdk_bridge.js')
		  // ZOOMSDKBRIDGE.zoomSDKBridge.InitComponent();
		}

        if (null != _calloutstatuscb)
            _calloutstatuscb(result)
    }

 
    return {
 
     /**
     * Get H3232 callin number list
     * @return {Array H323 callin number list}
     */

        H323_GetH323Address: function (){
         _h323Callinlist = []
      	if (_addon) {
            var devicelist_str = _addon.H323_GetH323Address()
            ParseDeviceList(_h323Callinlist, devicelist_str)
      	}
       
      	return _h323Callinlist
        },

     /**
     * Get H323 Password
     * @return {H323 password}
     */
        H323_GetH323Password: function (){
            if (_addon)
                return _addon.H323_GetH323Password()
            
            return "";
        },

     /**
     * Get Callout H323 Device List
     * @return {Array H323 callout device list}
     */
        H323_GetCalloutH323DeviceList: function (){
			_h323CallOutlist = []
            if (_addon)
			{
				var devicelist_str = _addon.H323_GetCalloutH323DeviceList()
                ParseCalloutList(_h323CallOutlist, devicelist_str)
            }
            return _h323CallOutlist;
        },

     /**
     * H323 CallOut
	 * @param {{
        *  deviceName: string,
		*  deviceIP: string,
		*  deviceE164Num: string
		*  deviceType: number，
        * }} opts
     * @return {ZoomSDKError}
     */
        H323_CallOutH323: function (opts){
            if (_addon)
			{
				var clientOpts = opts || {}
                var devicename = clientOpts.devicename || ''
                var deviceip = clientOpts.deviceip || ''
                var e164num = clientOpts.e164num || ''
				var devicetype = clientOpts.devicetype || 0
                return _addon.H323_CallOutH323(devicename, deviceip, e164num, devicetype)
			}
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },
		
	 /**
     * Cancel H323 CallOut
     * @return {ZoomSDKError}
     */
        H323_CancelCallOutH323: function (){
            if (_addon)
			{
				return _addon.H323_CancelCallOutH323()
            }
            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE;
        },
		
    };
 
  };
 
  return {
    /**
     * Get Zoom SDK H323 Service Module
     * @return {ZoomH323}
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
  ZoomH323deviceType:ZoomH323deviceType,
  ZoomH323: ZoomH323,
}

var ZOOMSDKMOD = require('./../zoom_sdk.js')
var ZOOMAUTHMOD = require('./../zoom_auth.js')

var $ = require('../../node_modules/nodobjc');
var ZOOMSDK = require('./zoomsdk_bridge.js')
var authService = ZOOMSDK.authService

var ZoomAuthBJ = (function () {
    return{
    SetAuthCB: function(onAuthResult)
    {
        var zoomAuthReturn = ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_NONE;
        var zoomSDKAuthDelegate = ZOOMSDK.authServiceDelegate;
        zoomSDKAuthDelegate.addMethod('onZoomSDKAuthReturn:', 'v@:@', function (self, _cmd, returnValue) {
            console.log('auth call back to bridge');
            if(returnValue == 0)
                zoomAuthReturn = ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_SUCCESS;//success
            else if(returnValue == 3023)
                zoomAuthReturn = ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_KEYORSECRETWRONG;//key or secret wrong
            else if(returnValue == 3024)
                zoomAuthReturn = ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_ACCOUNTNOTSUPPORT;//account not support
            else if(returnValue == 3025)
                zoomAuthReturn = ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_ACCOUNTNOTENABLESDK;//account not enable SDK
            else
                zoomAuthReturn = ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_UNKNOWN;
            onAuthResult(zoomAuthReturn);
        })
            zoomSDKAuthDelegate.register();
    },

    SetLoginCB: function(onLoginResult)
    {
        var zoomLoginReturn = ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_IDLE;
            var zoomSDKAuthDelegate = ZOOMSDK.authServiceDelegate;
            zoomSDKAuthDelegate.addMethod('onZoomSDKLogin:failReason:', 'v@:@@', function (self, _cmd, loginStatus, failReason) {
                if(loginStatus == 0)
                    zoomLoginReturn = ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_IDLE;
                else if(loginStatus == 1)
                    zoomLoginReturn = ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_SUCCESS;
                else if(loginStatus == 2)
                    zoomLoginReturn = ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_FAILED;
                else if(loginStatus == 3)
                    zoomLoginReturn = ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_PROCESSING;
               onLoginResult(zoomLoginReturn);
            })
    },
    SetLogoutCB: function(onLogOutResult){
            var zoomSDKAuthDelegate = ZOOMSDK.authServiceDelegate;
            zoomSDKAuthDelegate.addMethod('onZoomSDKLogout:', 'v@:', function (self, _cmd) {
                onLogOutResult();
            })
    },
    SDKAuth: function(appkey, appsecret){
            var appkeystring = $.NSString('stringWithUTF8String', appkey);
            var appsecretstring = $.NSString('stringWithUTF8String', appsecret);
            var authresult = authService('sdkAuth', appkeystring, 'appSecret', appsecretstring);
            return authresult;
    },
    Login: function(username, psw, rememberme){
            var user = $.NSString('stringWithUTF8String',username);
            var password = $.NSString('stringWithUTF8String',psw);
            var loginresult = authService('login', user, 'Password', password, 'RememberMe', rememberme);
            return loginresult;
    },
    LoginWithSSOToken: function(ssotoken){
            var ssotokenstring = $.NSString('stringWithUTF8String',ssotoken);
            var ssologinresult = authService('loginSSO', ssotokenstring);
            return ssologinresult;
    },
    Logout: function(){
            var logoutresult = authService('logout');
            return logoutresult;
    },
  }
})();

module.exports = 
{
  ZoomAuthBJ: ZoomAuthBJ,
}
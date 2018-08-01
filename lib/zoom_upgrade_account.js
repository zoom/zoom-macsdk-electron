var MeetingReminderType = {
  MeetingReminderType_CanFreeTrial:0, // host
  MeetingReminderType_CanUpgradeAccount:1, //host
  MeetingReminderType_GuestReminder:2, //guest
  MeetingReminderType_UpgradeSuccess:3,
  MeetingReminderType_UpgradeFailed:4,
  MeetingReminderType_None:5,
};

var ZoomPaymentReminder = (function () {
     /**
   * Zoom SDK Payment Reminder Init
   * @param {{
   *  addon: zoom sdk module
   * }} opts
   * @return {ZoomPaymentReminder}
   */
    function init(opts) {
   
      var clientOpts = opts || {};
      var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js');
      // Private methods and variables
      var _addon;
      var _osType = clientOpts.ostype;  
      if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _osType)
        _addon = clientOpts.addon || null
      else(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.MAC_OS== _osType)
      {
        var UPGRADEACCOUNTBRIDGE = require('./mac/meeting_upgrade_accont_bridge.js');
        _addon = UPGRADEACCOUNTBRIDGE.zoomMeetingUpgradeAccountBridge;
      }
      
      return {
        GetMeetingReminderType: function(){
          if(_addon)
            return _addon.getReminderType();
          return MeetingReminderType_None;
        },
        
        UpgradeAccountFreeTrial: function(){
          if(_addon)
            return _addon.upgradeAccountFreeTrial();
          return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE;
        },

        UpgradeAccount:function(){
          if(_addon)
            return _addon.upgradeAccount();
          return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE;
        }
    }

  };
  return {
    /**
     * Get Zoom SDK Payment Reminder
     * @return {ZoomPaymentReminder}
    */
    createUpgradeAccountHelper: function (opts) {
      return init(opts);
      
    }
  }
 })();
  
  module.exports = {
    ZoomPaymentReminder: ZoomPaymentReminder,
    MeetingReminderType: MeetingReminderType,
  }
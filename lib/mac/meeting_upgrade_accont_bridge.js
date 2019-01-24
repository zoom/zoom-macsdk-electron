var $ = require('../../node_modules/nodobjc');
var ZOOMSDKUPGRADEACCOUNTMOD = require('../zoom_upgrade_account.js')

var meetingUpgradeAccountObj;
var zoomMeetingUpgradeAccountBridge = (function(){
return{
  SetMeetingUpgradeAccountHelper: function(meetingUpgradeAccount){
    meetingUpgradeAccountObj  = meetingUpgradeAccount;
  },

  getReminderType: function(){
    var remindertype =  meetingUpgradeAccountObj('getReminderType');
    var meetingReminderType = ZOOMSDKUPGRADEACCOUNTMOD.MeetingReminderType.MeetingReminderType_None;
    if(remindertype == 0)
      meetingReminderType =  ZOOMSDKUPGRADEACCOUNTMOD.MeetingReminderType.MeetingReminderType_CanFreeTrial;
    else if(remindertype == 1)
      meetingReminderType =  ZOOMSDKUPGRADEACCOUNTMOD.MeetingReminderType.MeetingReminderType_CanUpgradeAccount; 
    else if(remindertype == 2)
      meetingReminderType = ZOOMSDKUPGRADEACCOUNTMOD.MeetingReminderType.MeetingReminderType_GuestReminder;
    else if(remindertype == 3)
      meetingReminderType = ZOOMSDKUPGRADEACCOUNTMOD.MeetingReminderType.MeetingReminderType_UpgradeSuccess;
    else if(remindertype == 4)
      meetingReminderType = ZOOMSDKUPGRADEACCOUNTMOD.MeetingReminderType.MeetingReminderType_UpgradeFailed;
    else if(remindertype == 5)
      meetingReminderType = ZOOMSDKUPGRADEACCOUNTMOD.MeetingReminderType.MeetingReminderType_None;
    return meetingReminderType;
  },

  upgradeAccountFreeTrial: function(){
    return meetingUpgradeAccountObj(upgradeAccountFreeTrial);
  },

  upgradeAccount: function(){
    return meetingUpgradeAccountObj(upgradeAccount);
  }
 };
})()

module.exports = {
  zoomMeetingUpgradeAccountBridge: zoomMeetingUpgradeAccountBridge,
}
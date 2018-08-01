var $ = require('../../node_modules/nodobjc');

var meetingASObj;
var meetingAnnotationObj;
var zoomMeetingASBridge = (function(){

var ZOOMMEETINGMOD = require('./../zoom_meeting.js')
return{
     
     SetMeetingAS: function(meetingAS){
     meetingASObj  = meetingAS;
  },

  SetMeetingAnnotation: function(meetingAnnotation)
  {
    meetingAnnotationObj = meetingAnnotation
  },
    
     MeetingShare_StartAppShare: function(apphandle){
     var ret = meetingASObj('startAppShare',apphandle)
     return ret
    },
    
    MeetingShare_StartMonitorShare: function(monitorid){
     var ret = meetingASObj('startMonitorShare',monitorid)
     return ret
    },
    
    MeetingShare_StopShare: function(){
      var ret = meetingASObj('stopShare')
      return ret
    },
   // annotation
   Annotaion_IsAnnotaionDisable: function(){
     var ret = meetingAnnotationObj('isAnnotationDisable')
     return ret;
   },

   Annotaion_StartAnnotation: function(viewtype, left, top)
   {
      var point = $.NSMakePoint(left, top)
      var ret = meetingASObj('startAnnotation', point,'onScreen',viewtype)
      return ret
   },
   
   Annotaion_StopAnnotation: function(viewtype)
   {
     var ret = meetingASObj('stopAnnotation', viewtype)
     return ret
   },
   
   Annotaion_SetTool: function(viewtype, type){
     var ret = meetingAnnotationObj('setTool',type, 'onScreen', viewtype)
     return ret
   },
  
  Annotaion_Clear: function(viewtype, type){
    var ret = meetingAnnotationObj('clear', type, 'onScreen', viewtype)
    return ret
  },
   
  //need check with windows the color 
  /*Annotaion_SetColor: function(viewtype, color){
    var ret = meetingAnnotationObj()
    return ret 
  }*/
  
  Annotaion_SetLineWidth:function(viewtype, lineWidth)
  {
     var ret = meetingAnnotationObj('setLineWidth', lineWidth, 'onScreen', viewtype)
     return ret 
  },

  Annotaion_Undo:function(viewtype){
    var ret = meetingAnnotationObj('undo', viewtype)
    return ret 
  },

  Annotaion_Redo: function(viewtype){
    var ret = meetingAnnotationObj('redo', viewtype)
    return ret 
  }
}
})()

module.exports = 
{
  zoomMeetingASBridge: zoomMeetingASBridge,
}
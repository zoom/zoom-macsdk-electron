var ZoomAnnotationToolType = {
	ANNOTOOL_NONE_DRAWING               :0,///<switch to mouse 
	ANNOTOOL_PEN                        :1,
	ANNOTOOL_HIGHLIGHTER                :2,
	ANNOTOOL_AUTO_LINE                  :3,
	ANNOTOOL_AUTO_RECTANGLE             :4,
	ANNOTOOL_AUTO_ELLIPSE               :5,
	ANNOTOOL_AUTO_ARROW                 :6,
	ANNOTOOL_AUTO_RECTANGLE_FILL        :7,
	ANNOTOOL_AUTO_ELLIPSE_FILL          :8,
	ANNOTOOL_SPOTLIGHT                  :9,
	ANNOTOOL_ARROW                      :10,
	ANNOTOOL_ERASER                     :11,///<earser
};

var ZoomAnnotationClearType = {
    ANNOCLEAR_ALL       :0,
	ANNOCLEAR_SELF      :1,
    ANNOCLEAR_OTHER     :2,
};

//var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')

var ZoomAnnotationCtrl = (function () {
  var instance;
   /**
 * Zoom SDK Annotation Controller Init
 * @param {{
 *  addon: zoom sdk module
 * }} opts
 * @return {ZoomAnnotationCtrl}
 */
  function init(opts) {
    var ZOOMSDKMOD_4MEET = require('./zoom_sdk.js')
    var ZOOMSDKMEETIGNMODE = require('./zoom_meeting.js')
    var clientOpts = opts || {};
    var _ostype = clientOpts._ostype;
    // Private methods and variables
    var _addon
    if(ZOOMSDKMOD_4MEET.ZOOM_TYPE_OS_TYPE.WIN_OS == _ostype)
       _addon = clientOpts.addon || null
    else{
        var MEETINGASBRIDGE = require('./mac/meeting_as_bridge.js')
        _addon = MEETINGASBRIDGE.zoomMeetingASBridge
    }
    return {
 
      // Public methods and variables
      /** Check if Annotation is disable.
        * @return {bool}
        */
       Annotaion_IsAnnotaionDisable: function (opts) {
            if (_addon){
                return _addon.Annotaion_IsAnnotaionDisable()
            }

            return false
        },

        /** Start annotation.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_StartAnnotation : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                var left = clientOpts.left
                var top = clientOpts.top
                return _addon.Annotaion_StartAnnotation(viewtype, left, top)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Stop annotation.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_StopAnnotation : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                return _addon.Annotaion_StopAnnotation(viewtype)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Stop annotation.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        *  type: the tool type of annotation, define at ZoomAnnotationToolType
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_SetTool : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                var type = clientOpts.type || ZoomAnnotationToolType.ANNOTOOL_NONE_DRAWING
                return _addon.Annotaion_SetTool(viewtype, type)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },
        
        /** Clear annotation.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        *  type: the clear type of annotation, define at ZoomAnnotationClearType
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_Clear : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                var type = clientOpts.type || ZoomAnnotationClearType.ANNOCLEAR_ALL
                return _addon.Annotaion_Clear(viewtype, type)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Set annotation color.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        *  color: the color of annotation
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_SetColor : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                var color = clientOpts.color
                return _addon.Annotaion_SetColor(viewtype, color)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Set line width of annotation.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        *  lineWidth: the line width of annotation
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_SetLineWidth : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                var lineWidth = clientOpts.lineWidth
                return _addon.Annotaion_SetLineWidth(viewtype, lineWidth)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Undo annotation.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_Undo : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                return _addon.Annotaion_Undo(viewtype)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },

        /** Redo annotation.
        * @param {{
        *  viewtype: the view type of which monitor, define at ZoomMeetingUIViewType
        * }} opts
        * @return {ZoomSDKError}
        */
        Annotaion_Redo : function (opts) {
            if (_addon){
                var clientOpts = opts || {}
                var viewtype = clientOpts.viewtype || ZOOMSDKMEETIGNMODE.ZoomMeetingUIViewType.MEETINGUI_FIRST_MONITOR
                return _addon.Annotaion_Redo(viewtype)
            }

            return ZOOMSDKMOD_4MEET.ZoomSDKError.SDKERR_UNINITIALIZE
        },
    };
 
  };
 
  return {
    /**
     * Get Zoom SDK Annotation Service Module
     * @return {ZoomAnnotationCtrl}
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
    ZoomAnnotationToolType: ZoomAnnotationToolType,
    ZoomAnnotationClearType: ZoomAnnotationClearType,
    ZoomAnnotationCtrl: ZoomAnnotationCtrl
}
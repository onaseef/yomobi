// 
// BUILDER
// 
(function ($) {
  
  widgetClasses.gmap = widgetClasses.gmap.extend({
    
    onHomeViewClick: function () {
      bapp.homeViewWidgetClick(this)
      return false;
    },

    getEditData: function () {
      var extraData = {
        validForShowing: this.validForShowing()
      };
      return _.extend({},this.toJSON(),extraData);
    },
    
  });
  
})(jQuery);

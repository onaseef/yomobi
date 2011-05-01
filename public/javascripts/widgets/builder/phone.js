(function ($) {
  
  widgetClasses.phone = widgetClasses.phone.extend({
    
    onHomeViewClick: function () {
      bapp.homeViewWidgetClick(this)
      return false;
    }
    
  });
  
})(jQuery);

//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.calendar = Widget.extend({
    
    onHomeViewClick: function () {
      window.location = this.get('url');
      return false;
    }
  });
  
})(jQuery);

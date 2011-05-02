//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.link = Widget.extend({
    
    initialize: function () {
      _.bindAll(this,'onHomeViewClick');
      Widget.prototype.initialize.call(this);
    },
    
    onHomeViewClick: function () {
      window.location = this.get('url');
      return false;
    }
    
  });
  
})(jQuery);

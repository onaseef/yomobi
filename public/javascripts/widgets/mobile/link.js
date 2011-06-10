//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.link = Widget.extend({
    requiredAttrs: ['url'],
    
    initialize: function () {
      _.bindAll(this,'onHomeViewClick');
      Widget.prototype.initialize.call(this);
    },
    
    onHomeViewClick: function () {
      window.open(this.get('url'));
      return false;
    }
    
  });
  
})(jQuery);

//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.phone = Widget.extend({
    requiredAttrs: ['phone'],
    
    onHomeViewClick: function () {
      window.location = 'tel:' + this.get('phone');
      return false;
    }
  });
  
})(jQuery);

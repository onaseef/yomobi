//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.phone = Widget.extend({
    onHomeViewClick: function () {
      window.location = 'tel:' + this.get('phone');
      return false;
    },
  });
  
})(jQuery);

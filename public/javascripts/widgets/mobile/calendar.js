//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.calendar = Widget.extend({
    requiredAttrs: ['url'],

    onHomeViewClick: function () {
      window.location = this.get('url');
      return false;
    }
  });
  
})(jQuery);

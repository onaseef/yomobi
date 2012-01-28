//
// MOBILE
//
(function ($) {

  window.widgetClasses.phone = Widget.extend({
    requiredAttrs: ['phone'],

    onHomeViewClick: function () {
      if (!g.isPreview) {
        window.location = 'tel:' + this.get('phone');
      }
      return true;
    }
  });

})(jQuery);

//
// BUILDER
//
(function ($) {
  
  window.widgetEditors.coupon = window.EditWidgetView.extend({

    onEditStart: function (widget) {
      $(this.el).find('input[name=expire]').datepicker();
    },
  });
  
})(jQuery);

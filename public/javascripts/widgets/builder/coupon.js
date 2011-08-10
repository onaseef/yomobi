//
// BUILDER
//
(function ($) {
  
  window.widgetEditors.coupon = window.EditWidgetView.extend({

    onEditStart: function (widget) {
      var self = this;
      var dateInput = $(this.el).find('input[name=expire]');
      dateInput.datepicker({
        onSelect: function () { self.checkForChanges({ target:dateInput }); }
      });
    }
  });
  
})(jQuery);

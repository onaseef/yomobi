(function ($) {
  
  window.widgetClasses.hours = Widget.extend({
    
    isDayAllDay: function (day) {
      return this.get('hours')[day] === '00:00-23:59';
    }
  });
  
})(jQuery);


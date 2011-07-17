//
// MOBILE
//
(function ($) {

  var days = ['sun','mon','tue','wed','thu','fri','sat'];

  var isEmpty = function (str) { return !str; };
  
  window.widgetClasses.hours = Widget.extend({
    
    isDayAllDay: function (day) {
      return this.get('hours')[day][2] === true;
    },
    
    isDayEnabled: function (day) {
      return this.get('hours')[day][3] === true;
    },

    getShowData: function () {
      util.log('show data');
      var data = {}, self = this;

      _.each(days, function (day) {
        var hours = self.get('hours')[day];

        if (!self.isDayEnabled(day)) {
          data[day+'Hours'] = '<span class="closed">Closed</span>';
        }
        else if (self.isDayAllDay(day)) {
          data[day+'Hours'] = '<span class="all-day">Open All Day</span>';
        }
        else {
          data[day+'Hours'] = _(hours).chain().first(2).reject(isEmpty).map(function (h) {
            var from = h.split('|')[0], to = h.split('|')[1];
            return '<span class="open">' + from + ' to ' + to + '</span>';
          }).value().join('<br />');
        }
      });

      return _.extend(this.toJSON(),data);
    }
  });
  
})(jQuery);


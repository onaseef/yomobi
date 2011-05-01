//
// MOBILE
//
(function ($) {

  var days = ['sun','mon','tue','wed','thu','fri','sat'];
  
  window.widgetClasses.hours = Widget.extend({
    
    isDayAllDay: function (day) {
      return this.get('hours')[day] === '12:00am|11:59pm';
    },
    
    getShowData: function () {
      util.log('show data');
      var data = {}, self = this;
      _.each(days, function (day) {
        var hours = self.get('hours')[day];
        if (hours.length == 0) {
          data[day+'Hours'] = '<span class="closed">Closed</span>';
        }
        else if (self.isDayAllDay(day)) {
          data[day+'Hours'] = '<span class="all-day">Open All Day</span>';
        }
        else {
          data[day+'Hours'] = _.map(hours, function (h) {
            var from = h.split('|')[0], to = h.split('|')[1];
            return '<span class="open">' + from + ' to ' + to + '</span>';
          }).join('<br />');
        }
      });

      data.prettyName = util.lineWrap(this.get('prettyName'))
      return _.extend(this.toJSON(),data);
    }
  });
  
})(jQuery);


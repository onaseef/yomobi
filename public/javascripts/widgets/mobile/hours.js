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
        var hours = self.get('hours')[day]
          , from = hours ? util.from24to12(hours.split('-')[0]) : ''
          , to   = hours ? util.from24to12(hours.split('-')[1]) : ''
        ;
        if (!hours) {
          data[day+'Hours'] = '<span class="closed">Closed</span>';
        }
        else if (self.isDayAllDay(day)) {
          data[day+'Hours'] = '<span class="all-day">Open All Day</span>';
        }
        else {
          data[day+'Hours'] = '<span class="open">' + from + ' to ' + to + '</span>';
        }
      });
      util.log('showdata',data);
      return _.extend(this.toJSON(),data);;
    }
  });
  
})(jQuery);


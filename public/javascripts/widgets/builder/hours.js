//
// BUILDER
//
(function ($) {

  var days = ['sun','mon','tue','wed','thu','fri','sat'];

  window.widgetClasses.hours = window.widgetClasses.hours.extend({

    init: function () {
      var self = this;

      if (!this.get('hours')) {
        // set standard example hours
        hours = {};
        _.each(days, function (day) { hours[day] = ['9:00am|5:00pm','',false,true] });
        
        util.log('new, default hours',hours);
        this.set({ hours:hours, doubleTime:false });
      }
    },

    getEditData: function () {
      var data = {}, self = this;
      _.each(days, function (day) {
        var hours = self.get('hours')[day]
          , isEnabled = self.isDayEnabled(day) || undefined
          , dayClosed =  isEnabled ?  undefined : 'closed'
          , dayDisplay = isEnabled ? 'block' : 'hidden'
        ;
        data[day+'Closed'] = dayClosed;
        data[day+'Display'] = dayDisplay;

        var fromHours = data[day+'FromHours'] = [];
        var toHours   = data[day+'ToHours']   = [];

        _.each(_.first(hours,2), function (h) {
          var from = h.split('|')[0], to = h.split('|')[1] || '';
          fromHours.push(from);       toHours.push(to);
        });
      });

      data.doubleTimeChecked = self.get('doubleTime') && 'double-time' || undefined;

      return _.extend(this.toJSON(),data);
    }
    
  });

  // helper functions for use in the hours widget editor
  var pluckVal = function (idx,input) { return input.value; }
    , hourJoin = function (h) { return h.join('|'); }
    , clearLonePipe = function (str) { return (str == '|') ? '' : str; }
  ;
  window.widgetEditors.hours = window.EditWidgetView.extend({

    events: {
      'click .day-enabled input':     'toggleDayCheckbox',
      'click input[name=doubleTime]': 'toggleDoubleTime'
    },
    
    init: function (widget) {
      
    },
    
    onEditStart: function () {
      var self = this, isDoubleTime = self.widget.get('doubleTime');
      
      this.el.find('.edit-area .day-hours').each(function (idx,elem) {
        var $elem = $(elem), day = $elem.attr('day')
          , isEnabled = self.widget.isDayEnabled(day)
        ;
        $elem.find('.day-enabled input').prop('checked',isEnabled);
      });
      this.el.find('.double-time input').prop('checked',isDoubleTime);
      this.el.find('.input-area').toggleClass('double-time',isDoubleTime);
    },
    
    toggleDayCheckbox: function (e) {
      var $target = $(e.target)
        , day = $target.attr('day')
        , $hoursDiv = this.el.find('.day-hours[day='+day+']')
      ;
      $hoursDiv.toggleClass('closed');
    },
    
    toggleDoubleTime: function () {
      var isDoubleTime = this.el.find('.double-time:first input').is(':checked');
      this.el.find('.input-area').toggleClass('double-time',isDoubleTime);
    },

    grabWidgetValues: function () {
      var weekHours = {};
      this.el.find('.day-hours').each(function (idx,elem) {
        
        var $this = $(this)
          , day = $this.attr('day')
          , isEnabled = $this.find('input[name='+day+'Enabled]').is(':checked')

          , fromHours = $this.find('.hour.from').map(pluckVal)
          , toHours   = $this.find('.hour.to').map(pluckVal)
          , hours = _(fromHours).chain().zip(toHours).map(hourJoin).map(clearLonePipe).value()
        ;
        weekHours[day] = hours.concat([false,isEnabled]);
      });
      var isDoubleTime = this.el.find('.double-time:first input').is(':checked');

      return { hours:weekHours, doubleTime:isDoubleTime };
    }
  })

})(jQuery);

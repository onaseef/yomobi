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
          , dayChecked = isEnabled && 'checked' || ''
          , dayDisplay = isEnabled ? 'block' : 'hidden'
          , allDayChecked = self.isDayAllDay(day) && 'checked' || undefined
          , dayChecked = dayChecked + (allDayChecked ? ' all-day' : '')
        ;
        data[day+'Checked'] = dayChecked;
        data[day+'Display'] = dayDisplay;
        data[day+'AllDayChecked'] = allDayChecked;

        var fromHours = data[day+'FromHours'] = [];
        var toHours   = data[day+'ToHours']   = [];

        _.each(_.first(hours,2), function (h) {
          var from = h.split('|')[0], to = h.split('|')[1] || '';
          fromHours.push(from);       toHours.push(to);
        });
      });
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
      'click .all-day input':         'toggleAllDayCheckbox',
      'click input[name=doubleTime]': 'toggleDoubleTime'
    },
    
    init: function (widget) {
      
    },
    
    onEditStart: function () {
      var self = this, isDoubleTime = self.widget.get('doubleTime');
      
      this.el.find('.edit-area .day-hours').each(function (idx,elem) {
        var $elem = $(elem), day = $elem.attr('day')
          , isEnabled = self.widget.isDayEnabled(day)
          , isAllDay  = self.widget.isDayAllDay(day)
        ;
        $elem.find('.day-enabled input').prop('checked',isEnabled);
        $elem.find('.all-day input').prop('checked',isAllDay);
        $elem.find('.t1').toggle(isDoubleTime);
      });
      this.el.find('.double-time input').prop('checked',isDoubleTime);
    },
    
    toggleDayCheckbox: function (e) {
      var $target = $(e.target)
        , day = $target.attr('day')
        , $hoursDiv = this.el.find('.day-hours[day='+day+']')
      ;
      $hoursDiv.toggleClass('checked');
      
      if ( $target.prop('checked') )
        $hoursDiv.find('.times, .all-day').css('visibility','visible');
      else
        $hoursDiv.find('.times, .all-day').css('visibility','hidden');
    },
    
    toggleAllDayCheckbox: function (e) {
      var target = $(e.target)
        , allDay = target.parent()
        , hours = allDay.parent()
        , isChecked = target.is(':checked')
      ;
      hours.toggleClass('all-day',isChecked);
      allDay.find('input').prop('checked',isChecked);
    },
    
    toggleDoubleTime: function () {
      var isDoubleTime = this.el.find('.double-time input').is(':checked');
      this.el.find('.t1').toggle(isDoubleTime);
    },

    grabWidgetValues: function () {
      var weekHours = {};
      this.el.find('.day-hours').each(function (idx,elem) {
        
        var $this = $(this)
          , day = $this.attr('day')
          , isEnabled = $this.find('input[name='+day+'Enabled]').is(':checked')
          , allDay = $this.find('.all-day input').is(':checked')

          , fromHours = $this.find('.hour.from').map(pluckVal)
          , toHours   = $this.find('.hour.to').map(pluckVal)
          , hours = _(fromHours).chain().zip(toHours).map(hourJoin).map(clearLonePipe).value()
        ;
        weekHours[day] = hours.concat([allDay,isEnabled]);
      });
      var isDoubleTime = this.el.find('.double-time input').is(':checked');
util.log('DOUBLE TIME',isDoubleTime)
      return { hours:weekHours, doubleTime:isDoubleTime };
    }
  })

})(jQuery);

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
        var weekDays = ['mon','wed','fri'];
        _.each(weekDays, function (day) { hours[day] = '8:00-18:00' });
        util.log('hours',hours);
        this.set({ hours:hours });
      }
    },

    getEditData: function () {
      var data = {}, self = this;
      _.each(days, function (day) {
        var hours = self.get('hours')[day]
          , dayStatus = hours && 'checked'
          , from = hours ? util.from24to12(hours.split('-')[0]) : ''
          , to   = hours ? util.from24to12(hours.split('-')[1]) : ''
          , allDay = (hours === '00:00-23:59') ? 'checked' : ''
        ;
        data[day+'Status']   = dayStatus;
        data[day+'FromHour'] = from;
        data[day+'ToHour']   = to;
        data[day+'AllDay']   = allDay;
      });
      return _.extend(this.toJSON(),data);;
    }
    
  });

  window.widgetEditors.hours = window.EditWidgetView.extend({

    events: {
      'click .checkbox':            'toggleDayCheckbox',
      'click input[type=checkbox]': 'toggleAllDayCheckbox'
    },
    
    init: function (widget) {
      
    },
    
    onEditStart: function () {
      var self = this;
      
      this.el.find('.edit-area input.hour').timepicker({
        ampm: true,
        timeFormat: 'hh:mmtt',
        stepMinute: 15,
        onTimeChange: function (input) {
          var $input = $(input);
          if ( $input.hasClass('hour from') )
            var from = $input, to = $input.siblings('input.to'), active = 'from';
          else
            var from = $input.siblings('input.from'), to = $input, active = 'to';

          self.adjustHours(from,to,active);
        }
      });
      
      this.el.find('.edit-area .day-hours').each(function (idx,elem) {
        var $elem = $(elem), day = $elem.attr('day');
        if (self.widget.isDayAllDay(day)) {
          $elem.find('input[type=checkbox]').attr('checked','checked');
          $elem.find('.hour-wrap').toggleClass('all-day-checked',true);
          $elem.find('.all-day-label').toggleClass('all-day-checked',true);
          $elem.find('.add-time').hide();
        }
        else {
          $elem.find('input[type=checkbox]').removeAttr('checked');
        }
        util.log(day,self.widget.isDayAllDay(day));
      });
    },
    
    toggleDayCheckbox: function (e) {
      var $target = $(e.target)
        , day = $target.attr('day')
        , $hoursDiv = this.el.find('.day-hours[day='+day+']')
      ;
      $target.toggleClass('checked');
      $hoursDiv.toggleClass('checked');
      
      if ( $target.hasClass('checked') )
        $hoursDiv.show('highlight');
      else
        $hoursDiv.hide('drop');
    },
    
    toggleAllDayCheckbox: function (e) {
      util.log('toogle');
      var $target = $(e.target)
        , row = $target.parent().siblings('.row')
        , $hourWrap = row.find('.hour-wrap')
        , $allDayLabel = row.siblings('.all-day-label')
        , $addTime = row.siblings('.add-time')
        , isChecked = $target.is(':checked')
      ;
      $hourWrap.toggleClass('all-day-checked',isChecked);
      $allDayLabel.toggleClass('all-day-checked',isChecked);
      $addTime.toggle(!isChecked);
    },
    
    grabWidgetValues: function () {
      var hours = {};
      this.el.find('.day-hours').each(function (idx,elem) {
        
        var $this = $(this)
          , day = $this.attr('day')
          , dayCheckbox = $this.siblings('.day-checkbox[day='+day+']').find('.checkbox')
        ;
        if ( !dayCheckbox.hasClass('checked') ) return;
        
        var from = util.from12to24( $this.find('.hour.from').val() )
          , to   = util.from12to24( $this.find('.hour.to').val()   )
          , allDay = $this.find('input[type=checkbox]').is(':checked')
        ;
        hours[day] = allDay ? '00:00-23:59' : from + '-' + to;
      });
      util.log('grab hours',hours);
      return { hours:hours };
    },
    
    // fromElem and toElem are assumed to be jQuery-extended
    // 
    adjustHours: function ($fromElem,$toElem,active) {
      var fromTime = util.parseTimeTo24($fromElem.val() || '00:00am')
        , toTime   = util.parseTimeTo24($toElem.val() || '00:00am')
      ;
      if (active == 'from' && fromTime.toMinutes() >= toTime.toMinutes()) {
        // adjust toTime to be one hour after fromTime
        toTime.hour = fromTime.hour + 1;
        toTime.minute = fromTime.minute;
        $toElem.val(toTime.toString12());
      }
      else if (active == 'to' && fromTime.toMinutes() >= toTime.toMinutes()) {
        // adjust fromTime to be one hour less than toTime
        fromTime.hour = toTime.hour - 1;
        fromTime.minute = toTime.minute;
        $fromElem.val(fromTime.toString12());
      }
    }
  })

})(jQuery);

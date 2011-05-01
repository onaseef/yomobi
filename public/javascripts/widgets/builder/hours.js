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
        _.each(['mon','wed','fri'], function (day) { hours[day] = ['8:00am|6:00pm'] });
        _.each(['sun','tue','thu','sat'], function (day) { hours[day] = [] });
        
        util.log('hours',hours);
        this.set({ hours:hours });
      }
    },

    getEditData: function () {
      var data = {}, self = this;
      _.each(days, function (day) {
        var hours = self.get('hours')[day]
          , dayStatus = (hours.length > 0) && 'checked'
          , allDay = (hours[0] === '12:00am|11:59pm') ? 'checked' : ''
        ;
        data[day+'Status']   = dayStatus;
        data[day+'AllDay']   = allDay;

        var fromHours = data[day+'FromHours'] = [];
        var toHours   = data[day+'ToHours']   = [];

        _.each(hours, function (h) {
          var from = h.split('|')[0], to = h.split('|')[1];
          fromHours.push(from);
          toHours.push(to);
        });
        
        if (hours.length == 0) {
          fromHours.push(''); toHours.push('');
        }
      });
      return _.extend(this.toJSON(),data);
    }
    
  });

  window.widgetEditors.hours = window.EditWidgetView.extend({

    events: {
      'click .checkbox':            'toggleDayCheckbox',
      'click input[type=checkbox]': 'toggleAllDayCheckbox',
      'click .add-time':            'addTime'
    },
    
    init: function (widget) {
      
    },
    
    onEditStart: function () {
      var self = this;
      
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
    
    addTime: function (e) {
      var lastRow = $(e.target).parent().find('.row:first')
        , newRow = lastRow.clone().find('input').val('').end()
      ;
      lastRow.after(newRow);
    },
    
    grabWidgetValues: function () {
      var weekHours = {};
      this.el.find('.day-hours').each(function (idx,elem) {
        
        var $this = $(this)
          , day = $this.attr('day')
          , dayCheckbox = $this.siblings('.day-checkbox[day='+day+']').find('.checkbox')
        ;
        if ( !dayCheckbox.hasClass('checked') ) return weekHours[day] = [];
        
        var pluckVal = function (idx,input) { return input.value; }
          , isEmpty  = function (h) { return _.compact(h).length == 0; }
          , hourJoin = function (h) { return h.join('|'); }
          
          , fromHours = $this.find('.hour.from').map(pluckVal)
          , toHours   = $this.find('.hour.to').map(pluckVal)
          , hours = _(fromHours).chain().zip(toHours).reject(isEmpty).map(hourJoin).value()
          , allDay = $this.find('input[type=checkbox]').is(':checked')
        ;
        weekHours[day] = allDay ? ['12:00am|11:59pm'] : hours;
      });
      util.log('grab hours',weekHours);
      return { hours:weekHours };
    }
  })

})(jQuery);

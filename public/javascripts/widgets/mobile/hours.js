//
// MOBILE
//
(function ($) {

  var days = ['sun','mon','tue','wed','thu','fri','sat'];

  var isEmpty = function (str) { return !str; };

  window.widgetClasses.hours = Widget.extend({

    isDayEnabled: function (day) {
      return this.get('hours')[day][3] === true;
    },

    getShowData: function () {
      util.log('show data');
      var data = {}, self = this;

      _.each(days, function (day) {
        var hours = self.get('hours')[day];

        if (!self.isDayEnabled(day)) {
          data[day+'Hours'] = '<span class="closed">' + g.i18n.closed + '</span>';
        }
        else {
          data[day+'Hours'] = _(hours).chain().first(2).reject(isEmpty).map(function (h) {
            var from = h.split('|')[0], to = h.split('|')[1];
            return '<span class="open">' + from + ' - ' + to + '</span>';
          }).value().join('<br />');
        }
      });

      return _.extend(this.toJSON(),data);
    }
  });

})(jQuery);


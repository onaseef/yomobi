//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.custom_page = Widget.extend({
    requriedAttrs: ['content'],

    getShowData: function () {
      var extraData = {
        wphotoUrl: util.largerWphoto( this.get('wphotoUrl') )
      };
      return _.extend({}, this.toJSON(), extraData);
    }
  });
  
})(jQuery);


// MOBILE
//
(function ($) {

  window.widgetClasses.text_area = Widget.extend({
	requiredAttrs: ['content'],
	getShowData: function () {
      var extraData = {
       // wphotoUrlLarge: util.largerWphoto( this.get('wphotoUrl') ),
        content: util.ensurePTag( this.get('content') )
      };
      return _.extend({}, this.toJSON(), extraData);
    }
  });


})(jQuery);
//
// MOBILE
//
(function ($) {

  window.widgetClasses.custom_page = Widget.extend({
    requiredAttrs: ['content'],

    getShowData: function () {
      var extraData = {
        wphotoUrlLarge: util.largerWphoto( this.get('wphotoUrl') ),
        content: util.ensurePTag( this.get('content') )
      };
      return _.extend({}, this.toJSON(), extraData);
    }
  });


  window.widgetPages.custom_page = WidgetPageView.extend({

    beforePageRender: util.widget.resizeOnImgLoad
  });

})(jQuery);

//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.custom_page = Widget.extend({
    requriedAttrs: ['content'],

    getShowData: function () {
      var extraData = {
        wphotoUrlLarge: util.largerWphoto( this.get('wphotoUrl') )
      };
      return _.extend({}, this.toJSON(), extraData);
    }
  });


  window.widgetPages.category = WidgetPageView.extend({

    beforePageRender: util.widget.resizeOnImgLoad
  });
  
})(jQuery);

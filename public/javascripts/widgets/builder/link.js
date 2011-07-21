// 
// BUILDER
// 
(function ($) {
  
  widgetClasses.link = widgetClasses.link.extend({
    
    onHomeViewClick: function () {
      if (bapp.homeViewWidgetClick(this)) {
        if (confirm('Visit '+this.get('url')+'?'))
          window.location = this.get('url');
      }
      return false;
    },

    getEditData: function () {
      var extraData = {
        subHelpText: util.getWidgetBData(this).subHelpText
      };
      return _.extend(this.toJSON(),extraData);
    },

    validate: function (attrs) {
      if (attrs.url && !attrs.url.match(/^(https?:\/\/)|(ftps?\/\/)/))
        attrs.url = 'http://' + attrs.url;
    }
    
  });
  
})(jQuery);

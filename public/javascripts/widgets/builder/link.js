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
    
    validate: function (attrs) {
      if (attrs.url && !attrs.url.match(/^http:\/\//))
        attrs.url = 'http://' + attrs.url;
    }
    
  });
  
})(jQuery);

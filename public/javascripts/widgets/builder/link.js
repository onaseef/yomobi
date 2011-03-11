(function ($) {
  
  widgetClasses.link = widgetClasses.link.extend({
    
    onHomeViewClick: function () {
      if (bapp.homeViewWidgetClick(this)) {
        if (confirm('Visit '+this.get('url')+'?'))
          window.location = this.get('url');
      }
      return false;
    }
    
  });
  
})(jQuery);

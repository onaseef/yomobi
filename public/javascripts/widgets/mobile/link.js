//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.link = Widget.extend({
    requiredAttrs: ['url'],
    
    initialize: function () {
      _.bindAll(this,'onHomeViewClick');
      Widget.prototype.initialize.call(this);
    },
    
    onHomeViewClick: function () {
      var url = this.get('url');
      if (this.get('wsubtype') == 'full-website') {
        if (url.indexOf('?') == -1) url += '?noredirect=1';
        else url += '&noredirect=1';
      }
      window.open(url);
      return false;
    }
    
  });
  
})(jQuery);

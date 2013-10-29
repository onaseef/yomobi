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
      var noRedirect = this.get('noRedirect');
      if ((this.get('wsubtype') == 'full-website') || (noRedirect == true)) {
        if (url.indexOf('?') == -1) url += '?noredirect=1';
        else url += '&noredirect=1';
        var domain = $('<a>').attr('href',url).hide()
                     .appendTo(document.body)[0].hostname;
        util.createNoRedirectCookie(domain, 10);
      }
      window.open(url);
      return false;
    }
    
  });
  
})(jQuery);

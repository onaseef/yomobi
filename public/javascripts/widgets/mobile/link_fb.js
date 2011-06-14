//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.link_fb = Widget.extend({
    requiredAttrs: ['userId'],
    
    initialize: function () {
      _.bindAll(this,'onHomeViewClick');
      Widget.prototype.initialize.call(this);
    },
    
    getUrl: function () {
      var userId = this.get('userId');
      if (!userId) return null;
      
      var urlRegex = new RegExp('^(https?:\\/\\/)?([^.]+\\.)?' + this.get('basename') + '\\.com');
      util.log('REGEX',urlRegex);
      if (userId.match(urlRegex))
        return userId;
      return 'http://www.' + this.get('basename') + '.com/' + userId;
    },
    
    onHomeViewClick: function () {
      window.location = this.getUrl();
      return false;
    }
    
  });
  
})(jQuery);

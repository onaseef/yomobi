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

      if (userId.match(urlRegex))
        return userId;
      else
        return this.get('host') + userId;
    },
    
    onHomeViewClick: function () {
      window.open( this.getUrl() );
      return false;
    }
    
  });
  
})(jQuery);

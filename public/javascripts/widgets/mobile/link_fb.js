//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.link_fb = Widget.extend({
    
    initialize: function () {
      _.bindAll(this,'onHomeViewClick');
      Widget.prototype.initialize.call(this);
    },
    
    getUrl: function () {
      var fbid = this.get('fbid');
      if (!fbid) return null;
      
      if (fbid.match(/^(https?:\/\/)?(www.)?facebook.com/))
        return fbid;
      return 'http://www.facebook.com/' + fbid;
    },
    
    onHomeViewClick: function () {
      window.location = this.getUrl();
      return false;
    }
    
  });
  
})(jQuery);

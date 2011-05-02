//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.link_fb = Widget.extend({
    
    baseName: 'facebook',
    
    initialize: function () {
      _.bindAll(this,'onHomeViewClick');
      Widget.prototype.initialize.call(this);
    },
    
    getUrl: function () {
      var fbid = this.get('fbid');
      if (!fbid) return null;
      
      if ( fbid.match(new RegExp('^(https?:\\/\\/)?(www\\.)?' + this.baseName + '\\.com/')) )
        return fbid;
      return 'http://www.' + this.baseName + '.com/' + fbid;
    },
    
    onHomeViewClick: function () {
      window.location = this.getUrl();
      return false;
    }
    
  });
  
})(jQuery);

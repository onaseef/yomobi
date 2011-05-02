//
// BUILDER
//
(function ($) {
  
  widgetClasses.link_fb = widgetClasses.link_fb.extend({
    
    onHomeViewClick: function () {
      if (bapp.homeViewWidgetClick(this)) {
        if (confirm('Visit '+this.get('fbid')+"'s facebook page?"))
          window.location = 'http://facebook.com/' + this.get('url');
      }
      return false;
    },
    
    getEditData: function () {
      var extraData = {
        url: this.get('fbid') || '#',
        anchorText: this.getUrl() || 'None'
      };
      return _.extend({},this.toJSON(),extraData);
    },
    
    validate: function (attrs) {
      if (attrs.fbid && attrs.fbid.match(new RegExp('^(www\\.)?'+this.baseName+'\\.com')))
        attrs.fbid = 'http://' + attrs.fbid;
    }
    
  });
  
})(jQuery);

//
// BUILDER
//
(function ($) {
  
  widgetClasses.link_fb = widgetClasses.link_fb.extend({
    
    onHomeViewClick: function () {
      if (bapp.homeViewWidgetClick(this)) {
        if (confirm('Visit '+this.get('userId')+"'s this page?"))
          window.open( this.get('host') + this.get('url') );
      }
      return false;
    },
    
    getEditData: function () {
      var extraData = {
        url: this.getUrl() || '#',
        anchorText: this.getUrl() || 'None'
      };
      return _.extend({},this.toJSON(),extraData);
    },
    
    beforeSave: function (attrs) {
      var urlRegex = new RegExp('^([^.\\/]+\\.)?'+this.get('basename')+'\\.com');
      if (attrs.userId && attrs.userId.match(urlRegex)) {
        util.log('NOT FULL LINK',attrs.userId);
        attrs.userId = 'http://' + attrs.userId;
      }
    }
    
  });
  
})(jQuery);

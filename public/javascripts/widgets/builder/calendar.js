//
// BUILDER
//
(function ($) {

  var days = ['sun','mon','tue','wed','thu','fri','sat'];

  window.widgetClasses.calendar = window.widgetClasses.calendar.extend({
    
    getEditData: function () {
      var extraData = {
        showUrl: this.get('url') || 'None'
      };
      return _.extend({},this.toJSON(),extraData);
    },
    
    onHomeViewClick: function () {
      if (bapp.homeViewWidgetClick(this)) {
        if (confirm('Visit '+this.get('url')+'?'))
          window.location = this.get('url');
      }
      return false;
    }
    
  });

  window.widgetEditors.calendar = window.EditWidgetView.extend({

    events: {
      'paste textarea':            'onPaste'
    },
    
    init: function () {
      _.bindAll(this,'extractEmbedLink');
    },
    
    onPaste: function (e) {
      this.el.find('textarea').val('');
      setTimeout(this.extractEmbedLink,100);
    },
    
    extractEmbedLink: function () {
      var pasteArea = this.el.find('textarea')
      try {
        var maybeElem = $( pasteArea.val() )
          , tagName = maybeElem[0] && maybeElem[0].nodeName.toLowerCase()
          , url = maybeElem.attr('src')
        ;
        if (!maybeElem[0] || tagName != 'iframe' || !url)
          return pasteArea.val('Bad embed link (Please try again)');
      
        if (url.match(/^https?:\/\/www.google.com/)) {
          // url = this.buildGoogleUrl(url);
        }
      
        this.el
          .find('input[name=url]').val(url).end()
          .find('.url a').attr('href',url).text(url).end()
        ;
        pasteArea.val('Google calendar pasted successfully!');
      
        console.log('pasted!',tagName,url);
      }
      catch (error) {
        util.log('ERROR',error);
        pasteArea.val('Bad embed link (Please try again)');
      }
    },
    
    buildGoogleUrl: function (url) {
      var params = util.getUrlParams(url);
      if (!params.mode) {
        util.log('NO MODE');
        params.mode = 'AGENDA';
      }
      return url.substring(0,url.indexOf('?')+1) + $.param(params);
    },
    
    grabWidgetValues: function () {
      return {
        url: this.el.find('input[name=url]').val()
      };
    }
    
  })

})(jQuery);

//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.informed = Widget.extend({
    validForShowing: function () {
      return this.get('email') && (this.get('optForEmails') || this.get('optForTexts'));
    }
  });
  
  window.widgetPages.informed = WidgetPageView.extend({

    events: {
      'submit': 'submit'
    },
    
    init: function (widget) {
      _.bindAll(this,'submit');
    },
    
    submit: function () {
      var self = this
        , form = this.el.find('form')
        , url  = form.attr('action')
        , params = form.serialize()
        , method = form.attr('method')
      ;
      $.post(url,params,function (data) {
        util.log('data',data);
        self.el
          .find('.input-wrap').hide().end()
          .find('.thanks-wrap').show().end()
        ;
      })
      .error(function (e,textStatus,errorThrown) {
        var msg = prettyErrorMsg($.parseJSON(e.responseText))
        self.el.find('.response').text('ERROR: '+msg);
        mapp.resize();
      });
      
      return false;
    }
  });

  function prettyErrorMsg (serverResponse) {
    var msg = '';
    util.log('SERVER RESPONSE',serverResponse);
  }
  
})(jQuery);

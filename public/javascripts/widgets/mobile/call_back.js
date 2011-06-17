//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.call_back = Widget.extend({
    requiredAttrs: ['email']
  });
  
  window.widgetPages.call_back = WidgetPageView.extend({

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
        self.el.find('.response').html('ERROR: '+msg);
        mapp.resize();
      });
      
      return false;
    }
  });

  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>You must provide a phone number and message</li>';
    else if (serverResponse === "bad phone")
      msg += '<li>Invalid mobile number</li>';
    util.log('SERVER RESPONSE',serverResponse);
    return msg + '</ul>';
  }
  
})(jQuery);


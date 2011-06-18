//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.tell_friend = Widget.extend({

  });
  
  window.widgetPages.tell_friend = WidgetPageView.extend({

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
      msg += '<li>You must fill out all three fields</li>';
    else if (serverResponse === "bad email to")
      msg += '<li>Invalid email. Please recheck your friend\'s email</li>';
    else if (serverResponse === "bad email from")
      msg += '<li>Invalid email. Please recheck your email.</li>';
    return msg + '</ul>';
  }

})(jQuery);

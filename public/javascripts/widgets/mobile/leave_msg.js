//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.leave_msg = Widget.extend({
    requiredAttrs: ['email']
  });
  
  window.widgetPages.leave_msg = WidgetPageView.extend({

    events: {
      'submit': 'submit',
      'postRender': 'spawnCaptcha'
    },
    
    init: function (widget) {
      _.bindAll(this,'submit');
    },
    
    spawnCaptcha: function () {
      var myWidget = this.widget;
      setTimeout(function () {
        if (mapp.currentWidget === myWidget) util.spawnAritcaptcha();
      },1000);
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
        self.el.find('.response').html('ERROR: '+msg).show('pulsate',{ times:3 });
        mapp.resize();
      });
      
      return false;
    }
  });

  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>You must fill in all fields.</li>';
    else if (serverResponse === "captcha") {
      msg += '<li>Incorrect math answer. Please try again.</li>';
      util.spawnAritcaptcha();
    }
    else if (serverResponse === "bad email")
      msg += '<li>Invalid email address.</li>';
    
    _.each(serverResponse.email, function (error) {
      msg += '<li>Email ' + error + '</li>';
    });
    _.each(serverResponse.phone, function (error) {
      msg += '<li>Mobile number ' + error + '</li>';
    });
    util.log('SERVER RESPONSE',serverResponse);
    return msg + '</ul>';
  }
  
})(jQuery);


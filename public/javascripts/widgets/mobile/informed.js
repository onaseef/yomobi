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
      'submit': 'submit',
      'postRender': 'spawnCaptcha'
    },
    
    init: function (widget) {
      _.bindAll(this,'submit');
    },
    
    spawnCaptcha: function () {
      var myWidget = this.widget;
      setTimeout(function () {
        if (mapp.currentWidget === myWidget) util.spawnRecaptcha();
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
        self.el.find('.response').html('ERROR: '+msg);
        mapp.resize();
      });
      
      return false;
    }
  });

  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>You must provide an email or phone number</li>';
    else if (serverResponse === "captcha") {
      msg += '<li>Incorrect typed word(s). Please try again.</li>';
      if (Recaptcha) Recaptcha.reload();
    }
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

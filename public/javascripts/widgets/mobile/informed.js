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
    
    spawnCaptcha: util.widget.spawnCaptcha,

    prettyErrorMsg: prettyErrorMsg,
    submit: util.widget.widgetPageViewSubmit
  });


  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>' + g.i18n.email_or_phone_required + '</li>';
    else if (serverResponse === "captcha") {
      msg += '<li>' + g.i18n.invalid_captcha + '</li>';
      util.spawnAritcaptcha();
    }
    _.each(serverResponse.email, function (error) {
      msg += '<li>' + g.i18n.invalid_email  + '</li>';
    });
    _.each(serverResponse.phone, function (error) {
      msg += '<li>' + g.i18n.invalid_phone + '</li>';
    });
    util.log('SERVER RESPONSE',serverResponse);
    return msg + '</ul>';
  }
  
})(jQuery);

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
    
    spawnCaptcha: util.spawnCaptcha,

    prettyErrorMsg: prettyErrorMsg,
    submit: util.widgetPageViewSubmit
  });

  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>You must provide an email or phone number</li>';
    else if (serverResponse === "captcha") {
      msg += '<li>Incorrect math answer. Please try again.</li>';
      util.spawnAritcaptcha();
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

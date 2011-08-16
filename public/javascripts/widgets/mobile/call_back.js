//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.call_back = Widget.extend({
    requiredAttrs: ['email']
  });
  
  window.widgetPages.call_back = WidgetPageView.extend({

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
      msg += '<li>You must fill in all fields.</li>';
    else if (serverResponse === "captcha") {
      msg += '<li>Incorrect math answer. Please try again.</li>';
      util.spawnAritcaptcha();
    }
    else if (serverResponse === "bad phone")
      msg += '<li>Invalid mobile number</li>';
    util.log('SERVER RESPONSE',serverResponse);
    return msg + '</ul>';
  }
  
})(jQuery);


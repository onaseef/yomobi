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


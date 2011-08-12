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

    prettyErrorMsg: prettyErrorMsg,
    submit: util.widgetPageViewSubmit

  });

  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>Please complete all fields before sending.</li>';
    else if (serverResponse === "bad email to")
      msg += '<li>Invalid email. Please recheck your friend\'s email</li>';
    else if (serverResponse === "bad email from")
      msg += '<li>Invalid email. Please recheck your email.</li>';
    return msg + '</ul>';
  }

})(jQuery);

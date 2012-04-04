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

    spawnCaptcha: util.widget.spawnCaptcha,

    prettyErrorMsg: prettyErrorMsg,
    submit: util.widget.widgetPageViewSubmit
  });


  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>' + g.i18n.all_fields_required + '</li>';
    else if (serverResponse === "captcha") {
      msg += '<li>' + g.i18n.invalid_captcha + '</li>';
      util.spawnAritcaptcha();
    }
    else if (serverResponse === "bad phone")
      msg += '<li>' + g.i18n.invalid_phone + '</li>';
    util.log('SERVER RESPONSE',serverResponse);
    return msg + '</ul>';
  }
  
})(jQuery);


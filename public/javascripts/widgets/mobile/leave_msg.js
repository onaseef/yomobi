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
    else if (serverResponse === "bad email")
      msg += '<li>' + g.i18n.invalid_email + '</li>';

    _.each(serverResponse.email, function (error) {
      msg += '<li>' + g.i18n.email + ' ' + error + '</li>';
    });
    _.each(serverResponse.phone, function (error) {
      msg += '<li>' + g.i18n.phone + ' ' + error + '</li>';
    });
    util.log('SERVER RESPONSE',serverResponse);
    return msg + '</ul>';
  }

})(jQuery);


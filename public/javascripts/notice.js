var exceptions = ['You have signed up successfully. If enabled, a confirmation was sent to your e-mail.'];

$(function () {
  var notice = $('#topline-notice > p.notice');
  if ( notice.length > 0 && !_.include(exceptions,notice.text()) ) {
    setTimeout(function () {
      notice.slideUp();
    },2500);
  }

  var alertp = $('#topline-notice > p.alert');
  if (alertp.text() == 'You are already signed in.') {
    setTimeout(function () {
      alertp.slideUp();
    },2500);
  }
});

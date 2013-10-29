var exceptions = ['You have signed up successfully. If enabled, a confirmation was sent to your e-mail.'];

$(function () {
  var toplineNotice = $('#topline-notice');
  var notice = $('#topline-notice > p.notice');
  if ( notice.length > 0) {
    setTimeout(function () {
      toplineNotice.slideDown();

      notice.siblings('.x-icon').click(function (e) {
        e.preventDefault(); toplineNotice.slideUp();
      });
      setTimeout(function () {
        if (!_.include(exceptions,notice.text()))
          toplineNotice.slideUp();
      }, 800 + notice.text().length * 80);
    }, 500);
  }

  var alertp = $('#topline-notice > p.alert');
  if (alertp.text() == 'You are already signed in.') {
    setTimeout(function () {
      toplineNotice.slideUp();
    },2500);
  }
  if (alertp.length > 0) {
    setTimeout(function () {
      toplineNotice.slideDown();
      alertp.siblings('a').click(function (e) {
        e.preventDefault(); toplineNotice.slideUp()
      });
      }, 500);
  }
});

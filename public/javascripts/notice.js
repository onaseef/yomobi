$(function () {
  var notice = $('#topline-notice > p.notice');
  if (notice.length > 0) {
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

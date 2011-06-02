$(function () {
  var notice = $('#topline-notice > p.notice');
  if (notice.length > 0) {
    setTimeout(function () {
      notice.slideUp();
    },2500);
  }
});

$(function () {
  $('form').submit(function () {
    $(this)
      .find('input[type=submit]').attr('disabled','disabled').end()
      .find('.load-box').show().end()
    ;
    return true;
  });
});

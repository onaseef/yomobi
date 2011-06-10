$(function () {
  $('form').live('submit', function () {
    $(this)
      .find('input[type=submit]').attr('disabled','disabled').end()
      .find('.load-box').show()
    ;
  });
});

$(function () {
  $('form').live('keyup',function () {
    var msgArea = $(this).find('textarea[name=message]')
      , charsLeft = g.MAX_TEXT_CHARS - msgArea.val().length
    ;
    if (charsLeft < 0) {
      msgArea.val(msgArea.val().substring(0,g.MAX_TEXT_CHARS));
      charsLeft = 0;
    }
    $('#chars-left').text(charsLeft);
  });
});

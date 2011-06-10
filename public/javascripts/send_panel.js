$(function () {
  $('form').live('submit', function () {
    $(this).find('input[type=submit]').replaceWith('<p class="success">Sending...</p>');
  });
});

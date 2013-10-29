jQuery(document).ready(function() {

  jQuery(".remote_button").click(function() {
    alert('Handler for .click() called.');
  });

  jQuery("#uploadIcon").bind("ajax:complete", function() {
    alert('complete!');
  })
  .bind("ajax:beforeSend", function () {
    alert('loading!');
  })
  .bind("ajax:error", function (xhr, status, error) {
    alert('failure!');
  })
  .bind('ajax:success', function(event, data, status, xhr) {
    alert('success!');
  });
});

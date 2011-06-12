//
// BUILDER
//
(function ($) {
  
  window.widgetEditors.custom_page = window.EditWidgetView.extend({
    onEditStart: function () {
      util.spawnJEditor();
    },

    grabWidgetValues: function () {
      return { content:$('#jeditor').val() };
    },
  });
  
})(jQuery);

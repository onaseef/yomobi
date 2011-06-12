//
// BUILDER
//
(function ($) {
  
  window.widgetEditors.custom_page = window.EditWidgetView.extend({

    init: function () {
      this.bind('wysiwyg-change',this.setDirty);
    },

    onEditStart: function () {
      util.spawnJEditor();
    },

    grabWidgetValues: function () {
      return { content:$('#jeditor').val() };
    },

    setDirty: function () {
      this.setChanged('content',true);
    }
  });
  
})(jQuery);

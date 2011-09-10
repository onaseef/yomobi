//
// BUILDER
//
(function ($) {
  
  window.widgetEditors.custom_page = window.EditWidgetView.extend({

    init: function () {
      this.bind('wysiwyg-change',this.setDirty);
      this.bind('wysiwyg-paste',this.queueStripStyles);
    },

    onEditStart: function () {
      util.spawnJEditor();
    },

    grabWidgetValues: function () {
      return { content:$('#jeditor').wysiwyg('getContent') };
    },

    setDirty: function () {
      this.setChanged('content',true);
    },

    queueStripStyles: function () {
      if (!this.updateTimeoutId) {
        var self = this;
        this.updateTimeoutId = setTimeout(function () {
          self.stripStyles();
          delete self.updateTimeoutId;
        },350);
      }
    },

    stripStyles: function () {
      var strippedContent = util.stripAllStyles( $('#jeditor').wysiwyg('getContent') );
      $('#jeditor').wysiwyg('setContent', strippedContent);
    }

  });
  
})(jQuery);

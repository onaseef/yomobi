//
// BUILDER
//
(function ($) {

  window.widgetClasses.custom_page = window.widgetClasses.custom_page.extend({

    getEditData: function () {
      var showData = this.getShowData();

      var extraData = {
        wphotoPreviewPath: this.get('wphotoUrl') || g.noPhotoPath
      };
      return _.extend({},showData,extraData);
    }
  });

  window.widgetEditors.custom_page = window.EditWidgetView.extend({

    events: {
      'click .remove-wphoto-link':          'removeWPhoto'
    },

    init: function () {
      this.bind('wysiwyg-change',this.setDirty);
      this.bind('wysiwyg-paste',this.queueStripStyles);
    },

    onEditStart: function (resetChanges,isFirstEdit) {
      this.originalContent = this.widget.get('content');
      util.spawnJEditor();
      if (resetChanges || isFirstEdit) this.changes = {};
    },

    grabWidgetValues: function () {
      return {
        content: $('#jeditor').wysiwyg('getContent'),
        wphotoUrl: this.el.find('input[name=wphotoUrl]').val()
      };
    },

    setDirty: function () {
      if (!this.hasChanges() &&
          this.originalContent !== $('#jeditor').wysiwyg('getContent'))
      {
        this.setChanged('content',true);
      }
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
      util.stripAllStyles( $('#jeditor').data('wysiwyg').editorDoc.body );
    }

  });
  
})(jQuery);

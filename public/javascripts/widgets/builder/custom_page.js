//
// BUILDER
//
(function ($) {

  var uploaderCallback = function(data) {
    util.log('wut wut',data);
    if (data.result !== 'success' && data.result !== 'noupload') {
      alert('Photo upload failed ('+ data.result +')');
      util.releaseUI();
      return;
    }
    this.editor.el.find('input[name=wphotoUrl]').val(data.wphotoUrl);
    // accept() needs the UI to be free
    util.releaseUI();
    this.editor.accept();
  };

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

      var callback = _.bind(uploaderCallback, { editor:this });

      util.initUploader( $(this.el).find('.wphoto-wrap'), {
        onDone: callback,
        emptyQueue: true,
        wid: this.widget.id
      });
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
      var strippedContent = util.stripAllStyles( $('#jeditor').wysiwyg('getContent') );
      $('#jeditor').wysiwyg('setContent', strippedContent);
    },

    removeWPhoto: function (e) {
      e.preventDefault();
      this.el.find('[name=wphotoUrl]').val('').end()
             .find('.wphoto-wrap img').attr('src', g.noPhotoPath);
      this.setChanged('wphoto', true);

      util._uploaders['default'].reposition();
    }

  });
  
})(jQuery);

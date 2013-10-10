//
// BUILDER
//
(function ($) {

  window.widgetClasses.text_area = window.widgetClasses.text_area.extend({

    getEditData: function () {
      var showData = this.getShowData();

      var extraData = {
        wphotoPreviewPath: this.get('wphotoUrl') || g.noPhotoPath
      };
      return _.extend({},showData,extraData);
    }
  });

  window.widgetEditors.text_area = window.EditWidgetView.extend({

    events: {
      'click .remove-wphoto-link':          'removeWPhoto'
    },

    init: function () {
      this.bind('wysiwyg-change',this.setDirty);
      this.bind('wysiwyg-paste',this.queueStripStyles);
    },

    onEditStart: function (resetChanges,isFirstEdit) {
      this.originalContent = util.ensurePTag( this.widget.get('content') );
      this.$('#jeditor').text(this.originalContent);
      util.spawnJEditor();
      var self = this;
      setTimeout(function () { self.setChanged('tex-area-content', false); }, 400);
      if (resetChanges || isFirstEdit) this.changes = {};
    },
    
    /*updateActiveLeaf: function () {
      var level = this.widget.getCurrentLevel(true)
        , leaf = level._data
        , oldContent = util.ensurePTag(leaf.content)
      ;

      if (this.areStylesDirty) {
        util.stripAllStyles( $('#jeditor').data('wysiwyg').editorDoc.body );
        this.areStylesDirty = false;
      }

      leaf.content = util.stripMeta( util.ensurePTag( $('#jeditor').wysiwyg('getContent') ));
      this.widget.pageView.refresh();
      mapp.resize();

      if (oldContent !== leaf.content) {
        this.setChanged('tex-area-content',true);
      }
    },*/

    grabWidgetValues: function () {
      return {
        content: util.stripMeta( util.ensurePTag( $('#jeditor').wysiwyg('getContent') )),
        wphotoUrl: this.el.find('input[name=wphotoUrl]').val()
      };
    },

    setDirty: function () {
      var newContent = util.stripMeta( util.ensurePTag( $('#jeditor').wysiwyg('getContent') ));
      if (this.originalContent !== newContent)
      {
      	mapp.homeView.render();
      	//this.originalContent = newContent;
        this.setChanged('content',true);
        $("#"+this.id).html(newContent);
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

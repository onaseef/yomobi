//
// BUILDER
//
(function ($) {

  var defaultPageContent = '';

  var super_getEditAreaData = window.Widget.prototype.getEditAreaData
      // at this point, categoryBuilder is actually references builder/category.js
    , categoryBuilder = window.widgetClasses.category.prototype
  ;

  window.widgetClasses.page_tree = window.widgetClasses.page_tree.extend({

    init: categoryBuilder.init,

    getEditAreaData: function () {
      var editAreaData = super_getEditAreaData.call(this)
        , isLeaf = this.hasLeafOnTop()
      ;
      var extraData = {
        hideSaveButton: !isLeaf,
        hideCancelButton: !isLeaf,
        hideRemoveLink: mapp.pageLevel != 0,
        hideHelpText: mapp.pageLevel !== 0
      };
      return _.extend({},editAreaData,extraData);
    },

    getEditData: categoryBuilder.getEditData,

    onHomeViewClick: categoryBuilder.onHomeViewClick,

    onSave: categoryBuilder.onSave,

    beforeSave: categoryBuilder.beforeSave
  });


  var categoryEditor = window.widgetEditors.category.prototype;

  window.widgetEditors.page_tree = window.widgetEditors.category.extend({

    treeTypes: ['cat','page'],

    events: _.extend({}, categoryEditor.events, {
      'click .wysiwyg':             'queueActiveLeafUpdate',
      'click .cancel-btn':          'discardActiveLeafChanges'
    }),

    init: function (widget) {
      this.AddItemDialog = AddItemDialog;

      _.bindAll(this,'queueActiveLeafUpdate','refreshViews','markStylesAsDirty');
      this.bind('wysiwyg-change',this.queueActiveLeafUpdate);
      this.bind('wysiwyg-paste',this.markStylesAsDirty);
    },

    onStopEditing: function () {
      delete this.updateTimeoutId;
    },

    onEditStart: function (resetChanges, firstEdit) {
      categoryEditor.onEditStart.call(this, resetChanges, firstEdit);
      if (this.widget.hasLeafOnTop()) {
        this.$('#jeditor').text(this.widget.getCurrentNode()._data.content);
        util.spawnJEditor();
        // clear changes a bit after to ignore initialization changes
        var self = this;
        setTimeout(function () { self.setChanged('leaf-content', false); }, 400);
      }
    },

    delegateItemDialog: function (item_id) {
      if (this.widget.getNodeById(item_id)._data.type === 'rss-feed') {
        this.itemDialog = this.rssDialog ||
                          new util.widgetEditor.AddItemDialog({ model:this.widget });
        this.rssDialog = this.itemDialog;
      }
      else {
        this.itemDialog = this.pageDialog || new AddItemDialog({ model:this.widget });
        this.pageDialog = this.itemDialog;
      }
    },

    editItem: function (item_id) {
      this.delegateItemDialog(item_id);
      categoryEditor.editItem.call(this, item_id);
    },

    addItem: function (item_id) {
      this.delegateItemDialog(item_id);
      categoryEditor.addItem.call(this, item_id);
    },

    accept: function () {
      if (this.widget.hasLeafOnTop()) {

        if (this.updateTimeoutId) {
          // update content before proceeding
          clearTimeout(this.updateTimeoutId);
          if ( $('#jeditor').data('wysiwyg').viewHTML ) {
            $('#jeditor-wrapper .toolbar .html').click();
          }
          this.updateActiveLeaf();
        }

        var node = this.widget.getCurrentNode()
          , wphotoUrl = util.largerWphoto(node._data.wphotoUrl)
          , content = node._data.content
        ;
        // if thumbnail image does not exist in the page,
        // then remove the thumbnail from being displayed.
        if (content.indexOf(wphotoUrl) === -1) {
          delete node._data.wphotoUrl;
        }
      }
      categoryEditor.accept.call(this);
    },

    transitionBack: function (e) {
      // transition to the previous page by emulating a click
      mapp.getActivePage().find('.back-btn').click();
    },

    onBackBtnClick: function (e) {
      if ( !this.hasChanges() ) {
        return true;
      }
      else if ( !confirm(unsavedChangesText) ) {
        this.discardActiveLeafChanges();
        return true;
      }
      else {
        // user decided not to discard their page changes
        return false;
      }
    },

    queueActiveLeafUpdate: function () {
      clearTimeout(this.updateTimeoutId);

      var self = this
        , delay = this.areStylesDirty ? 350 : 1200
      ;
      this.updateTimeoutId = setTimeout(function () {
        if ( !self.widget.hasLeafOnTop() ||
             $('#jeditor').data('wysiwyg').viewHTML == true)
        {
          return;
        }
        self.updateActiveLeaf();
        delete self.updateTimeoutId;
      }, delay);
    },

    updateActiveLeaf: function () {
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
        this.setChanged('leaf-content',true);
      }
    },

    markStylesAsDirty: function () {
      this.areStylesDirty = true;
      this.queueActiveLeafUpdate();
    },

    discardActiveLeafChanges: function () {
      if (!this.widget.hasLeafOnTop()) return;

      var level = this.widget.getCurrentLevel(true)
        , origLevel = this.widget.getCurrentLevel(true,this.widget.origStruct)
        , leaf = level._data
        , origLeaf = origLevel._data
      ;
      if (!origLevel || !origLeaf) return;
      leaf.content = origLeaf.content;
      this.setChanged('leaf-content',false);
      this.setChanged('thumb',false);
      this.refreshViews({ forceEditAreaRefresh:true });
    }

  });


  window.widgetPages.page_tree = window.widgetPages.category.extend({

    events: {
      'click .category.cat-title':       'onCategoryClick',
      'click .category.page-title':      'onCategoryClick',
      'click .category.rss-feed-title':  'onItemClick'
    }
  });


  // =================================
  // we're actually modifying leaf names instead of cats. Code reuse ftw!
  var AddItemDialog = window.AddCatDialog.extend({
    type: 'page',

    getTypeName: function () {
      var node = this.model.getCurrentNode()
      util.log('TYPE NAAAME',node);
      if (node._data.type === 'rss-feed')
        return 'RSS Feed';
      else
        return this.model.get('itemTypeName');
    }
  });

})(jQuery);


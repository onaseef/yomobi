//
// BUILDER
//
(function ($) {

  var defaultPageContent = '';
  var tempCatStack = [];

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

    validate: categoryBuilder.validate
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
        util.spawnJEditor();
        // clear changes a bit after to ignore initialization changes
        var self = this;
        setTimeout(function () { self.setChanged('leaf-content', false); }, 400);
      }
    },
    
    accept: function () {
      if (this.widget.hasLeafOnTop()) {

        if (this.updateTimeoutId) {
          // update content before proceeding
          clearTimeout(this.updateTimeoutId);
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
        self.updateActiveLeaf();
        delete self.updateTimeoutId;
      }, delay);
    },
    
    updateActiveLeaf: function () {
      var level = this.widget.getCurrentLevel(true)
        , leaf = level._data
        , oldContent = leaf.content
      ;
      leaf.content = $('#jeditor').wysiwyg('getContent');
      if (this.areStylesDirty) {
        leaf.content = util.stripAllStyles(leaf.content);

        $('#jeditor').wysiwyg('setContent', leaf.content);
        
        this.areStylesDirty = false;
      }
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
      'click .item.category':       'onCategoryClick',
      'click .item.leaf-name':      'onCategoryClick'
    }
  });


  // =================================
  // we're actually modifying leaf names instead of cats. Code reuse ftw!
  var AddItemDialog = window.AddCatDialog.extend({
    type: 'page',

    getTypeName: function () {
      return this.model.get('itemTypeName');
    }
  });

})(jQuery);


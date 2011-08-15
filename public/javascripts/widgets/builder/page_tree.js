//
// BUILDER
//
(function ($) {

  var defaultPageContent = '<p>[Change Me]</p>';
  var tempCatStack = [];

  var super_getEditAreaData = window.Widget.prototype.getEditAreaData;
  window.widgetClasses.page_tree = window.widgetClasses.page_tree.extend({
    
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

    getEditData: function () {
      var showData = this.getShowData()
        , areItemsEmpty = false
        , areCatsEmpty = false
      ;
      if (!showData.isLeaf) {
        if (showData.items.length === 0) {
          showData.items = [{ name:'--None (Click the Add button below)--' }];
          areItemsEmpty = true;
        }
        if (showData.cats.length === 0) {
          showData.cats = ['--None (Click the Add button below)--'];
          areCatsEmpty = true;
        }
      }
      else {
        var leafName = _.last(this.catStack);
      }
      
      var extraData = {
        currentCat: util.catName(_.last(this.catStack)) || this.get('prettyName'),
        catCrumbs: util.catStackCrumbs(this.get('prettyName'),this.catStack),
        onHomePage: mapp.pageLevel === 0,
        areItemsEmpty: areItemsEmpty,
        areCatsEmpty: areCatsEmpty,
        catLabel: util.pluralize( this.get('catTypeName') ),
        itemLabel: util.pluralize( this.get('itemTypeName') ),
        isWidgetPageTree: true,
        itemIconName: 'leaf'
      };
      return _.extend({},showData,extraData);
    },
    
    onHomeViewClick: function () {
      tempCatStack = [];

      bapp.homeViewWidgetClick(this);
      return false;
    },
    
    onSave: function () {
      this.origStruct = util.clone(this.get('struct'));
    }
  });

  window.widgetEditors.page_tree = window.widgetEditors.category.extend({

    AddItemDialog: AddItemDialog,

    events: {
      'click input[name=beginEditing]':     'enterEditMode',
      'click input[name=back]':             'transitionBack',

      'click input[name=add_cat]':          'addCat',
      'click input[name=edit_cat]':         'editCat',
      'dblclick select[name=cats]':         'editCat',
      'click input[name=rename_cat]':       'renameCat',
      'click input[name=rem_cat]':          'remCat',
      'click input[name=up_cat]':           'moveCat',
      'click input[name=down_cat]':         'moveCat',

      'click input[name=add_item]':         'addItem',
      'click input[name=rem_item]':         'remItem',
      'click input[name=edit_item]':        'editItem',
      'dblclick select[name=items]':        'editItem',
      'click input[name=rename_item]':      'renameItem',
      'click input[name=up_item]':          'moveItem',
      'click input[name=down_item]':        'moveItem',
      
      'click .wysiwyg':                     'queueActiveLeafUpdate',
      'click .cancel-btn':                  'discardActiveLeafChanges'
    },
    
    init: function (widget) {
      // this is needed for proper inheritance due to closures
      this.AddItemDialog = AddItemDialog;

      _.bindAll(this,'queueActiveLeafUpdate','refreshViews','markStylesAsDirty');
      this.bind('wysiwyg-change',this.queueActiveLeafUpdate);
      this.bind('wysiwyg-paste',this.markStylesAsDirty);
    },

    // the button that activates this should only be available on the home page
    enterEditMode: function () {
      mapp.viewWidget(this.widget);
      this.startEditing();
    },

    onEditStart: function (resetChanges) {
      if (resetChanges) this.discardChanges();

      this.widget.catStack = tempCatStack;
      if (this.widget.hasLeafOnTop()) util.spawnJEditor();
    },
    
    addItem: function (e,error) {
      if (!util.isUIFree()) return;

      var self = this;
      var dialog =  new this.AddItemDialog({
        model: this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.enterMode('add').prompt();
    },
    
    editItem: function (e) {
      // simply transition into subcat by emulating a click
      var idx = $(this.el).find('select[name=items] option:selected:first').index();
      $(this.widget.pageView.el).find('.leaf-name:eq('+idx+')').click();
      if (idx == -1) alert('Please select an item to edit.');
    },

    renameItem: function (e) {
      if (!util.isUIFree()) return;

      var self = this
        , level = this.widget.getCurrentLevel()
        , name = $(this.el).find('select[name=items] option:selected:first').html()
        , item = _.detect(level._items,function (i) { return i.name == name })
      ;
      if (_.isEmpty(item)) return alert('Please select an item to rename.');
      
      var dialog =  new this.AddItemDialog({
        model: this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.enterMode('edit').prompt(null,item.name);
    },

    queueActiveLeafUpdate: function () {
      if (!this.updateTimeoutId) {
        var self = this;
        this.updateTimeoutId = setTimeout(function () {
          self.updateActiveLeaf();
          delete self.updateTimeoutId;
        },350);
      }
    },
    
    updateActiveLeaf: function () {
      var level = this.widget.getCurrentLevel()
        , leafName = _.last(this.widget.catStack)
        , leaf = _.detect(level._items, function (i) { return i.name == leafName; })
      ;
      leaf.content = $('#jeditor').val();
      if (this.areStylesDirty) {
        leaf.content = util.stripAllStyles(leaf.content);
        $('#jeditor').data('wysiwyg').setContent(leaf.content);
        this.areStylesDirty = false;
      }
      this.widget.pageView.refresh();
      mapp.resize();
      this.setChanged('leaf-content',true);
    },

    markStylesAsDirty: function () {
      this.areStylesDirty = true;
    },

    discardActiveLeafChanges: function () {
      if (!this.widget.hasLeafOnTop()) return;

      var level = this.widget.getCurrentLevel()
        , origLevel = this.widget.getCurrentLevel(this.widget.origStruct)
        , leaf = this.widget.getCurrentLeaf(level)
        , origLeaf = this.widget.getCurrentLeaf(origLevel)
      ;
      if (!origLevel || !origLeaf) return;
      leaf.content = origLeaf.content;
      this.setChanged('leaf-content',false);
      this.refreshViews({ forceEditAreaRefresh:true });
    }
    
  });
  
  window.widgetPages.page_tree = window.widgetPages.page_tree.extend({

    onCategoryClick: function (e) {
      if (!mapp.canTransition()) return;

      var cat = $(e.target).attr('data-cat');
      var subpage = this.widget.catStack.join('/');
      subpage && (subpage += '/');
      
      mapp.viewWidget(this.widget, subpage + cat);
      this.widget.getEditor().startEditing();
    },
    
    onLeafNameClick: function (e) {
      if (!mapp.canTransition()) return;

      var level = this.widget.getCurrentLevel()
        , itemIdx = $(e.target).index()
        , item = level._items[itemIdx]
        , subpage = this.widget.catStack.join('/')
      ;
      subpage && (subpage += '/');
util.log('itemIdx',itemIdx,item,level);
      
      mapp.viewWidget(this.widget, subpage + item.name);
      this.widget.getEditor().startEditing();

      util.spawnJEditor();
    },
    
    // this event is only triggered by bapp,
    // thus it's only useful when declared in the builder.
    // 
    onBackBtnClick: function () {
      if (!mapp.canTransition()) return;
      
      var catStack = this.widget.catStack
        , newSubpage = _.compact(catStack.pop() && catStack).join('/')
      ;
      if (!newSubpage) mapp.transition('back');
      else mapp.viewWidget(this.widget,newSubpage);

      this.widget.getEditor().startEditing();
    },
    
    refresh: function () {
      var wpage = mapp.getActivePage().content.html(this.widget.getPageContent());
      this.widget.pageView.setContentElem(wpage);
    }
    
  });
  
  // =================================
  var AddItemDialog = window.AddCatDialog.extend({

    // we're actually modifying leaf names instead of cats. Code reuse ftw!
    getCatNames: function () {
      return _.pluck(this.level._items,'name');
    },
    addCatToStruct: function (name) {
      this.level._items.push({ name:name, content:defaultPageContent });
    },
    renameCatInStruct: function (newName) {
      var origName = this.origName;
      var targetItem = _.detect(this.level._items,function (i) { return i.name == origName });
      targetItem.name = name;
    },
    getTypeName: function () {
      return this.model.get('itemTypeName');
    }
  });

})(jQuery);


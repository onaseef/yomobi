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
        hideRemoveLink: mapp.pageLevel != 0
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
          showData.items = [{ name:'==None==' }];
          areItemsEmpty = true;
        }
        if (showData.cats.length === 0) {
          showData.cats = ['==None=='];
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
        subHelpText: util.getWidgetBData(this).subHelpText,
        isWidgetPageTree: true
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
      'click input[name=rename_cat]':       'renameCat',
      'click input[name=rem_cat]':          'remCat',
      'click input[name=up_cat]':           'moveCat',
      'click input[name=down_cat]':         'moveCat',

      'click input[name=add_item]':         'addItem',
      'click input[name=rem_item]':         'remItem',
      'click input[name=edit_item]':        'editItem',
      'click input[name=rename_item]':      'renameItem',
      'click input[name=up_item]':          'moveItem',
      'click input[name=down_item]':        'moveItem',
      
      'click .wysiwyg':                     'queueActiveLeafUpdate',
      'click .cancel-btn':                  'discardActiveLeafChanges'
    },
    
    init: function (widget) {
      // this is needed for proper inheritance due to closures
      this.AddItemDialog = AddItemDialog;

      _.bindAll(this,'queueActiveLeafUpdate','refreshViews');
      this.bind('wysiwyg-change',this.queueActiveLeafUpdate);
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
      this.widget.pageView.refresh();
      mapp.resize();
      this.setChanged('leaf-content',true);
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
        , itemIdx = $(e.target).index() - (util.catNamesFromLevel(level).length || -1) - 1 // -1 for divider elem
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
  var addItemTemplate  = util.getTemplate('add-subcat-dialog')
    , editItemTemplate = util.getTemplate('edit-subcat-dialog')
  ;
  var AddItemDialog = Backbone.View.extend({

    events: {
      'keydown input[name="cat"]':      'onKeyDown'
    },
    
    onKeyDown: function (e) {
      var code = e.keyCode || e.which;
      if (code == 13) this.validateItem();
    },
    
    initialize: function () {
      _.bindAll(this,'validateItem');
      this.addedLeaves = [];
    },

    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },
    
    render: function (error,level,name) {
      var template = (this.mode == 'add') ? addItemTemplate : editItemTemplate;

      var dialogHtml = template({
        error: error,
        cats: _.pluck(level._items,'name'),
        name: name,
        catTypeName: this.model.get('itemTypeName'),
        addedCats: this.addedLeaves
      });

      var self = this;
      $(this.el).html(dialogHtml)
        .find('.add-btn').click(function () { self.validateItem(); }).end()
        .attr('title', this.el.children[0].title)
      ;
      return this;
    },
    
    prompt: function (error,origName,keepAddedLeaves) {
      if (!keepAddedLeaves) this.addedLeaves.length = 0;

      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(error,level,origName).el
        , closeSelf = close(this)
        , buttons = {}
      ;
      // cache for later use in validateItem
      this.level = level;
      this.origName = origName;
      
      if (this.mode == 'add') buttons["Close"] = closeSelf;
      else {
        buttons["Save"] = this.validateItem;
        buttons["Cancel"] = closeSelf;
      }
      
      util.dialog(dialogContent,buttons).find('p.error').show('pulsate',{times:3});
    },
    
    validateItem: function () {
  		$(this.el).dialog("close");

      var name = $(this.el).find('input[name=cat]').val()
        , name = $.trim(name)
      ;
  		if (_.isEmpty(name))
        this.prompt('Name cannot be empty');
      else if ( name != this.origName && _.contains(_.pluck(this.level._items,'name'),name) )
        this.prompt('Name is already in use');
      else if (this.mode == 'add') {
        this.level._items.push({ name:name, content:defaultPageContent });
        this.addedLeaves.push(name);

        bapp.currentEditor.setChanged('something',true);
        this.prompt(undefined,undefined,true);
      }
      else if (this.mode == 'edit' && name !== this.origName) {
        var origName = this.origName;
        var targetItem = _.detect(this.level._items,function (i) { return i.name == origName });
        targetItem.name = name;

        bapp.currentEditor.setChanged('something',true);
        this.options.onClose && this.options.onClose();
      }
    }
  });

  var close = function (dialogView) {
    return function () {
      $(this).dialog("close");
      dialogView.options.onClose && dialogView.options.onClose();
    };
  }

})(jQuery);


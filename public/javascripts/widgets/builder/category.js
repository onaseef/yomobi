//
// BUILDER
//
(function ($) {

  var tempCatStack = [];
  var $isSelected = function (idx,elem) { return $(elem).is(':selected'); };

  var deleteConfirmText = "Are you sure you want to delete? (Data will be lost)";

  var super_getEditAreaData = window.Widget.prototype.getEditAreaData
    , super_init = window.widgetClasses.category.prototype.init
  ;
  window.widgetClasses.category = window.widgetClasses.category.extend({
    
    init: function () {
      super_init.call(this);
      this.origStruct = util.clone(this.get('struct'));
    },

    getEditAreaData: function () {
      var editAreaData = super_getEditAreaData.call(this);
      var extraData = {
        hideSaveButton: true,
        hideCancelButton: true,
        hideRemoveLink: mapp.pageLevel != 0
      };
      return _.extend({},editAreaData,extraData);
    },

    getEditData: function () {
      var showData = this.getShowData()
        , areItemsEmpty = false
        , areCatsEmpty = false
      ;
      if (showData.items.length === 0) {
        showData.items = [{ name:'--None (Click the Add button below)--' }];
        areItemsEmpty = true;
      }
      if (showData.cats.length === 0) {
        showData.cats = ['--None (Click the Add button below)--'];
        areCatsEmpty = true;
      }
      
      var extraData = {
        currentCat: util.catName(_.last(this.catStack)) || this.get('prettyName'),
        catCrumbs: util.catStackCrumbs(this.get('prettyName'),this.catStack),
        onHomePage: mapp.pageLevel === 0,
        areItemsEmpty: areItemsEmpty,
        areCatsEmpty: areCatsEmpty,
        catLabel: util.pluralize( this.get('catTypeName') ),
        itemLabel: util.pluralize( this.get('itemTypeName') ),
        subHelpText: util.getWidgetBData(this).subHelpText
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

  // ---------------------------------------------------------
  var super_accept = window.EditWidgetView.prototype.accept;
  window.widgetEditors.category = window.EditWidgetView.extend({

    events: {
      'click input[name=beginEditing]':     'enterEditMode',
      'click input[name=back]':             'transitionBack',

      'click input[name=add_cat]':          'addCat',
      'click input[name=rename_cat]':       'renameCat',
      'click input[name=edit_cat]':         'editCat',
      'click input[name=rem_cat]':          'remCat',
      'click input[name=up_cat]':           'moveCat',
      'click input[name=down_cat]':         'moveCat',

      'click input[name=add_item]':         'addItem',
      'click input[name=rem_item]':         'remItem',
      'click input[name=edit_item]':        'editItem',
      'click input[name=up_item]':          'moveItem',
      'click input[name=down_item]':        'moveItem'
    },
    
    init: function (widget) {
      // this is needed for proper inheritance due to closures
      this.AddItemDialog = AddItemDialog;
      _.bindAll(this,'refreshViews');
    },
    
    // the button that activates this should only be available on the home page
    enterEditMode: function () {
      mapp.viewWidget(this.widget);
      this.startEditing();
    },

    onEditStart: function (resetChanges) {
      if (resetChanges) this.discardChanges();
      this.widget.catStack = tempCatStack;
    },
    
    grabWidgetValues: function () {
      return { struct:this.widget.get('struct') };
    },
    
    accept: function () {
      // grab all selected indicies and make sure they're selected after save
      var catIdxs = this.el.find('select[name=cats] option').map($isSelected)
        , itemIdxs = this.el.find('select[name=items] option').map($isSelected)
        , callback = _.bind(this.selectCatsAndItems,this,catIdxs,itemIdxs)
      ;
      // first argument is an event object
      super_accept.call(this,null,callback);
    },

    remove: function () {
      if ( EditWidgetView.prototype.remove.call(this) )
        mapp.goHome();
    },
    
    cancel: function () {
      this.discardChanges();
      EditWidgetView.prototype.cancel.call(this);
      mapp.goHome();
      bapp.currentEditor.stopEditing();
    },

    discardChanges: function () {
      util.log('Discarding changes for category widget');
      this.widget.set({ struct:util.clone(this.widget.origStruct) });
      this.widget.catStack = tempCatStack;
    },

    onDiscardByNavigation: function () {
      this.discardChanges();
    },
    
    transitionBack: function (e) {
      // transition to the previous page by emulating a click
      mapp.getActivePage().find('.back-btn').click();
    },

    addCat: function (e) {
      if (!util.isUIFree()) return;

      var dialog =  new AddCatDialog({
        model: this.widget,
        onClose: this.refreshViews
      });
      dialog.enterMode('add').prompt();
    },
    
    editCat: function (e) {
      // transition into subcat by emulating a click
      var idx = $(this.el).find('select[name=cats] option:selected:first').index();
      $(this.widget.pageView.el).find('.category:eq('+idx+')').click();
      if (idx == -1) alert('Please select an item to edit.');
    },

    renameCat: function (e) {
      if (!util.isUIFree()) return;

      var level = this.widget.getCurrentLevel()
        , name = $(this.el).find('select[name=cats] option:selected:first').html()
      ;
      if (_.isEmpty(name)) return alert('Please select an item to rename.');
      
      var dialog =  new AddCatDialog({
        model: this.widget,
        onClose: this.refreshViews
      });
      dialog.enterMode('edit').prompt(null,name);
    },
    
    moveCat: function (e) {
      if (!util.isUIFree()) return;

      var mod = parseInt( $(e.target).attr('data-mod'),10 )
        , $select = $(this.el).find('select[name=cats]')
        
        , targetOption = $select.find('option:selected:first')
        , targetIdx = targetOption.index()
        , targetName = targetOption.html()
        , targetCat = targetName + '|' + targetIdx
      ;
      if (targetIdx <= 0 && mod == -1 ||
          targetIdx >= $select.find('option').length-1 && mod == 1)
      {
        return;
      }
      if (_.isEmpty(targetName))
        return alert('Please select an item to move ' + (mod==1 ? 'down.' : 'up.'));
      
      var swapIdx = targetIdx + mod
        , swapOption = $select.find('option:eq('+swapIdx+')')
        , swapName = swapOption.html()
        , swapCat = swapName + '|' + swapIdx
        , level = this.widget.getCurrentLevel()
      ;
      if (!swapName) return;
      
      // swap the categories internally
      level[targetName + '|' + swapIdx] = level[swapCat];
      level[swapName + '|' + targetIdx] = level[targetCat];
      delete level[swapCat];
      delete level[targetCat];
      
      // now swap in the editor
      (mod==1) ? targetOption.before(swapOption) : targetOption.after(swapOption);
      this.setChanged('something',true);
      this.refreshViews();
    },
    
    remCat: function (e) {
      if (!util.isUIFree()) return;

      var level = this.widget.getCurrentLevel()
        , select = this.el.find('select[name=cats]')
        , selectedItems = select.find('option:selected')
        , hasSomeSelected = selectedItems.length > 0
        , lowestDeletedIdx = 99999
      ;
      if (hasSomeSelected && !confirm(deleteConfirmText)) return;
      else if (!hasSomeSelected) return alert('Please select an item to delete.');

      selectedItems.map(function (idx,elem) {
        var catName = elem.innerHTML
          , cat = catName + '|' + $(elem).index()
        ;
        if (level[cat]) {
          delete level[cat];
          lowestDeletedIdx = Math.min($(elem).index(), lowestDeletedIdx);
        }
      });

      // reassign selected indicies
      var i = 0;
      _.each(level, function (val,cat) {

        if (cat == '_items') return;
        var orderIdx = util.catOrder(cat)
          , catName = util.catName(cat)
        ;
        if (i != orderIdx) {
          level[catName + '|' + i] = val; // shift down
          delete level[cat];
        }
        i += 1;
      });
      util.log('LEVEL',level);
      this.setChanged('something',true);

      // select the lowest deleted index
      select
        .find('option:selected').prop('selected',false).end()
        .find('option:eq('+lowestDeletedIdx+')').prop('selected',true).end()
      ;

      this.refreshViews();
    },
    
    addItem: function (e) {
      if (!util.isUIFree()) return;

      var dialog =  new this.AddItemDialog({
        model: this.widget,
        onClose: this.refreshViews
      });
      dialog.enterMode('add').prompt();
    },
    
    editItem: function (e) {
      if (!util.isUIFree()) return;

      var level = this.widget.getCurrentLevel()
        , name = $(this.el).find('select[name=items] option:selected:first').html()
        , item = _.detect(level._items,function (i) { return i.name == name })
      ;
      if (_.isEmpty(item)) return alert('Please select an item to edit.');;
      
      var dialog =  new this.AddItemDialog({
        model: this.widget,
        onClose: this.refreshViews
      });
      dialog.enterMode('edit').prompt(null,item);
    },
    
    moveItem: function (e) {
      if (!util.isUIFree()) return;

      var mod = parseInt( $(e.target).attr('data-mod'),10 )
        , $select = $(this.el).find('select[name=items]')
        , _items = this.widget.getCurrentLevel()._items
        
        , targetOption = $select.find('option:selected:first')
        , targetIdx = targetOption.index()
        , swapIdx = targetIdx + mod
        , swapOption = $select.find('option:eq('+swapIdx+')')
      ;
      if (targetIdx <= 0 && mod == -1 ||
          targetIdx >= _items.length-1 && mod == 1)
      {
        return;
      }
      if (swapIdx >= _items.length)
        return alert('Please select an item to move ' + (mod==1 ? 'down.' : 'up.'));
      
      // first swap internally
      _items.swap(targetIdx,swapIdx);
      
      // now swap in the editor
      (mod==1) ? targetOption.before(swapOption) : targetOption.after(swapOption);
      this.setChanged('something',true);
      this.refreshViews();
    },
    
    remItem: function (e) {
      var level = this.widget.getCurrentLevel()
        , select = this.el.find('select[name=items]')
        , selectedItems = select.find('option:selected')
        , hasSomeSelected = selectedItems.length > 0
        , lowestDeletedIdx = 99999
      ;
      if (hasSomeSelected && !confirm(deleteConfirmText)) return;
      else if (!hasSomeSelected) return alert('Please select an item to delete.');

      selectedItems.map(function (idx,elem) {
        var itemName = elem.innerHTML
          , itemIdx = _.indexOf(_.pluck(level._items,'name'),itemName)
        ;
        if (itemIdx != -1) {
          level._items.splice(itemIdx,1);
          bapp.currentEditor.setChanged('something',true);
          lowestDeletedIdx = Math.min($(elem).index(), lowestDeletedIdx);
        }
      });
      // reassign selected indicies
      select
        .find('option:selected').prop('selected',false).end()
        .find('option:eq('+lowestDeletedIdx+')').prop('selected',true).end()
      ;
      this.refreshViews();
    },
    
    refreshViews: function (options) {
      this.widget.pageView.refresh();
      mapp.resize();
      if (this.hasChanges()) this.accept();
      else if (options && options.forceEditAreaRefresh) this.startEditing();
    },

    selectCatsAndItems: function (catIdxs,itemIdxs) {
      if (catIdxs)
        this.el.find('select[name=cats] option').each(function (idx,elem) {
          if (catIdxs[idx] === true) elem.selected = 'selected';
        });
      if (itemIdxs)
        this.el.find('select[name=items] option').each(function (idx,elem) {
          if (itemIdxs[idx] === true) elem.selected = 'selected';
        });
    }
    
  });
  
  window.widgetPages.category = window.widgetPages.category.extend({

    onCategoryClick: function (e) {
      if (!mapp.canTransition()) return;

      var cat = $(e.target).attr('data-cat');
      var subpage = this.widget.catStack.join('/');
      subpage && (subpage += '/');
      
      mapp.viewWidget(this.widget, subpage + cat);
      this.widget.getEditor().startEditing();
    },
    
    // this event is only triggered by bapp,
    // thus it's only useful when declared in the builder.
    // 
    onBackBtnClick: function () {
      if (!mapp.canTransition()) return;

      var catStack = this.widget.catStack
        , newSubpage = _.compact(catStack.pop() && catStack).join('/')
      ;
      if (!newSubpage) {
        mapp.transition('back');
      }
      else mapp.viewWidget(this.widget,newSubpage);

      this.widget.getEditor().startEditing();
    },
    
    refresh: function () {
      var pcontent = this.widget.getPageContent();
      var wpage = mapp.getActivePage().content.html(pcontent);
      this.widget.pageView.setContentElem(wpage);
    }
    
  });
  
  ////////////////////////////
  // private helper classes //
  ////////////////////////////
  var addCatTemplate  = util.getTemplate('add-subcat-dialog')
    , editCatTemplate = util.getTemplate('edit-subcat-dialog')
  ;
  window.AddCatDialog = Backbone.View.extend({

    events: {
      'keydown input[name="cat"]':      'onKeyDown'
    },
    
    onKeyDown: function (e) {
      var code = e.keyCode || e.which;
      if (code == 13) this.validateCategory();
    },
    
    initialize: function () {
      _.bindAll(this,'validateCategory');
    },

    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },
    
    render: function (error,level,name) {
      var template = (this.mode == 'add') ? addCatTemplate : editCatTemplate;

      var dialogHtml = template({
        error: error,
        name: name,
        cats: util.sortedCatNamesFromLevel(level),
        catTypeName: this.model.get('catTypeName')
      });

      var self = this;
      $(this.el).html(dialogHtml).find('.add-btn')
        .click(function () { self.validateCategory(); }).end()
        .attr('title',this.el.children[0].title)
      ;
      return this;
    },
    
    prompt: function (error,origName,keepAddedItems) {
      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(error,level,origName).el
        , closeSelf = close(this)
        , buttons = {}
      ;
      // cache for later use in validateCategory
      this.level = level;
      this.origName = origName;
      
      if (this.mode == 'add') buttons["Done"] = closeSelf;
      else {
        buttons["Save"] = this.validateCategory;
        buttons["Cancel"] = closeSelf;
      }
      
      util.dialog(dialogContent,buttons).find('p.error').show('pulsate',{times:3});
    },
    
    validateCategory: function () {
  		$(this.el).dialog("close");

      var name = $(this.el).find('input[name=cat]').val()
        , name = $.trim(name)
      ;
  		if (_.isEmpty(name))
  		  this.prompt('Name cannot be empty');
      else if ( name != this.origName && _.contains(util.catNamesFromLevel(this.level),name) )
        this.prompt('Name is already in use');
      else if (this.mode == 'add') {
        var keyCount = _.keys(this.level).length;
        this.level[name+'|'+(keyCount-1)] = {_items:[]};
        bapp.currentEditor.setChanged('something',true);
        this.prompt();
      }
      else if (this.mode == 'edit' && name !== this.origName) {
        var origCat = util.fullCatFromName(this.level,this.origName)
          , order = util.catOrder(origCat)
        ;
        this.level[name+'|'+order] = this.level[origCat];
        delete this.level[origCat];

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
  
  // =================================
  var AddItemDialog = Backbone.View.extend({
    
    initialize: function () {
      this.template = util.getTemplate(this.model.get('name')+'-item-dialog');
      this.addedItems = [];
    },
    
    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },
    
    render: function (flash,level,item) {
      flash || (flash = {});
      item || (item = {});
      var title = (this.mode == 'add' ? "Add New " : "Edit ") + this.model.get('itemTypeName');
      var dialogHtml = this.template(_.extend({},item, {
        flash: flash,
        _items: level._items,
        itemTypeName: this.model.get('itemTypeName'),
        addedItems: this.addedItems,
        mode: this.mode
      }) );

      $(this.el).html(dialogHtml).attr('title',title);
      return this;
    },
    
    prompt: function (flash,item,keepAddedItems) {
      if (!keepAddedItems) this.addedItems.length = 0;

      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(flash,level,item).el
      ;
      // cache for later use
      this.level = level;
      
      var buttons = {
        "Done": function () {
          $(this).dialog("close");
          self.options.onClose && self.options.onClose();
        }
      };

      var saveItem = function () {
        $(this).dialog("close");
        var activeItemData = {};
        $(self.el).find('.item-input').each(function (idx,elem) {
          activeItemData[$(elem).attr('name')] = $(elem).val();
        });
        
        if (!self.validateItem(activeItemData)) return;
        
        if (self.mode == 'add') {
          level._items.push(activeItemData);
          self.addedItems.push(activeItemData.name);
          self.prompt({ success:'Item added successfully' },undefined,true);

          bapp.currentEditor.setChanged('something',true);
        }
        else if (self.mode == 'edit') {
          var oldItem = _.detect(level._items,function (i) { return i.name == item.name });
          _.extend(oldItem,activeItemData);

          bapp.currentEditor.setChanged('something',true);
          self.options.onClose && self.options.onClose();
        }
      }

      if (this.mode == 'edit') {
        buttons["Save"] = saveItem;
        buttons["Cancel"] = buttons["Done"]; delete buttons["Done"];
      }

      util.dialog(dialogContent, buttons)
        .find('p.error').show('pulsate',{times:3}).end()
        .find('p.success').show('pulsate',{times:1}).end()
        .find('input[name=add]').click(saveItem).end()
      ;
    },
    
    validateItem: function (item) {
  		$(this.el).dialog("close");

      var name = $.trim(item.name);
  		if (_.isEmpty(name)) {
  		  this.prompt({ error:'Name cannot be empty' },item,true);
  		  return false;
  		}
      else if (this.mode == 'add' && _.include(this.level._items,name)) {
        this.prompt({ error:'Name is already in use' },item,true);
        return false;
      }
      return true;
    }
  });

})(jQuery);


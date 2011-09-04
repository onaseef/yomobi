//
// BUILDER
//
(function ($) {

  var tempCatStack = [];
  var $isSelected = function (idx,elem) { return $(elem).is(':selected'); };
  var downcase = function (str) { return str.toLowerCase(); };

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
        hideRemoveLink: mapp.pageLevel !== 0,
        hideHelpText: mapp.pageLevel !== 0
      };
      return _.extend({},editAreaData,extraData);
    },

    getEditData: function () {
      var showData = this.getShowData()
        , isThereStuff = true
      ;
      if (showData.stuff.length === 0) {
        showData.stuff = [{ name:'--None (Click the Add button below)--' }];
        isThereStuff = false;
      }
      
      var extraData = {
        currentCat: util.topCatName(this.catStack) || this.get('name'),
        catCrumbs: util.catStackCrumbs(this.get('name'),this.catStack),
        onHomePage: mapp.pageLevel === 0,
        isThereStuff: isThereStuff,
        catLabel: this.get('catTypeName'),
        itemLabel: this.get('itemTypeName'),
        itemIconName: 'leaf'
      };
      return _.extend({},showData,extraData);
    },
    
    onHomeViewClick: function () {
      tempCatStack = [ this.get('struct') ];
      
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
      'click input[name=rename]':           'rename',
      'click input[name=edit]':             'edit',
      'dblclick select[name=stuff]':        'edit',
      'click input[name=rem_cat]':          'remCat',
      'click input[name=up_cat]':           'moveCat',
      'click input[name=down_cat]':         'moveCat',

      'click input[name=add_item]':         'addItem',
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
      var select = this.el.find('select[name=stuff]')
        , selectedIdxs = select.find('option').map($isSelected)
        , scrollTop = select.scrollTop()
        , callback = _.bind(this.selectStuff,this,selectedIdxs,scrollTop)
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

      this.catDialog = this.catDialog || new AddCatDialog();
      this.catDialog.model = this.widget;
      this.catDialog.options = {
        onClose: this.refreshViews
      };

      this.catDialog.enterMode('add').prompt();
    },
    
    edit: function (e) {
      // transition into subcat by emulating a click
      var target = $(this.el).find('select[name=stuff] option:selected:first')
        , idx = target.index()
        , type = target.data('type')
        , id = target.val()
      ;
      if (idx === -1) return alert('Please select an item to edit.');

      if (type === 'cat') {
        $(this.widget.pageView.el).find('.category:eq('+idx+')').click();
      }
      else {
        this.editItem(id);
      }
    },

    rename: function (e) {
      if (!util.isUIFree()) return;

      var level = this.widget.getCurrentLevel(true)
        , target_id = $(this.el).find('select[name=stuff] option:selected:first').val()
        , node = level[target_id]._data
      ;
      if (!node) return alert('Please select an item to rename.');
      
      this.catDialog = this.catDialog || new AddCatDialog();
      this.catDialog.model = this.widget;
      this.catDialog.options = {
        onClose: this.refreshViews,
        node_id: node._id
      };

      this.catDialog.enterMode('edit').prompt(null,node.name);
    },
    
    moveCat: function (e) {
      if (!util.isUIFree()) return;

      var mod = parseInt( $(e.target).attr('data-mod'),10 )
        , $select = $(this.el).find('select[name=stuff]')
        , targetOption = $select.find('option:selected:first')
        , targetIdx = targetOption.index()
        , target_id = targetOption.val()
      ;
      util.log('mod',mod,targetIdx,target_id);
      if (targetIdx <= 0 && mod == -1 ||
          targetIdx >= $select.find('option').length-1 && mod == 1)
      {
        return;
      }
      if (!target_id)
        return alert('Please select an item to move ' + (mod==1 ? 'down.' : 'up.'));
      
      var swapIdx = targetIdx + mod
        , swapOption = $select.find('option:eq('+swapIdx+')')
        , swap_id = swapOption.val()
        , level = this.widget.getCurrentLevel(true)
        , order = level._data._order
      ;
      if (!swap_id) return;
      
      // swap the categories internally
      var tmp = order[targetIdx];
      order[targetIdx] = order[swapIdx];
      order[swapIdx] = tmp;
      
      // now swap graphically in the editor
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

      this.itemDialog = this.itemDialog || new AddItemDialog({ model:this.widget });
      this.itemDialog.options = {
        onClose: this.refreshViews
      };

      this.itemDialog.enterMode('add').prompt();
    },
    
    editItem: function (item_id) {
      if (!util.isUIFree()) return;
      util.log('Editing item');

      var level = this.widget.getCurrentLevel(true)
        , item = level[item_id]._data
      ;
      if (_.isEmpty(item)) return alert('Please select an item to edit.');
      
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

    selectStuff: function (selectedIdxs,scrollTop) {
      this.el.find('select[name=stuff]')
        .find('option')
          .each(function (idx,elem) {
            if (selectedIdxs[idx] === true) elem.selected = 'selected';
          })
          .end()
        .scrollTop(scrollTop)
      ;
    }
    
  });
  
  window.widgetPages.category = window.widgetPages.category.extend({

    onCategoryClick: function (e) {
      if (!mapp.canTransition()) return;

      var cat_id = $(e.target).data('id');
      
      mapp.viewWidget(this.widget, cat_id);
      this.widget.getEditor().startEditing();
    },
    
    // this event is only triggered by bapp,
    // thus it's only useful when declared in the builder.
    // 
    onBackBtnClick: function () {
      if (!mapp.canTransition()) return;

      var catStack = this.widget.catStack;

      if (catStack.length === 1) {
        mapp.goHome();
      }
      else {
        catStack.pop();
        var subpage = (catStack.length === 1) ? null : _.last(catStack)._data._id;
        mapp.viewWidget(this.widget, subpage);
      }

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
      if (code == 13) this.validateCategory(true);
    },
    
    initialize: function () {
      _.bindAll(this,'validateCategory');
      this.addedCats = [];
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
        typeName: this.getTypeName(),
        addedCats: this.addedCats
      });

      var self = this;
      $(this.el).html(dialogHtml).find('.add-btn')
        .click(function () { self.validateCategory(true); }).end()
        .attr('title',this.el.children[0].title)
      ;
      return this;
    },
    
    prompt: function (error,origName,keepAddedCats) {
      if (!keepAddedCats) this.addedCats.length = 0;

      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(error,level,origName).el
        , closeSelf = close(this)
        , buttons = {}
      ;
      // cache for later use in validateCategory
      this.level = level;
      if (!error) this.origName = origName;

      var makeSaveFunc = function (addAnother) {
        return function () {
          $(this).dialog("close");
          self.validateCategory(addAnother);
        }
      }
      
      buttons["Save"] = makeSaveFunc();
      buttons["Cancel"] = closeSelf;
      
      var dialog = util.dialog(dialogContent,buttons)
        .find('p.error').show('pulsate',{times:3}).end()
        .find('input[name=add]').click( makeSaveFunc(true) ).end()
      ;
      // required for ie7
      setTimeout(function () { dialog.find('input[type=text]').focus()[0].focus(); },10);
    },
    
    validateCategory: function (addAnother) {
  		$(this.el).dialog("close");

      var name = $(this.el).find('input[name=cat]').val()
        , name = $.trim(name)
        , name = name.replace(/\|/g,'')

        , nameCompare = name.toLowerCase()
        , origNameCompare = (this.origName || '').toLowerCase()
        , existingNames = _.map(this.getCatNames(), downcase)
      ;
      if (_.isEmpty(name) && this.addedCats.length > 0 && addAnother !== true)
        this.options.onClose && this.options.onClose();
  		else if (_.isEmpty(name))
  		  this.prompt('Name cannot be empty',undefined,true);
      else if ( nameCompare !== origNameCompare && _.contains(existingNames,nameCompare) )
        this.prompt('Name is already in use',name,true);
      else if (this.mode == 'add') {
        this.addCatToStruct(name);
        this.addedCats.push(name);

        bapp.currentEditor.setChanged('something',true);
        if (addAnother)
          this.prompt(undefined,undefined,true);
        else
          this.options.onClose && this.options.onClose();
      }
      else if (this.mode == 'edit' && name !== this.origName) {
        this.renameNode(name);

        bapp.currentEditor.setChanged('something',true);
        this.options.onClose && this.options.onClose();
      }
    },

    getCatNames: function () {
      return _.pluck(this.level._items, 'name');
    },

    addCatToStruct: function (name) {
      var level = this.level._ref
        , level_id = level._data._id
        , cat_id = util.generateId()
        , newPath = this.model.paths[ level_id ].concat([cat_id])
        , newCat = {
          _data: { _id:cat_id, type:'cat', name:name, _order:[] }
        }
      ;
      level[cat_id] = newCat;
      this.model.paths[cat_id] = newPath;
      level._data._order.push(cat_id);
    },

    renameNode: function (newName) {
      if (!this.options.node_id) return;

      var node = this.level._ref[this.options.node_id];
      node._data.name = newName;
    },

    getTypeName: function () {
      return this.model.get('catTypeName');
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
      this.template = util.getTemplate(this.model.get('wsubtype')+'-item-dialog');
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
      if (!flash || !flash.error) this.origItem = item;
      
      var buttons = {};
      var closeFunc = function () {
        $(this).dialog("close");
        self.options.onClose && self.options.onClose();
      };

      var makeSaveFunc = function (addAnother) {
        return function () {
          $(this).dialog("close");
          self.saveItem(addAnother);
        }
      }

      buttons["Save"] = makeSaveFunc();
      buttons["Cancel"] = closeFunc;

      var dialog = util.dialog(dialogContent, buttons)
        .find('p.error').show('pulsate',{times:3}).end()
        .find('p.success').show('pulsate',{times:1}).end()
        .find('input[name=add]').click( makeSaveFunc(true) ).end()
      ;
      // required for ie7
      setTimeout(function () { dialog.find('input[type=text]')[0].focus()[0].focus(); },10);
    },
    
    validateItem: function (item) {
  		$(this.el).dialog("close");

      var name = $.trim(item.name)
        , nameCompare = name.toLowerCase()
        , origNameCompare = (this.origItem || {name:''}).name.toLowerCase()
        , existingNames = _.map(_.pluck(this.level._items,'name'), downcase)
      ;
  		if (_.isEmpty(name)) {
  		  this.prompt({ error:'Name cannot be empty' },item,true);
  		  return false;
  		}
      else if (nameCompare !== origNameCompare && _.include(existingNames,nameCompare)) {
        this.prompt({ error:'Name is already in use' },item,true);
        return false;
      }
      return true;
    },

    saveItem: function (addAnother) {
      var activeItemData = {};
      $(this.el).find('.item-input').each(function (idx,elem) {
        activeItemData[$(elem).attr('name')] = $(elem).val();
      });
      
      var vals = _.compact(_.values(activeItemData));
      if (vals.length === 0 && this.addedItems.length > 0 && addAnother !== true)
        return this.options.onClose && this.options.onClose();
      if (!this.validateItem(activeItemData)) return;
      
      if (this.mode == 'add') {
        this.level._items.push(activeItemData);
        this.addedItems.push(activeItemData.name);
        bapp.currentEditor.setChanged('something',true);

        if (addAnother === true)
          this.prompt({ success:'Item added successfully' },undefined,true);
        else
          this.options.onClose && this.options.onClose();
      }
      else if (this.mode == 'edit') {
        var origItem_id = this.origItem._id;
        var oldItem = _.detect(this.level._items, function (i) {
          return i._id == origItem_id
        });
        _.extend(oldItem,activeItemData);

        bapp.currentEditor.setChanged('something',true);
        this.options.onClose && this.options.onClose();
      }
    }
  });

})(jQuery);


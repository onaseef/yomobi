//
// BUILDER
//
(function ($) {

  window.widgetClasses.category = window.widgetClasses.category.extend({
    
    getEditData: function () {
      var showData = this.getShowData();
      if (showData.items.length === 0) showData.items = [{ name:'==None==' }];
      if (showData.cats.length === 0) showData.cats = ['==None=='];
      
      var extraData = {
        currentCat: _.last(this.catStack) || this.get('prettyName')
      };
      return _.extend({},showData,extraData);
    },
    
    onHomeViewClick: function () {
      util.log('this',this);
      mapp.viewWidget(this);
      
      bapp.homeViewWidgetClick(this);
      return false;
    },
    
    onSave: function () {
      this.origStruct = util.clone(this.get('struct'));
    }
  });

  window.widgetEditors.category = window.EditWidgetView.extend({

    events: {
      'click input[name=add_cat]':          'addCat',
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
    },
    
    onEditStart: function () {
      var self = this;
    },
    
    grabWidgetValues: function () {
      return { struct:this.widget.get('struct') };
    },
    
    remove: function () {
      if ( EditWidgetView.prototype.remove.call(this) )
        mapp.goHome();
    },
    
    cancel: function () {
      this.widget.set({ struct:util.clone(this.widget.origStruct) });
      EditWidgetView.prototype.cancel.call(this);
      this.widget.catStack = [];
      mapp.goHome();
      bapp.currentEditor.stopEditing();
    },
    
    addCat: function (e) {
      var self = this;
      var dialog =  new AddCatDialog({
        model: this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.enterMode('add').prompt();
    },
    
    editCat: function (e) {
      var self = this
        , level = this.widget.getCurrentLevel()
        , name = $(this.el).find('select[name=cats] option:selected:first').html()
      ;
      if (_.isEmpty(name)) return;
      
      var dialog =  new AddCatDialog({
        model: this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.enterMode('edit').prompt(null,name);
    },
    
    moveCat: function (e) {
      var mod = parseInt( $(e.target).attr('data-mod') )
        , $select = $(this.el).find('select[name=cats]')
        
        , targetOption = $select.find('option:selected:first')
        , targetIdx = targetOption.index()
        , targetName = targetOption.html()
        , targetCat = targetName + '|' + targetIdx
      ;
      if (_.isEmpty(targetName)) return;
      
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
      this.refreshViews();
      $(this.el).find('select[name=cats] option').get(swapIdx).selected = 'selected';
    },
    
    remCat: function (e) {
      var level = this.widget.getCurrentLevel();
      this.el.find('select[name=cats] option:selected').map(function (idx,elem) {
        var cat = elem.innerHTML;
        if (level[cat]) delete level[cat];
      });
      this.refreshViews();
    },
    
    addItem: function (e) {
      var self = this;
      var dialog =  new this.AddItemDialog({
        model: this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.enterMode('add').prompt();
    },
    
    editItem: function (e) {
      var self = this
        , level = this.widget.getCurrentLevel()
        , name = $(this.el).find('select[name=items] option:selected:first').html()
        , item = _.detect(level._items,function (i) { return i.name == name })
      ;
      if (_.isEmpty(item)) return;
      
      var dialog =  new this.AddItemDialog({
        model: this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.enterMode('edit').prompt(null,item);
    },
    
    moveItem: function (e) {
      var mod = parseInt( $(e.target).attr('data-mod') )
        , $select = $(this.el).find('select[name=items]')
        , _items = this.widget.getCurrentLevel()._items
        
        , targetOption = $select.find('option:selected:first')
        , targetIdx = targetOption.index()
        , swapIdx = targetIdx + mod
        , swapOption = $select.find('option:eq('+swapIdx+')')
      ;
      if (swapIdx < 0 || swapIdx >= _items.length) return;
      
      // first swap internally
      _items.swap(targetIdx,swapIdx);
      
      // now swap in the editor
      (mod==1) ? targetOption.before(swapOption) : targetOption.after(swapOption);
      this.refreshViews();
      $(this.el).find('select[name=items] option').get(swapIdx).selected = 'selected';
    },
    
    remItem: function (e) {
      var level = this.widget.getCurrentLevel();
      this.el.find('select[name=items] option:selected').map(function (idx,elem) {
        var itemName = elem.innerHTML
          , itemIdx = _.indexOf(_.pluck(level._items,'name'),itemName);
        if (itemIdx != -1)
          level._items.splice(itemIdx,1);
      });
      this.refreshViews();
    },
    
    refreshViews: function () {
      this.widget.editor.startEditing();
      this.widget.pageView.refresh();
    }
    
  });
  
  window.widgetPages.category = window.widgetPages.category.extend({

    onCategoryClick: function (e) {
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
      var catStack = this.widget.catStack
        , newSubpage = _.compact(catStack.pop() && catStack).join('/')
      ;
      this.widget.getEditor().startEditing();
      
      if (!newSubpage) return mapp.transition('back');
      mapp.viewWidget(this.widget,newSubpage);
    },
    
    refresh: function () {
      var wpage = mapp.getActiveWidgetPage().content.html(this.widget.getPageContent());
      this.widget.pageView.setContentElem(wpage);
    }
    
  });
  
  ////////////////////////////
  // private helper classes //
  ////////////////////////////
  window.AddCatDialog = Backbone.View.extend({

    addCatTemplate: util.getTemplate('add-subcat-dialog'),

    events: {
      'keydown input[name="cat"]':      'onKeyDown'
    },
    
    onKeyDown: function (e) {
      var code = e.keyCode || e.which;
      if (code == 13) this.validateCategory();
    },
    
    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },
    
    render: function (error,level,name) {
      var dialogHtml = this.addCatTemplate({
        error: error,
        cats: util.catNamesFromLevel(level),
        name: name
      });
      $(this.el).html(dialogHtml);
      return this;
    },
    
    prompt: function (error,origName) {
      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(error,level,origName).el
        , buttons = {}
        , closeSelf = close(this)
      ;
      // cache for later use
      this.level = level;
      this.origName = origName;
      
      if (this.mode == 'add') buttons["I'm Done Adding Categories"] = closeSelf;
      buttons["Close"] = closeSelf;
      
      util.dialog(dialogContent,buttons);
    },
    
    validateCategory: function () {
  		$(this.el).dialog("close");

      var name = $(this.el).find('input[name=cat]').val()
        , name = $.trim(name)
      ;
  		if (_.isEmpty(name))
  		  this.prompt('Name cannot be empty');
      else if (this.mode == 'add' && this.level[name] !== undefined)
        this.prompt('Name is already in use');
      else if (this.mode == 'add') {
        var keyCount = _.keys(this.level).length;
        this.level[name+'|'+(keyCount-1)] = {_items:[]};
        this.prompt();
      }
      else if (this.mode == 'edit' && name !== this.origName) {
        var origCat = util.fullCatFromName(this.level,this.origName)
          , order = util.catOrder(origCat)
        ;
        this.level[name+'|'+order] = this.level[origCat];
        delete this.level[origCat];
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
    },
    
    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },
    
    render: function (flash,level,item) {
      flash || (flash = {});
      item || (item = {});
      var dialogHtml = this.template(_.extend({},item, {
        flash: flash,
        _items: level._items
      }));
      $(this.el).html(dialogHtml);
      return this;
    },
    
    prompt: function (flash,item) {
      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(flash,level,item).el
      ;
      // cache for later use
      this.level = level;
      
      util.dialog(dialogContent, {
        "Save Item": function () {
          $(this).dialog("close");
          var activeItemData = {};
          $(self.el).find('.item-input').each(function (idx,elem) {
            activeItemData[$(elem).attr('name')] = $(elem).val();
          });
          
          if (!self.validateItem(activeItemData)) return;
          
          if (self.mode == 'add') {
            level._items.push(activeItemData);
            self.prompt({ success:'Item '+self.mode+'ed successfully' });
          }
          else if (self.mode == 'edit') {
            var oldItem = _.detect(level._items,function (i) { return i.name == item.name });
            util.log('EDIT',oldItem,activeItemData,level._items);
            _.extend(oldItem,activeItemData);

            self.options.onClose && self.options.onClose();
          }
        },
      	"I'm Done": function () {
          $(this).dialog("close");
          self.options.onClose && self.options.onClose();
      	}
    	});
    },
    
    validateItem: function (item) {
  		$(this.el).dialog("close");

      var name = $.trim(item.name);
  		if (_.isEmpty(name)) {
  		  this.prompt({ error:'Name cannot be empty' },item);
  		  return false;
  		}
      else if (this.mode == 'add' && _.include(this.level._items,name)) {
        this.prompt({ error:'Name is already in use' },item);
        return false;
      }
      return true;
    }
  });

})(jQuery);


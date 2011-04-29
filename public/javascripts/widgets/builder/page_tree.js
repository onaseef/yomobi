//
// BUILDER
//
(function ($) {

  window.widgetClasses.page_tree = window.widgetClasses.page_tree.extend({
    
    getEditData: function () {
      var showData = this.getShowData();

      if (!showData.isLeaf) {
        if (showData.items.length === 0) showData.items = [{ name:'==None==' }];
        if (showData.cats.length === 0) showData.cats = ['==None=='];
      }
      else {
        var leafName = _.last(this.catStack);
      }
      
      var extraData = {
        currentCat: util.catName(_.last(this.catStack)) || this.get('prettyName'),
        catCrumbs: util.catStackCrumbs(this.get('prettyName'),this.catStack),
        markdown: showData.isLeaf && this.getCurrentLeaf().markdown
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

  window.widgetEditors.page_tree = window.widgetEditors.category.extend({

    AddItemDialog: AddItemDialog,

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
      'click input[name=down_item]':        'moveItem',
      
      'keyup textarea':                     'queueActiveLeafUpdate'
    },
    
    init: function (widget) {
      // this is needed for proper inheritance due to closures
      this.AddItemDialog = AddItemDialog;
    },
    
    addItem: function (e,error) {
      var self = this;
      var dialog =  new this.AddItemDialog({
        model: this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.enterMode('add').prompt();
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
      leaf.markdown = this.el.find('.leaf-markdown').val();
      this.widget.pageView.refresh();
    }
    
  });
  
  window.widgetPages.page_tree = window.widgetPages.page_tree.extend({

    onCategoryClick: function (e) {
      var cat = $(e.target).attr('data-cat');
      var subpage = this.widget.catStack.join('/');
      subpage && (subpage += '/');
      
      mapp.viewWidget(this.widget, subpage + cat);
      this.widget.getEditor().startEditing();
    },
    
    onLeafNameClick: function (e) {
      var level = this.widget.getCurrentLevel()
        , itemIdx = $(e.target).index() - util.catNamesFromLevel(level).length
        , item = level._items[itemIdx]
        , subpage = this.widget.catStack.join('/')
      ;
      subpage && (subpage += '/');
      
      mapp.viewWidget(this.widget, subpage + item.name);
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
  
  // =================================
  var AddItemDialog = Backbone.View.extend({
    
    template: util.getTemplate('add-item-dialog'),
    
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


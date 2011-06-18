//
// BUILDER
//
(function ($) {

  var defaultPageContent = '<p>[Change Me]</p>';
  var tempCatStack = [];

  window.widgetClasses.page_tree = window.widgetClasses.page_tree.extend({
    
    getEditData: function () {
      var showData = this.getShowData()
        , emptyItems = false
        , emptyCats = false
      ;
      if (!showData.isLeaf) {
        if (showData.items.length === 0) {
          showData.items = [{ name:'==None==' }];
          emptyItems = true;
        }
        if (showData.cats.length === 0) {
          showData.cats = ['==None=='];
          emptyCats = true;
        }
      }
      else {
        var leafName = _.last(this.catStack);
      }
      
      var extraData = {
        currentCat: util.catName(_.last(this.catStack)) || this.get('prettyName'),
        catCrumbs: util.catStackCrumbs(this.get('prettyName'),this.catStack),
        onHomePage: mapp.pageLevel === 0,
        emptyItems: emptyItems,
        emptyCats: emptyCats
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
      
      'click .wysiwyg':                     'queueActiveLeafUpdate'
    },
    
    init: function (widget) {
      // this is needed for proper inheritance due to closures
      this.AddItemDialog = AddItemDialog;

      _.bindAll(this,'queueActiveLeafUpdate');
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
        , itemIdx = $(e.target).index() - util.catNamesFromLevel(level).length
        , item = level._items[itemIdx]
        , subpage = this.widget.catStack.join('/')
      ;
      subpage && (subpage += '/');
      
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
      mapp.viewWidget(this.widget,newSubpage);

      this.widget.getEditor().startEditing();
    },
    
    refresh: function () {
      var wpage = mapp.getActivePage().content.html(this.widget.getPageContent());
      this.widget.pageView.setContentElem(wpage);
    }
    
  });
  
  // =================================
  var AddItemDialog = Backbone.View.extend({
    
    addItemTemplate: util.getTemplate('add-subcat-dialog'),

    events: {
      'keydown input[name="cat"]':      'onKeyDown'
    },
    
    onKeyDown: function (e) {
      var code = e.keyCode || e.which;
      if (code == 13) this.validateItem();
    },
    
    initialize: function () {
      _.bindAll(this,'validateItem');
    },

    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },
    
    render: function (error,level,name) {
      var dialogHtml = this.addItemTemplate({
        error: error,
        cats: _.pluck(level._items,'name'),
        name: name
      });

      var self = this;
      $(this.el).html(dialogHtml).find('.add-btn')
        .click(function () { self.validateItem(); })
      ;
      return this;
    },
    
    prompt: function (error,origName) {
      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(error,level,origName).el
        , closeSelf = close(this)
        , buttons = {}
      ;
      // cache for later use
      this.level = level;
      this.origName = origName;
      
      if (this.mode == 'add') buttons["I'm Done Adding Pages"] = closeSelf;
      else buttons["Close"] = closeSelf;
      
      util.dialog(dialogContent,buttons).find('p.error').show('pulsate',{times:3});
    },
    
    validateItem: function () {
  		$(this.el).dialog("close");

      var name = $(this.el).find('input[name=cat]').val()
        , name = $.trim(name)
      ;
  		if (_.isEmpty(name))
        this.prompt('Name cannot be empty');
      else if ( this.mode == 'add' && _.contains(_.pluck(this.level._items,'name'),name) )
        this.prompt('Name is already in use');
      else if (this.mode == 'add') {
        this.level._items.push({ name:name, content:defaultPageContent });
        this.prompt();
        bapp.currentEditor.setChanged('something',true);
      }
      else if (this.mode == 'edit') {
        var origName = this.origName;
        var targetItem = _.detect(this.level._items,function (i) { return i.name == origName });
        targetItem.name = name;

        this.options.onClose && this.options.onClose();
        bapp.currentEditor.setChanged('something',true);
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


//
// BUILDER
//
(function ($) {

  window.widgetClasses.page_tree = window.widgetClasses.page_tree.extend({
    
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
    }
    
  });

  window.widgetEditors.page_tree = window.widgetEditors.category.extend({

    events: {
      'click input[name=add_cat]':          'addCat',
      'click input[name=rem_cat]':          'remCat',
      'click input[name=add_item]':         'addItem',
      'click input[name=rem_item]':         'remItem'
    },
    
    init: function (widget) {
      
    },
    
    onEditStart: function () {
      var self = this;
    },
    
    grabWidgetValues: function () {
      return {};
    },
    
    addCat: function (e,error) {
      var self = this;
      var dialog =  new AddCatDialog({
        model:this.widget,
        onClose: function () { self.refreshViews(); }
      });
      dialog.prompt();
    },
    
    remCat: function (e) {
      var level = this.widget.getCurrentLevel();
      this.el.find('select[name=cats] option:selected').map(function (idx,elem) {
        var cat = elem.innerHTML;
        if (level[cat]) delete level[cat];
      });
      this.refreshViews();
    },
    
    addItem: function (e,error) {
      var level = this.widget.getCurrentLevel(), self = this;
      
      var dialogHtml = util.getTemplate('add-item-dialog')({
        error: error,
        _items: level._items
      });
      
      util.dialog(dialogHtml, {
      	"Add New Item": function() {
          var name = $(this).find('input[name=item]').val();
      		$(this).dialog("close");
      		
      		name = $.trim(name);
      		if (_.isEmpty(name))
      		  self.addCat(e,'Name cannot be empty');
          else if (_.contains(level._items,name))
            self.addCat(e,'Name is already in use');
          else {
            level._items.push(name);
            self.refreshViews();
          }
      	},
      	Cancel: function() {
      		$(this).dialog("close");
      	}
    	});
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
  
  window.widgetPages.page_tree = window.widgetPages.page_tree.extend({

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
  
  
  // private helper class
  var addCatTemplate = util.getTemplate('add-subcat-dialog');
  var AddCatDialog = Backbone.View.extend({

    events: {
      'keydown input[name="cat"]':      'onKeyDown'
    },
    
    onKeyDown: function (e) {
      util.log('Keydown',e);
      var code = e.keyCode || e.which;
      if (code == 13) this.validateCategory();
    },
    
    render: function (error,level) {
      var dialogHtml = addCatTemplate({
        error: error,
        cats: _.without(_.keys(level),'_items')
      });
      $(this.el).html(dialogHtml);
      return this;
    },
    
    prompt: function (error) {
      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(error,level).el
      ;
      // cache for later use
      this.level = level;
      
      util.dialog(dialogContent, {
        "I'm Done Adding Categories": function () {
          $(this).dialog("close");
          self.options.onClose && self.options.onClose();
        },
      	"Close": function () {
          $(this).dialog("close");
          self.options.onClose && self.options.onClose();
      	}
    	});
    },
    
    validateCategory: function () {
      var name = $(this.el).find('input[name=cat]').val();
  		$(this.el).dialog("close");

      name = $.trim(name);
  		if (_.isEmpty(name))
  		  this.prompt('Name cannot be empty');
      else if (this.level[name] !== undefined)
        this.prompt('Name is already in use');
      else {
        this.level[name] = {_items:[]};
        this.prompt();
      }
    },
    
    
  });

})(jQuery);


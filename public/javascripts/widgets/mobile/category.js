// 
// MOBILE
// 
(function ($) {

  var isSpecialKey = function (key) { return key.charAt(0) === '_' };
  var toItemData = function (level) {
    return function (key) { return level[key]._data }
  };
  
  window.widgetClasses.category = Widget.extend({
    
    catTemplate: util.getTemplate('category-cat'),
    
    init: function () {
      _.bindAll(this,'onHomeViewClick');
      this.catStack = [ this.get('struct') ];

      this.paths = { struct:['struct'] };
      this.setPaths( ['struct'], this.catStack[0] );
    },
    
    getShowData: function () {
      var level = this.getCurrentLevel();
      if (!this.itemTemplate) this.itemTemplate = util.getTemplate(this.get('wsubtype')+'-item');
      
      var extraData = {
        stuff: level._items || [],
        itemTemplate: this.itemTemplate,
        catTemplate: this.catTemplate
      };
      return _.extend({},this.toJSON(),extraData);
    },
    
    getTitleContent: function () {
      return '<h3>' + util.catStackCrumbs(this.get('name'),this.catStack) + '</h3>';
    },
    
    getCurrentLevel: function (refOnly, context) {
      var stack = this.catStack;
      if (context) {
        stack = [context];
        for (var i = 1; i < this.catStack.length; i++) {
          var node_id = this.catStack[i]._data._id;
          stack.push(context[node_id]);
          context = context[node_id];
        }
      }

      if (refOnly) return _.last(stack);

      var top = _.last(stack) || {}
        , order = top._data._order
        , items = _(top).chain().keys().reject(isSpecialKey).map( toItemData(top) )
                  .sortBy(function (item) { return _.indexOf(order, item._id) })
                  .value()
      ;
      return _.extend({ _items:items, _ref:top }, top._data);
    },

    getCurrentNode: function () {
      return this.getCurrentLevel(true);
    },

    setPaths: function (currentPath, currentNode) {

      for (child_id in currentNode) {
        if (child_id.charAt(0) === '_') continue;

        var child = currentNode[child_id];
        this.paths[child_id] = currentPath.concat([child_id]);
        this.setPaths( this.paths[child_id], child );
      }
    },

    getNodeById: function (id) {
      var targetPath = this.paths[id]
        , node = this.get('struct')
      ;
      _.each(targetPath, function (child_id) {
        if (child_id === 'struct') return;
        node = node[child_id];
      });
      return node;
    },

    setCatStackById: function (id) {
      id || (id = 'struct');
      var targetPath = this.paths[id]
        , newStack = [ this.get('struct') ]
      ;
      // ignore first 'struct' path name
      _.each(targetPath, function (child_id) {
        if (child_id === 'struct') return;
        newStack.push( _.last(newStack)[child_id] );
      });
      // manually push for builder purposes
      var stack = this.catStack; stack.length = 0;
      _.each(newStack, function (x) { stack.push(x); })
      this.catStack = newStack;
      return this;
    },

    resetCatStack: function () {
      return this.setCatStackById('struct');
    }

  });
  
  window.widgetPages.category = WidgetPageView.extend({
    
    events: {
      'click .item.category':                 'onCategoryClick',
      'click .item:not([class*=category])':   'onItemClick'
    },
    
    onCategoryClick: function (e) {
      if (!mapp.canTransition()) return;

      util.ensureClassAncestor($(e.target), 'item');
      if (!target) return;

      var cat_id = target.data('id');
      mapp.goToPage(this.widget.get('name'), cat_id);
    },
    
    onItemClick: _.identity,

    onPageView: function (subpage) {
      if (!mapp.canTransition()) return;
      
      util.log('onPageView subpage: ' + subpage);
      if (!subpage && this.widget.catStack.length === 1) return 'forward';
      
      var subpage = subpage || 'struct'
        , stackSize = this.widget.catStack.length
        , newStackSize = this.widget.setCatStackById(subpage).catStack.length
        , direction = newStackSize > stackSize ? 'forward' : 'backward'
      ;

      return direction;
    },

    popPage: function () {
      var catStack = this.widget.catStack;
      if (catStack.length === 1)
        mapp.goHome();
      else {
        catStack.pop();
        var subpage = (catStack.length === 1) ? null : _.last(catStack)._data._id;
        mapp.goToPage( this.widget.get('name'), subpage);
      }
    },
    
    onGoHome: function () {
      this.widget.resetCatStack();
    }
    
  });
  
})(jQuery);

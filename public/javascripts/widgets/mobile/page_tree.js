// 
// MOBILE
// 
(function ($) {
  
  // page_tree can extend category based on the hacky fact that
  // category is included first based on the english alphabet
  // (c comes before p)
  // 
  window.widgetClasses.page_tree = window.widgetClasses.category.extend({
    
    init: function () {
      _.bindAll(this,'onHomeViewClick');
      this.catStack = [];
      
      if (!this.get('struct')) {
        var struct = {
          _items:[],
          "Cat One|0": {
            _items: [{name:'Page 1',markdown:'Blah blah blah'}],
            "Subcat A|0": {
              _items: [{name:'Page 2',markdown:'yadda yadda yadda'}],
            }
          }
        };
        this.set({ struct:struct });
      }
      // TODO: this should really be in builder's page_tree.js
      this.origStruct = util.clone(this.get('struct'));
    },
    
    getShowData: function () {
      var level = this.getCurrentLevel();
      
      if (this.hasLeafOnTop()) {
        var leaf = this.getCurrentLeaf(level)
          , extraData = {
              isLeaf: true,
              title: leaf.name,
              html: util.markdownToHtml(leaf.markdown)
            }
        ;
      }
      else {
        var extraData = {
          items: level._items || [],
          cats: util.catNamesFromLevel(level) || [],
          catTemplate: this.catTemplate
        };
      }
      return _.extend({},this.toJSON(),extraData);
    },
    
    getCurrentLevel: function () {
      var level = this.get('struct');
      _.each(this.catStack, function (cat) {
        if (isNaN( util.catOrder(cat) )) return;
        level = level[cat];
      });
      return level;
    },
    
    hasLeafOnTop: function () {
      var top = _.last(this.catStack);
      return top && isNaN( util.catOrder(top) );
    },
    
    getCurrentLeaf: function (level) {
      var level = level || this.getCurrentLevel()
        , leafName = _.last(this.catStack);
      return _.detect(level._items, function (i) { return i.name == leafName; });
    },
    
  });
  
  window.widgetPages.page_tree = window.widgetPages.category.extend({
    
    events: {
      'click .item.category':       'onCategoryClick',
      'click .item.leaf-name':      'onLeafNameClick'
    },
    
    onLeafNameClick: function (e) {
      var level = this.widget.getCurrentLevel()
        , itemIdx = $(e.target).index() - util.catNamesFromLevel(level).length
        , item = level._items[itemIdx]
        , subpage = this.widget.catStack.join('/')
      ;
      subpage && (subpage += '/');
      
      mapp.goToPage(this.widget.get('name'), subpage + item.name);
    }
  });
  
})(jQuery);

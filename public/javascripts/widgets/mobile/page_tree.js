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
            _items: [{name:'Page 1',content:'Blah blah blah'}],
            "Subcat A|0": {
              _items: [{name:'Page 2',content:'yadda yadda yadda'}],
            }
          }
        };
        this.set({ struct:struct });
      }
    },
    
    getShowData: function () {
      var level = this.getCurrentLevel();
      util.log('SHOW DATA',level,this.catStack);
      
      if (this.hasLeafOnTop()) {
        util.log('LEEEAAF');
        var leafName = _.last(this.catStack)
          , leaf = _.detect(level._items, function (i) { return i.name == leafName; })
          , extraData = {
              isLeaf: true,
              title: leaf.name,
              content: leaf.content
            }
        ;
      }
      else {
        var extraData = {
          items: level._items || [],
          cats: util.catNamesFromLevel(level) || []
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
    }
    
  });
  
  window.widgetPages.page_tree = window.widgetPages.category.extend({
    
    events: {
      'click .item.category':       'onCategoryClick',
      'click .item.leaf-name':      'onLeafNameClick'
    },
    
    onCategoryClick: function (e) {
      var cat = $(e.target).attr('data-cat');
      var subpage = this.widget.catStack.join('/');
      subpage && (subpage += '/');
      
      mapp.goToPage(this.widget.get('name'), subpage + cat);
    },
    
    onLeafNameClick: function (e) {
      var level = this.widget.getCurrentLevel()
        , itemIdx = $(e.target).index() - util.catNamesFromLevel(level).length
        , item = level._items[itemIdx]
        , subpage = this.widget.catStack.join('/')
      ;
      subpage && (subpage += '/');
      
      mapp.goToPage(this.widget.get('name'), subpage + item.name);
    },
    
    onPageView: function (subpage) {
      util.log('subpage',subpage);
      mapp.requirePageCount(this.widget.getLevelDepth() + 1);
      if (!subpage && this.widget.catStack.length === 0) return 'forward';
      
      var subpage = subpage || ''
        , catStack = this.widget.catStack
        , newStack = _.compact(subpage.split('/'))
        , direction = newStack.length > catStack.length ? 'forward' : 'backward'
      ;
      this.widget.catStack = newStack;
      return direction;
    }

  });
  
})(jQuery);

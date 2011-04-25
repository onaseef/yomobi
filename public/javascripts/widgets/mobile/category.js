// 
// MOBILE
// 
(function ($) {
  
  window.widgetClasses.category = Widget.extend({
    
    init: function () {
      _.bindAll(this,'onHomeViewClick');
      this.catStack = [];
      
      if (!this.get('struct')) {
        var struct = {
          _items:[],
          "Food|0": {
            _items: [{name:'Burger',price:'$9.99',desc:'A tasty treat.'}],
            "Dessert|0": {
              _items: [{name:'Ice Cream',price:'$49.99',desc:'A tastier treat'}]
            }
          },
          "Drinks|1": {
            _items: [{name:'Apple Juice',price:'$0.10',desc:'Not actually apple juice'}
                    ,{name:'Orange Juice',price:'$0.15',desc:'Not actually orange juice'}],
          }
        };
        this.set({ struct:struct });
      }
      // TODO: this should really be in builder's category.js
      this.origStruct = util.clone(this.get('struct'));
    },
    
    getShowData: function () {
      var level = this.getCurrentLevel();
      if (!this._itemTemplate) this._itemTemplate = util.getTemplate(this.get('name')+'-item');
      
      var extraData = {
        items: level._items || [],
        cats: util.catNamesFromLevel(level) || [],
        itemTemplate: this._itemTemplate
      };
      return _.extend({},this.toJSON(),extraData);
    },
    
    getCurrentLevel: function () {
      var level = this.get('struct');
      _.each(this.catStack, function (cat) { level = level[cat]; });
      return level;
    },
    
    getLevelDepth: function () {
      if (this.levelDepth === undefined) {
        this.levelDepth = util.calcLevelDepth(this.get('struct'));
      }
      return this.levelDepth;
    }
  });
  
  window.widgetPages.category = WidgetPageView.extend({
    
    events: {
      'click .item.category':       'onCategoryClick'
    },
    
    onCategoryClick: function (e) {
      var cat = $(e.target).attr('data-cat');
      var subpage = this.widget.catStack.join('/');
      subpage && (subpage += '/');
      
      mapp.goToPage(this.widget.get('name'), subpage + cat);
    },
    
    onPageView: function (subpage) {
      util.log('subpage',subpage);
      mapp.requirePageCount(this.widget.getLevelDepth());
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

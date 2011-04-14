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
          "Food": {
            _items: ['Dish 1','Dish 2']
          },
          "Drinks": {
            _items: ['Apple Juice','Orange Juice','Water'],
            "Beer": {
              _items: ['Drink 1','Drink 2']
            },
            "Wine": {
              _items: ['Drink 3']
            }
          }
        };
        this.set({ struct:struct });
      }
    },
    
    getShowData: function () {
      var level = this.get('struct');
      _.each(this.catStack, function (cat) { level = level[cat]; });
      var extraData = {
        items: level._items || [],
        cats: _(level).chain().keys().reject(util.eq('_items')).value() || []
      };
      return _.extend({},this.toJSON(),extraData);
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

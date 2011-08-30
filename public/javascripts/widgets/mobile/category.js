// 
// MOBILE
// 
(function ($) {
  
  window.widgetClasses.category = Widget.extend({
    
    catTemplate: util.getTemplate('category-cat'),
    
    init: function () {
      _.bindAll(this,'onHomeViewClick');
      this.catStack = [];
    },
    
    getShowData: function () {
      var level = this.getCurrentLevel();
      if (!this.itemTemplate) this.itemTemplate = util.getTemplate(this.get('wsubtype')+'-item');
      
      var extraData = {
        items: level._items || [],
        cats: util.sortedCatNamesFromLevel(level) || [],
        itemTemplate: this.itemTemplate,
        catTemplate: this.catTemplate
      };
      return _.extend({},this.toJSON(),extraData);
    },
    
    getTitleContent: function () {
      return '<h3>' + util.catStackCrumbs(this.get('name'),this.catStack) + '</h3>';
    },
    
    getCurrentLevel: function () {
      var level = this.get('struct');
      _.each(this.catStack, function (cat) { level = level[cat]; });
      return level;
    },
    
    getLevelDepth: function (clearCache) {
      if (this.levelDepth === undefined || clearCache) {
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
      if (!mapp.canTransition()) return;

      var cat = $(e.target).attr('data-cat');
      var subpage = this.widget.catStack.join('/');
      subpage && (subpage += '/');
      
      mapp.goToPage(this.widget.get('name'), subpage + cat);
    },
    
    onPageView: function (subpage) {
      if (!mapp.canTransition()) return;
      
      util.log('subpage: ' + subpage);
      if (!subpage && this.widget.catStack.length === 0) return 'forward';
      
      var subpage = subpage || ''
        , catStack = this.widget.catStack
        , newStack = _.compact(subpage.split('/'))
        , direction = newStack.length > catStack.length ? 'forward' : 'backward'
      ;
      // manually push each element for builder purposes
      catStack.length = 0;
      _.each(newStack, function (e) { catStack.push(e); });
      return direction;
    },

    popPage: function () {
      var catStack = this.widget.catStack;
      if (catStack.length === 0)
        mapp.goHome();
      else {
        catStack.pop();
        mapp.goToPage( this.widget.get('name'), unescape(catStack.join('/')) );
      }
    },
    
    onGoHome: function () {
      // directly empty instead of setting to empty array for builder purposes
      this.widget.catStack.length = 0;
    }
    
  });
  
})(jQuery);

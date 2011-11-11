// 
// MOBILE
// 

// page_tree can extend category based on the hacky fact that
// category is included first based on the english alphabet
// (c comes before p)
(function ($) {

  var super_getShowData = window.widgetClasses.category.prototype.getShowData;

  window.widgetClasses.page_tree = window.widgetClasses.category.extend({
    
    getPageContent: function () {
      util.resetCycle();
      this._pageTemplate || (this._pageTemplate = util.getTemplate(this.get('wtype') + '-page'));
      this._listTemplate || (this._listTemplate = util.getTemplate('category' + '-page'));

      var template = this.hasLeafOnTop() ? this._pageTemplate : this._listTemplate;

      return template(this.getShowData());
    },

    getShowData: function () {
      
      if (this.hasLeafOnTop()) {
        var leaf = _.last(this.catStack);
        var extraData = {
          isLeaf: true,
          title: leaf._data.name,
          content: leaf._data.content,
          stuff: [],
          wphotoUrlLarge: util.largerWphoto(leaf._data.wphotoUrl)
        };
        return _.extend({},this.toJSON(),extraData);
      }
      else {
        return super_getShowData.call(this);
      }
    },
    
    hasLeafOnTop: function () {
      var top = _.last(this.catStack);
      return top._data.type === 'page';
    }
    
  });
  
  window.widgetPages.page_tree = window.widgetPages.category.extend({
    
    events: {
      'click .item.category':       'onCategoryClick',
      'click .item.leaf-name':      'onCategoryClick'
    }
  });
  
})(jQuery);

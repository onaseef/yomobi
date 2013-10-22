//
// MOBILE
//

// page_tree can extend category based on the hacky fact that
// category is included first based on the english alphabet
// (c comes before p)
(function ($) {

  var super_getShowData = window.widgetClasses.category.prototype.getShowData;

  window.widgetClasses.page_tree = window.widgetClasses.category.extend({

    rssStates: {},

    getPageContent: function () {
      util.resetCycle();
      var node = this.getCurrentNode();
      this._pageTemplate || (this._pageTemplate = util.getTemplate(this.get('wtype') + '-page'));
      this._listTemplate || (this._listTemplate = util.getTemplate('category' + '-page'));

      var template = this.hasLeafOnTop() ? this._pageTemplate : this._listTemplate;

      return template(this.getShowData());
    },

    getShowData: function () {
      var node = this.getCurrentNode()._data;

      if (node.type == 'rss-feed') {
        if (!this.rssStates[node._id]) {
          var rssState = new window.widgetClasses['rss'](
            _.extend({ skipInit:true, postIdPrefix:(node._id+'/') }, node)
          );
          rssState.pageView = this.pageView;
          if (this.targetPostIdx) {
            rssState.state = 'post';
            rssState.postIdx = this.targetPostIdx;
            delete this.targetPostIdx;
          }
          this.rssStates[node._id] = rssState;
        }
        return this.rssStates[node._id].getShowData();
      }
      else if (this.hasLeafOnTop()) {
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
      return (top._data.type === 'page' || top._data.type === 'text-area');
    },

    getRssState: function () {
      return this.rssStates[this.getCurrentNode()._data._id];
    },

    getSiblingId: function (direction) {
      var rss = this.getRssState();
      return rss && rss.getSiblingId(direction);
    }

  });

  var categoryPage = window.widgetPages.category.prototype;
  window.widgetPages.page_tree = window.widgetPages.category.extend({

    events: {
      'click .item.category':       'onCategoryClick',
      'click .item.leaf-name':      'onCategoryClick',
      'click .item-nav button':     'onItemNavClick'
    },
    refresh: util.widgetPage.refresh,

    onSubpageView: function (parts) {
      var rss = this.widget.getRssState();

      if ( !rss && !parseInt(parts[1]) ) {
        return;
      }
      else if (!rss) {
        this.widget.targetPostIdx = parseInt(parts[1]);
        return;
      }
      rss.state = 'post';
      rss.postIdx = parseInt(parts[1]);
    },

    popPage: function () {
      var rss = this.widget.getRssState();
      if (!rss || rss.state === 'titles') {
        categoryPage.popPage.call(this);
      }
      else {
        rss.state = 'titles';
        var catStack = this.widget.catStack;
        var subpage = (catStack.length === 1) ? null : _.last(catStack)._data._id;
        mapp.goToPage( this.widget.get('name'), subpage);
      }
    }

  });

})(jQuery);

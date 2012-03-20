//
// MOBILE
//
(function ($) {

  var entryToTitleNode = function (entry) {
    return { type:'title', name:entry.title };
  };
  var makeFinder = function (targetVal) {
    return function (val) { return val === targetVal; };
  };

  window.widgetClasses.rss = Widget.extend({
    requiredAttrs: ['url'],

    state: 'loading', // loading, titles, post
    feedData: null,
    postIdx: null,
    _template: util.getTemplate('category-page'),
    titleTemplate: util.getTemplate('category-cat'),
    postTemplate: util.getTemplate('rss-item'),
    itemWrapTemplate: util.getTemplate('item-wrap'),

    getShowData: function () {

      if (!this.feedData) {
        // load feed data
        var feed = new google.feeds.Feed( this.get('url') )
          , self = this
        ;
        feed.setNumEntries(this.get('postCount') || 10);
        feed.load(function (result) {
          if (result.error) return;
          util.log('RESULT',result);
          self.feedData = result.feed;
          if (this.state === 'loading') self.state = 'titles';
          self.pageView.refresh();
          mapp.resize();
        });
        var extraData = {
          nodeType: 'loading'
        };
      }
      else if (this.state === 'titles' || this.feedData && this.postIdx === null) {
        this.state = 'titles';
        var posts = _.map(this.feedData.entries, entryToTitleNode)
          , idPrefix = this.get('postIdPrefix') || ''
        ;
        _.each(posts, function (p,i){ p._id = idPrefix + i; });

        var extraData = {
          nodeType: 'cat',
          stuff: posts,
          catTemplate: this.titleTemplate,
          wphotoUrlLarge: util.largerWphoto( this.get('wphotoUrl') )
        };
      }
      else if (this.state === 'post') {
        this.state = 'post';

        var extraData = {
          nodeType: 'item',
          nodeIdx: { idx:this.postIdx, total:this.feedData.entries.length,
                     humanIdx:this.postIdx+1 },
          node: this.feedData.entries[this.postIdx],
          itemTemplate: this.postTemplate
        };
      }
      return _.extend({}, this.toJSON(), extraData);
    },

    getClassNames: function () {
      return 'category';
    },

    // direction should be 1 or -1
    getSiblingId: function (direction) {
      var idPrefix = this.get('postIdPrefix') || '';
      return idPrefix + util.between(0, this.feedData.entries.length, this.postIdx + direction);
    }

  });


  window.widgetPages.rss = WidgetPageView.extend({

    events: {
      'click .item.category':                 'onCategoryClick',
      'click .item:not([class*=category])':   'onItemClick',
      'click .item-nav button':               'onItemNavClick'
    },

    onCategoryClick: function (e) {
      if (!mapp.canTransition()) return;

      var target = util.ensureClassAncestor(e.target, 'item');
      if (!target) return;

      var postIdx = target.data('id');
      mapp.goToPage(this.widget.get('name'), postIdx);
    },

    onItemClick: function (e) { this.onCategoryClick(e); },

    onItemNavClick: function (e) {
      var direction = (e.target.name === 'next') ? 1 : -1
        , node_id = this.widget.getSiblingId(direction)
      ;
      mapp.goToPage(this.widget.get('name'), node_id);
    },

    beforePageRender: util.widget.resizeOnImgLoad,

    onPageView: function (subpage) {
      if (!mapp.canTransition()) return;

      util.log('onPageView rss subpage: ' + subpage);
      if (!subpage && subpage !== 0 && this.widget.state !== 'post') return 'forward';

      var nextIsPost = !!subpage || subpage === 0
        , direction = (nextIsPost) ? 'forward' : 'backward'
      ;
      if (nextIsPost) {
        this.widget.state = 'post';
        this.widget.postIdx = parseInt(subpage);
        util.log('rawr', this.widget.state);
      }

      return direction;
    },

    popPage: function () {
      if (this.widget.state === 'titles')
        mapp.goHome();
      else {
        this.widget.state = 'titles';
        mapp.goToPage( this.widget.get('name'), null);
      }
    },

    refresh: util.widgetPage.refresh,

    onGoHome: function () {
      this.widget.state = 'titles';
    }

  });

})(jQuery);

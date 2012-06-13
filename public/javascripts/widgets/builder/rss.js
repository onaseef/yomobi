//
// BUILDER
//
(function ($) {

  window.widgetEditors.rss = window.EditWidgetView.extend({

    onEditStart: function (widget) {
      // Maximum RSS feed entry count
      var postCount = this.widget.get('postCount') || g.MAX_RSS_FEED_COUNT;
      this.$('select[name=postCount]').val(postCount);
    }
  });


  window.widgetPages.rss = window.widgetPages.rss.extend({
    // Don't do anything on page refresh
    refresh: _.identity
  });

})(jQuery);

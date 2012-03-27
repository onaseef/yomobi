//
// BUILDER
//
(function ($) {

  window.widgetEditors.rss = window.EditWidgetView.extend({

    onEditStart: function (widget) {
      var postCount = this.widget.get('postCount') || 25;
      this.$('select[name=postCount]').val(postCount);
    }
  });


  window.widgetPages.rss = window.widgetPages.rss.extend({
    // Don't do anything on page refresh
    refresh: _.identity
  });

})(jQuery);

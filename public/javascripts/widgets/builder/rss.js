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

})(jQuery);

(function ($) {
  
  window.Widget = Backbone.Model.extend({
    
    // TODO: url: '/widgets/update',
    // TODO: sync: Backbone.sync,
    
    pageContent: function () {
      this._template = this._template ||
                       util.getTemplate(this.get('wtype') + '-page');
      return this._template(this.toJSON());
    },
    
    initialize: function () {
      var prettyName = _(this.get('name').split('-')).chain()
          .map(function (word) { return util.prettify(word); })
          .value()
          .join(' ')
      ;
      this.set({ prettyName:prettyName });
    },
    
    onHomeViewClick: function () {
      return !!bapp.homeViewWidgetClick(this);
    },
    
    // backbone related
    isNew: function () {
      util.log('isnew',this.toJSON());
      return !this.get('_id');
    }
  });
  
})(jQuery);

(function ($) {
  
  window.Widget = Backbone.Model.extend({
    
    sync: util.couchSync,
    url: function () {
      return 'http://yomobi.couchone.com/' + g.appData.company +
             '/_design/widgets/_view/by_name?include_docs=true' +
             '&key="' + this.get('name') + '"';
    },
    
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
      // returning false will cause the view not
      // to transition into the widget's page
      return true;
    }
  });
  
})(jQuery);

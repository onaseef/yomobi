//
// MOBILE
//
(function ($) {
  
  window.Widget = Backbone.Model.extend({
    
    sync: util.couchSync,
    url: function () {
      return 'http://yomobi.couchone.com/' + g.appData.company +
             '/_design/widgets/_view/by_name?include_docs=true' +
             '&key="' + this.get('name') + '"';
    },
    
    getPageContent: function () {
      util.resetCycle();
      this._template = this._template ||
                       util.getTemplate(this.get('wtype') + '-page');
      return this._template(this.getShowData());
    },
    
    getTitleContent: function () {
      return '<h2>' + this.get('prettyName') + '</h2>';
    },
    
    getShowData: function () {
      return this.toJSON();
    },
    
    initialize: function () {
      this.pageView = new (widgetPages[this.get('wtype')] || WidgetPageView)({
        widget: this
      });
      var prettyName = util.prettifyName(this.get('name'));
      this.set({ prettyName:prettyName });

      this.init && this.init();
    },
    
    onHomeViewClick: function () {
      // returning false will cause the view not
      // to transition into the widget's page
      return true;
    }
  });
  
  window.WidgetPageView = Backbone.View.extend({
    
    initialize: function (options) {
      this.widget = options.widget;

      if (this.init) this.init();
    },
    
    setContentElem: function (elem) {
      elem.attr('class','content '+this.widget.get('wtype'));
      this.el = elem;
      this.delegateEvents(this.events);
    },
    
    // this callback is triggered every time a widget's page is
    // viewed, whether the link originated from the hame page,
    // or the link is pointing to a subpage.
    // 
    // Widgets with more than one page should override this function.
    // 
    onPageView: function (subpage) {
      // Since most widgets only have one page,
      // the default direction is 'forward'
      return 'forward';
    },
    
    onGoHome: function () {}
  });
  
})(jQuery);

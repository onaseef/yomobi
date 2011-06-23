//
// MOBILE
//
(function ($) {
  
  window.Widget = Backbone.Model.extend({
    
    requiredAttrs: [],

    sync: util.couchSync,
    url: function () {
      return 'http://'+g.couchLocation+'/m_' + g.db_name +
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
    
    getIconData: function () {
      return {
        wtype: this.get('wtype'),
        name: this.get('name'),
        prettyName: this.get('prettyName'),
        iconName: this.get('singleton') ? this.get('name') : this.get('wtype'),
        singletonClass: this.get('singleton') ? 'singleton' : ''
      };
    },
    
    initialize: function () {
      this.pageView = new (widgetPages[this.get('wtype')] || WidgetPageView)({
        widget: this
      });
      var prettyName = util.prettifyName(this.get('name'));
      this.set({ prettyName:prettyName });

      this.init && this.init();
    },
    
    validForShowing: function () {
      // this method should return false if this widget should not show
      // up on the mobile page, i.e. not enough information is present.
      // 
      // If validity is more complicated than checking attr presence,
      // this method should be overridden.
      var self = this
        , pluckAttr = function (attr) { return self.get(attr); }
      ;
      return _.all(_.map(this.requiredAttrs, pluckAttr));
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
      this.el.trigger('postRender');
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

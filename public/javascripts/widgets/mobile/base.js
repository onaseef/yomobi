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
      return '<h3>' + this.get('prettyName') + '</h3>';
    },
    
    getShowData: function () {
      return this.toJSON();
    },
    
    getOrder: function () {
      return parseInt( mapp.worder[this.id], 10 );
    },

    setOrder: function (idx) {
      mapp.worder[this.id] = idx;
    },

    getIconData: function () {
      var wdata = this._bdata || util.getWidgetBData(this);
      return {
        wtype: wdata.wtype,
        wsubtype: wdata.wsubtype,
        name: this.get('name'),
        prettyName: this.get('name'),
        iconName: wdata.wsubtype,
        singletonClass: wdata.singleton ? 'singleton' : ''
      };
    },
    
    initialize: function () {
      this.pageView = new (widgetPages[this.get('wtype')] || WidgetPageView)({
        widget: this
      });

      if ( !this.get('name') ) {
        var name = util.prettifyName(this.get('wsubtype'));
        this.set({ name:name });
      }
      // cname = comparable name
      this.cname = util.toComparableName( this.get('name') );

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

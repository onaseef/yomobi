(function ($) {

  // =================================
  Widgets = Backbone.Collection.extend({

    model: Widget,

    sync: util.couchSync,
    // TODO: only query in-use widgets and move all-query to builder-app.js
    url: 'http://yomobi.couchone.com/' + g.appData.company +
         '/_design/widgets/_view/by_name?include_docs=true',

    initialize: function () {
      _.bindAll(this,'addOrder','setOrderByName','updateOverallOrder');
      this.bind('add',this.addOrder);
      this.bind('remove',this.updateOverallOrder);
    },

    parse: function (res) {
      util.log('widget res',res);
      return _.map(res.rows, function (row) {
        var w = row.doc;
        return new window.widgetClasses[w.wtype](w);
      });
    },
    
    addOrder: function (widget) {
      widget.set({ order:this.models.length-1 });
    },
    
    setOrderByName: function (widgetName,order) {
      var widget = this.find(function (w) {
        return w.get('name') == widgetName;
      });
      if(widget) widget.set({ order:order });
      else util.log('bad widget name:',widgetName);
    },
    
    updateOverallOrder: function () {
      var i = 0;
      this.each(function (widget) {
        widget.set({ order:i }); i += 1;
      });
    },
    
    comparator: function (widget) {
      return widget.get('order') || 0;
    }
  });
  
  // ==================================
  WidgetHomeView = Backbone.View.extend({
    tagName: 'div',
    className: 'home-icon dbx-box',
    
    template: util.getTemplate('home-icon'),
    
    events: {
      'click': 'onClick'
    },
    
    initialize: function () {
      _.bindAll(this,'render','onClick');
      this.model.homeView = this;
    },
    
    render: function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    
    onClick: function () {
      if(this.model.onHomeViewClick()) {
        mapp.goToPage(this.model.get('name'));
      }
    }
  });
  
  // ============================
  HomeView = Backbone.View.extend({
    el: $('#home'),
    
    initialize: function (widgets) {
      _.bindAll(this,'render');

      this.widgets = widgets;
      this.widgets.bind('refresh',this.render);
      this.render();
    },
    
    render: function () {
      this.el.find('.content').empty();
      self = this;

      this.widgets.each(function (w) {
        var view = new WidgetHomeView({ model:w });
        self.el.find('.content').append(view.render().el);
      });
      self.el.find('.content').append('<div class="clearfix">');
    }
  });
  
  // =======================================
  MobileAppController = Backbone.Controller.extend({

    routes: {
      '':               'home',
      'page/:widget':   'viewWidget'
    },
  
    home: function () {
      mapp.goHome();
    },
  
    viewWidget: function (name) {
      util.log('viewing',name);
      util.log(mapp.widgets);
      var widget = mapp.widgets.select(function (w) {
        return w.get('name') == name;
      })[0];
      mapp.getNextWidgetPage().content.html(widget.pageContent());
      mapp.transition('forward');
    }
  
  });
  
  // ===========================
  window.MobileAppView = Backbone.View.extend({

    el: $('#mobile-container'),
    
    events: {
      'click .back-btn':      'goBack'
    },
    
    headerTemplate: util.getTemplate('mapp-header'),
    
    // n == 0 is home, n > 0 is widget page level depth
    pageLevel: 0,
    
    widgets: new Widgets(),
    widgetsInUse: new Widgets(),
    widgetsAvailable: new Widgets(),
    
    initialize: function (options) {
      var self = this;
      _.bindAll(this, 'render');
      
      this.homeView = new HomeView(this.widgetsInUse);

      this.widgets.bind('refresh', this.render);
    },
    
    render: function () {
      $('#company-info').html(this.headerTemplate({
        name: g.appData.company,
        prettyName: util.prettify(g.appData.company)
      }));
    },
    
    goBack: function () {
      history.go(-1);
    },
    
    getActiveWidgetPage: function () {
      if(this.pageLevel == 0) return null;
      return this.el.find('.page:eq(1)');
    },
    
    getNextWidgetPage: function () {
      var page = this.el.find('.page:eq(' + (this.pageLevel+1) + ')');
      return {
        topBar:  page.find('.top-bar'),
        content: page.find('.content')
      }
    },
    
    getPreviousWidgetPage: function () {
      if (this.pageLevel <= 1) return null;
      return this.el.find('.page:eq(' + (this.pageLevel-1) + ')');
    },
    
    goToPage: function (widgetName) {
      window.location.href = "#page/"+widgetName;
    },
    
    goHome: function () {
      // TODO: delete all pages between current
      // and home for a smoother transition
      if (this.pageLevel > 0){
        mapp.transition('back');
      }
    },
    
    transition: function (direction) {
      if(!util.reserve('pageTransition')) return;
      var self = this
        , delta = (direction == 'forward') ? 1 : -1
        , deltaStr = (direction == 'forward') ? '-=' : '+='
      ;
      
      this.el.find('#canvas').animate({
        left: deltaStr + g.width
      }, 350, function () {
        mapp.pageLevel += delta;
        util.release('pageTransition');
      });
    }
  });
  
})(jQuery);

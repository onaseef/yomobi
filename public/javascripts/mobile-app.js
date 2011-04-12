(function ($) {

  // =================================
  window.Widgets = Backbone.Collection.extend({

    model: Widget,

    sync: util.couchSync,
    // TODO: only query in-use widgets and move all-query to builder-app.js
    url: 'http://yomobi.couchone.com/' + g.appData.company +
         '/_design/widgets/_view/inuse_by_name?include_docs=true',

    parse: function (res) {
      util.log('widget res',res);
      return _.map(res.rows, function (row) {
        var wdata = row.doc
          , widget = new window.widgetClasses[wdata.wtype](wdata)
        ;
        widget.order = parseInt(mapp.worder[widget.get('name')]);
        return widget;
      });
    },
    
    comparator: function (widget) {
      return widget.order || 0;
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
  
  // ===================================
  window.HomeView = Backbone.View.extend({
    el: $('#home'),
    
    initialize: function (widgets) {
      _.bindAll(this,'render');

      this.widgets = widgets;
      this.widgets.bind('refresh',this.render);
    },
    
    render: function () {
      util.log('homeview render');
      var content = this.el.find('.content').empty();

      this.widgets.each(function (w) {
        var view = new WidgetHomeView({ model:w });
        content.append(view.render().el);
      });
      
      content.append('<div class="clearfix">');
      this.trigger('render');
      util.log('rendered',this.widgets.length,'widgets');
    }
  });
  
  // =============================================
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
      var widget = mapp.widgets.find(function (w) {
        return w.get('name') == name;
      });
      
      var wpage = mapp.getNextWidgetPage().content.html(widget.getPageContent());
      widget.pageView.setContentElem(wpage);
      mapp.transition('forward');
    }
  
  });
  
  // ========================================
  window.MobileAppView = Backbone.View.extend({

    el: $('#mobile-container'),
    
    events: {
      'click .back-btn':      'goBack'
    },
    
    headerTemplate: util.getTemplate('mapp-header'),
    
    // n == 0 is home, n > 0 is widget page level depth
    pageLevel: 0,
    
    initialize: function (options) {
      options = options || {};
      var self = this;

      this.widgets = options.widgets || new Widgets();
      this.widgetsInUse = options.widgetsInUse || new Widgets();
      this.widgetsAvailable = options.widgetsAvailable || new Widgets();
      
      var widgetsToUse = options.homeViewWidgets || 'widgets';
      this.homeView = new HomeView(this[widgetsToUse]);
      
      _.bindAll(this, 'render');
      this.widgets.bind('refresh', this.render);
    },
    
    render: function () {
      util.log('app render');
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
    },
    
    fetchWorder: function (callback) {
      $.ajax({
        url: 'http://yomobi.couchone.com/' + g.db_name + '/worder',
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
          if(!data) statusbar.append('not defined data '+JSON.stringify(data));
          util.log('Got worder!',data);
          callback(data);
        },
        error: function(jqXHR,textStatus,errorThrown) {
          util.log(jqXHR,textStatus,errorThrown);
        }
      });
    }
  });
  
})(jQuery);

(function ($) {

  // =================================
  window.Widgets = Backbone.Collection.extend({

    model: Widget,

    sync: util.couchSync,
    // TODO: only query in-use widgets and move all-query to builder-app.js
    url: 'http://'+g.couchLocation+'/m_' + g.db_name +
         '/_design/widgets/_view/in_use_by_name?include_docs=true',

    parse: function (res) {
      util.log('widget res',res);
      return _.map(res.rows, function (row) {
        var wdata = row.doc
          , widget = util.newWidget(wdata)
        ;
        widget.order = parseInt(mapp.worder[widget.get('name')],10);
        return widget;
      });
    },
    
    validCount: function () {
      return this.select(function (w) { return w.validForShowing(); }).length;
    },

    findByName: function (widgetName) {
      return this.find(function (w) { return w.get('name') == widgetName; });
    },
    
    comparator: function (widget) {
      return widget.order || 0;
    }
  });
  
  // ==================================
  var invalidWidgetTooltip = "This widget will <b>NOT</b> show up in your mobile site!<br /><br />Please click me, fill out all required information, and click <b>Save Changes</b>.";
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
      $(this.el).html( this.template(this.model.getIconData()) );
      // even though this only relates to bapp, it only triggers when
      // bapp tells mapp to show invalid widgets
      if (mapp.homeView.showInvalidWidgets && !this.model.validForShowing()) {
        $(this.el)
          .addClass('invalid')
          .simpletooltip(invalidWidgetTooltip)
        ;
      }
      return this;
    },
    
    onClick: function () {
      if(this.model.onHomeViewClick()) {
        mapp.goToPage(this.model.get('name'));
      }
    },
    
    highlight: function (toggle) {
      $(this.el).toggleClass('editing',toggle);
    }
    
  });
  
  // ===================================
  window.HomeView = Backbone.View.extend({
    el: $('#home'),

    showInvalidWidgets: false,
    
    initialize: function (widgets) {
      _.bindAll(this,'render');

      this.widgets = widgets;
      this.widgets.bind('refresh',this.render);
    },
    
    render: function () {
      var content = this.el.find('.content').empty(), self = this;

      this.widgets.each(function (w) {
        if (!self.showInvalidWidgets && !w.validForShowing()) return;
        var view = new WidgetHomeView({ model:w });
        content.append(view.render().el);
      });
      
      content.append('<div class="clearfix">');
      this.trigger('render');
      util.log('rendered',this.widgets.length,'widgets');

      // this is needed so that the overlays
      // don't look awkwardly short nor long
      if (window.bapp) util.resizeOverlays();

      mapp.resize();
    }
  });
  
  // =============================================
  MobileAppController = Backbone.Controller.extend({

    routes: {
      '':                       'home',
      'page/:widget':           'viewWidgetByName',
      'page/:widget/*subpage':  'viewWidgetByName'
    },
  
    home: function () {
      mapp.goHome();
    },
    
    viewWidgetByName: function (name,subpage) {
      util.log('viewing widget:',name);
      var widget = mapp.widgets.find(function (w) {
        return w.get('name') == name;
      });
      this.highlightTab(name);
      mapp.viewWidget(widget,subpage && unescape(subpage));
    },

    highlightTab: function (name) {
      var prettyName = util.prettifyName(name);
      util.log('NAME',name,prettyName);
      $('#top-bar .tab-bar td')
        .removeClass('active')
        .filter(function () { return this.innerHTML == prettyName; })
        .addClass('active')
      ;
    }

  });
  
  // ========================================
  window.MobileAppView = Backbone.View.extend({

    el: $('#mobile-container'),
    
    events: {
      'click .back-btn':      'goBack',
      'click .wtab':          'onWidgetTabClick'
    },
    
    headerTemplate: util.getTemplate('mapp-header'),
    pageTemplate: util.getTemplate('widget-page'),
    tabBarTemplate: util.getTemplate('tab-bar'),
    
    // n == 0 is home, n > 0 is widget page level depth
    pageLevel: 0,
    scrollStack: [],
    
    initialize: function (options) {
      options = options || {};
      var self = this;

      this.widgets = options.widgets || new Widgets();
      this.widgetsInUse = options.widgetsInUse || new Widgets();
      this.widgetsAvailable = options.widgetsAvailable || new Widgets();
      
      var widgetsToUse = options.homeViewWidgets || 'widgets';
      this.homeView = new HomeView(this[widgetsToUse]);
      this.homeView.showInvalidWidgets = options.showInvalidWidgets || false;

      this.scrollElem = options.scrollElem || $(window);
      
      _.bindAll(this, 'render');
      this.widgets.bind('refresh', this.render);
    },
    
    render: function () {
      util.log('app render');
      $('#top-bar .company-info').html(this.headerTemplate({
        // TODO: use stored icon from couch instead
        name: g.db_name,
        prettyName: g.company
      }));
      if (window.bapp)
        $('#top-bar .ad-bar').empty();
    },
    
    goBack: function () {
      history.go(-1);
    },
    
    onWidgetTabClick: function (e) {
      var prettyName = $(e.target).text()
        , wname = util.uglifyName(prettyName)
        , widget = mapp.widgets.findByName(wname)
      ;
      if(widget.onHomeViewClick()) {
        mapp.goToPage(widget.get('name'));
      }
    },
    
    viewWidget: function (widget,subpage) {
      var direction = widget.pageView.onPageView(subpage)
        , wpage = this.getNextPage(direction,true)
      ;
      wpage.content.html(widget.getPageContent());
      wpage.topBar.find('.title').html(widget.getTitleContent());
      
      widget.pageView.setContentElem(wpage.content);
      mapp.transition(direction);
      this.currentWidget = widget;
    },
    
    getActivePage: function () {
      var page = this.el.find('.page:eq('+this.pageLevel+')');
      page.topBar = page.find('.back-bar');
      page.content = page.find('.content');

      return page;
    },
    
    getNextPage: function (direction,noHomeAllowed) {
      direction = direction || 'forward';
      var mod = (direction === 'forward') ? 1 : -1;

      var page = this.el.find('.page:eq(' + (this.pageLevel+mod) + ')');
      
      if (page.length == 0 || noHomeAllowed && this.pageLevel == 1) {
        page = this.injectNewPage(direction);
      }
      page.topBar = page.find('.back-bar');
      page.content = page.find('.content');

      return page;
    },
    
    injectNewPage: function (direction) {
      var originalCount = this.el.find('.page').length
        , newPage = $(this.pageTemplate())
        , pivot = this.el.find('.page:eq(' + this.pageLevel + ')')
      ;
      (direction == 'forward') ? pivot.after(newPage) : pivot.before(newPage);
      
      var newCount = this.el.find('.page').length
        , canvasWidth = $('#canvas').width()
        , newWidth = canvasWidth * (newCount / originalCount)
      ;
      $('#canvas').css('width',newWidth);

      if (direction == 'backward') {
        var currentOffset = parseInt( $('#canvas').css('left'),10 );
        $('#canvas').css('left',currentOffset - g.width);
        this.pageLevel += 1;
      }

      return newPage;
    },
    
    goToPage: function (widgetName,subpage) {
      subpage = subpage ? '/' + subpage : '';
      window.location.href = "#page/"+widgetName + subpage;
    },
    
    goHome: function () {
      // TODO: delete all pages between current
      // and home for a smoother transition
      var canvas = this.el.find('#canvas');
      
      if (this.pageLevel > 0){
        for (var i = this.pageLevel; i > 1; i --) {
          this.el.find('.page:eq(1)').remove();
          canvas.css('left', parseInt(canvas.css('left'),10) + g.width);
        }
        this.pageLevel = 1;
        mapp.transition('back');
        this.currentWidget.pageView.onGoHome();
        delete this.currentWidget;
      }
    },
    
    canTransition: function () {
      return util.reserve('pageTransition',false);
    },

    transition: function (direction,noScroll) {
      if(!util.reserve('pageTransition')) return false;

      var self = this
        , delta = (direction == 'forward') ? 1 : -1
        , deltaStr = (direction == 'forward') ? '-=' : '+='
        , currentHeight = this.getActivePage().height()
        , nextHeight = this.getNextPage(direction).height()
      ;
      mapp.resize( Math.max(currentHeight,nextHeight) );
      (delta == 1) ? this.scrollPush() : this.scrollPop();
      
      this.pageLevel += delta;

      this.el.find('#canvas').animate({
        left: deltaStr + g.width
      }, 350, function () {
        mapp.resize(nextHeight);
        util.release('pageTransition');
        
        if (mapp.pageLevel == 0) {
          delete mapp.currentWidget;
          util.ensureActiveWidgetIsVisible();
        }
      });

      return true;
    },
    
    // overridden in builder-app.js
    resize: function (height) {
      height = ( height || mapp.getActivePage().height() ) + g.topBarMaxHeight;
      $('#mobile-container').height(height);
      return height;
    },
    
    scrollPush: function () {
      this.scrollStack.push( this.scrollElem.scrollTop() );
      this.scrollElem.scrollTop(0);
      // $(this.scrollElem).animate({ scrollTop:0 },350);
    },

    scrollPop: function () {
      this.scrollElem.scrollTop( this.scrollStack.pop() );
    },

    fetchWorder: function (callback) {
      $.ajax({
        url: 'http://'+g.couchLocation+'/m_' + g.db_name + '/worder',
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
    },
    
    updateWtabs: function () {
      this.el.find('#top-bar .tab-bar').html(this.tabBarTemplate({
        prettyTabs: _.map(this.wtabs,util.prettifyName)
      }));
    },

    showAds: function () {
util.log('SHowing ads');
      $('.ad-bar').show();
    }
    
  });
  
})(jQuery);

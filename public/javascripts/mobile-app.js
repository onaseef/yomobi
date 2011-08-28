(function ($) {

  var isValidForShowing = function (w) {
    return w && w.validForShowing();
  };

  var isTrueTrue = function () { return true; };
  var pluckName = function (w) { return w && w.get('name'); };

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
        return widget;
      });
    },
    
    validCount: function () {
      return this.select(function (w) { return w.validForShowing(); }).length;
    },

    findByType: function (wtype,wsubtype) {
      return this.find(function (w) {
        return w.get('wtype') == wtype && w.get('wsubtype') == wsubtype;
      });
    },
    
    comparator: function (widget) {
      return widget.getOrder();
    }
  });
  
  // ==================================
  var invalidWidgetTooltip = "This widget will <b>NOT</b> appear on your mobile site because required information is missing.<br /><br />Please click on this widget to edit. Remember to <b>Save Changes</b> when you are done.";
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
      this.model.bind('change:name',this.render);
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
    },
    
    render: function () {
      var content = this.el.find('.content').empty(), self = this;

      this.widgets.sort({ silent:true }).each(function (w) {
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
      '':                   'home',
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
      
      this.homeView = new HomeView(this.widgets);
      this.homeView.showInvalidWidgets = options.showInvalidWidgets || false;

      this.scrollElem = options.scrollElem || $(window);

      this.isDesktop = window.location.href.match(/_d\=1/);
      
      _.bindAll(this, 'render');
    },
    
    render: function () {
      util.log('app render');
      $('#top-bar .company-info').html(this.headerTemplate({
        name: g.db_name,
        prettyName: g.company
      }))
      .find('img').load(function (e,elem) {
        g.topBarHeight = Math.max(g.topBarHeight,$('#top-bar').height());
      });

      this.trigger('render');
    },
    
    goBack: function () {
      var widget = mapp.currentWidget;
      if (widget.get('wtype') === 'category' ||
          widget.get('wtype') === 'page_tree'
      ) {
        widget.pageView.popPage();
      }
      else {
        mapp.goHome();
      }
    },
    
    onWidgetTabClick: function (e) {
      var $target = e.target.tagName == 'TD' ? $(e.target) : $(e.target).parent()
        , widget = mapp.widgets.get( $target.data('wid') )
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
      // window.location.href = "#page/"+widgetName + subpage;
      router.saveLocation("#page/"+widgetName + subpage);
      router.viewWidgetByName(widgetName, subpage);
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
        router.saveLocation('');

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

        , activePage = this.getActivePage()
        , nextPage = this.getNextPage(direction)
        , m = !window.bapp // m is used for checking if page is in mobile mode
      ;
      m && activePage.css('visibility','hidden');
      if (this.scrollElem.scrollTop() > g.topBarHeight)
        this.scrollElem.scrollTop(g.topBarHeight);

      self.pageLevel += delta;

      setTimeout(function () {
        m && bezen.domwrite.capture();
        activePage.find('.ad-bar,.mobile-footer').appendTo(nextPage);

        self.el.find('#canvas').css('left', deltaStr + g.width);
        mapp.resize(nextPage.height());

        m && activePage.css('visibility','visible');
        // if (delta === -1) setTimeout(function () { self.scrollPop(); },m ? 500 : 0);
        if (self.isDesktop) self.scrollElem.scrollTop(0);

        util.release('pageTransition');
        
        if (window.bapp) {
          if (mapp.pageLevel == 0) {
            delete mapp.currentWidget;
            util.ensureActiveWidgetIsVisible();
          }
          else {
            mapp.currentWidget.pageView.setContentElem(self.getActivePage().content);
          }
        }
      },m ? 200 : 0);

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
      if (this.scrollElem.scrollTop() > g.topBarHeight)
        this.scrollElem.scrollTop(g.topBarHeight);
      // $(this.scrollElem).animate({ scrollTop:0 },350);
    },

    scrollPop: function () {
      var pop = this.scrollStack.pop();
      if (this.scrollElem.scrollTop() < pop) {
        this.scrollElem.scrollTop( pop );
      }
    },

    fetchMetaDoc: function (callback) {
      $.ajax({
        url: 'http://'+g.couchLocation+'/m_' + g.db_name + '/meta',
        type: 'get',
        dataType: 'jsonp',
        success: function(metaDoc) {
          if(!metaDoc) statusbar.append('not defined metaDoc '+JSON.stringify(metaDoc));
          util.log('Got meta!',metaDoc);

          if (metaDoc.worderInit) mapp.initializeWorder(metaDoc)
          callback(metaDoc);
        },
        error: function(jqXHR,textStatus,errorThrown) {
          util.log(jqXHR,textStatus,errorThrown);
        }
      });
    },

    initializeWorder: function (metaDoc) {
      util.log('Initializing worder...');
      // TODO: remove worderInit and translate into proper worder
    },
    
    updateWtabs: function (requireValid) {
      var isValid = requireValid ? isValidForShowing : isTrueTrue;

      var names = _(this.wtabs).chain().map(util.widgetById).select(isValid).map(pluckName).value();

      this.el.find('#top-bar .tab-bar').html(this.tabBarTemplate({
        wids: this.wtabs,
        wtabNames: names
      }));
      g.topBarHeight = Math.max(g.topBarHeight, this.el.find('#top-bar').height());
    },

    showAds: function () {
      $('.ad-bar').show();
    }
    
  });
  
})(jQuery);

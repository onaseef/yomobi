(function ($) {
  
  // ----------------------------
  window.BuilderWidgets = Widgets.extend({
    
    initialize: function () {
      _.bindAll(this,'addOrder','setOrderByName','updateOverallOrder');
      this.bind('add',this.addOrder);
      this.bind('remove',this.updateOverallOrder);
    },
    
    addOrder: function (widget) {
      widget.set({ order:-1 }, { silent:true });
      this.updateOverallOrder();
    },
    
    setWidgetOrder: function (widget,order) {
      util.pushUIBlock(widget.get('name'));
      
      if(widget && widget.get('order') != order) {
        widget.set({ order:order });
        return true;
      }
      else {
        util.clearUIBlock(widget.get('name'));
        return false;
      }
    },
    
    getWidgetByName: function (widgetName) {
      return this.find(function (w) { return w.get('name') == widgetName; });
    },
    
    updateOverallOrder: function () {
      var i = 0;
      this.each(function (widget) {
        util.log('updating overall order',widget.get('name'),'from',widget.get('order'),'to',i);
        widget.set({ order:i }); i += 1;
      });
    }
    
  });
  
  // -----------------------------------------------
  window.MobileAppView = window.MobileAppView.extend({

    goBack: function () {
      this.transition('back');
    },
    
    goToPage: function (widgetName) {
      mapp.transition('forward');
    },
  });
  
  // ----------------------------------
  BuilderAppView = Backbone.View.extend({
    
    // can either be 'edit' or 'emulate'
    mode: 'edit',
    
    initialize: function () {
      _.bindAll(this,'rebindSortables','checkWidgetOrder');
      
      this.editor = new EditWidgetView();
      window.mapp = new MobileAppView({
        widgetsInUse: new BuilderWidgets(),
        homeViewWidgets: 'widgetsInUse'
      });
      
      mapp.widgetsInUse.bind('add',mapp.homeView.render);
      mapp.widgetsInUse.bind('remove',mapp.homeView.render);

      mapp.homeView.bind('render',this.rebindSortables);
      mapp.homeView.bind('render',function () {
        util.log('RENDER RENDER RENDER');
      });
      
      mapp.widgets.fetch({
        success: function (widgets,res) {
          // partition widgets
          var isAvailable = function (w) { return w.isAvailable(); };
          mapp.widgetsAvailable.refresh(widgets.select(isAvailable));
          mapp.widgetsInUse.refresh(widgets.reject(isAvailable));
          
          // TODO: grab data from server (bdata)
          _.each(bdata, function (data,name) {
            var exists = widgets.find(function (w) {
              return w.get('name') == name;
            });
            
            if (exists === undefined) {
              var wdata = _.extend({},data);
              delete wdata.editAreaTemplate;
              mapp.widgetsAvailable.add(util.newWidget(data));
            }
          });
          
          $('#emulator .loader-overlay').hide();
          util.log('fetch',widgets,mapp.widgetsAvailable,mapp.widgetsInUse);
        }
      });

      this.sidebar = new SidebarView(mapp.widgetsAvailable);
    },
    
    homeViewWidgetClick: function (widget) {
      if(this.mode == 'emulate') return true;

      this.editor.startEditing(widget);
      // returning false will cause the mobile emulator to ignore the click
      return false;
    },
    
    addNewWidget: function (name,wtype) {
      util.log('adding new widget',name,wtype);
      if (!util.reserveUI()) return;
      
      var newWidget = this.sidebar.markWidgetAsInUse(name);
      
      if (newWidget) {
        util.pushUIBlock(newWidget.get('name'));
        mapp.widgetsInUse.add(newWidget);
      }
    },
    
    removeWidget: function (widget) {
      mapp.widgetsInUse.remove(widget);
      this.sidebar.markWidgetAsAvailable(widget);

      widget.save(null, {
        error: function (model,res) {
          util.log('error saving',model,res);
          // TODO: notify user
          util.releaseUI();
          util.releaseWidget(model);
        },
        success: function (model,res) {
          util.log('Saved widget',model,res);
          util.releaseUI();
          util.releaseWidget(model);
        }
      });
    },
    
    checkWidgetOrder: function () {
      var isClone = function () { return $(this).hasClass('dbx-clone'); };
      var changed = false;
      $('#home-widgets .home-icon').not(isClone).each(function (idx,elem) {
        var codeName = util.uglifyName($(elem).find('.title').text())
          , widget = mapp.widgetsInUse.getWidgetByName(codeName)
        ;
        changed = changed || idx !== widget.get('order');
      });
      
      if (changed === true && util.reserveUI()) {
        $('#home-widgets .home-icon').not(isClone).each(function (idx,elem) {
          var codeName = util.uglifyName($(elem).find('.title').text())
            , widget = mapp.widgetsInUse.getWidgetByName(codeName)
          ;
          mapp.widgetsInUse.setWidgetOrder(widget,idx);
          util.log(idx,codeName,$(elem).attr('class'));
        });
      }
    },
    
    rebindSortables: function () {
      // this.homeView.render();
      g.homeDbx.initBoxes();
      this.checkWidgetOrder();
    }
    
  });

  // make stuff (dragg|dropp)able
  g.rearrangeManager = new dbxManager(
    'main',        // session ID [/-_a-zA-Z0-9/]
    'yes',             // enable box-ID based dynamic groups ['yes'|'no']
    'yes',             // hide source box while dragging ['yes'|'no']
    'button'           // toggle button element type ['link'|'button']
  );
  
  g.homeDbx = new dbxGroup(
    'home-widgets',      // container ID [/-_a-zA-Z0-9/]
    'freeform',          // orientation ['vertical'|'horizontal'|'freeform'|'freeform-insert'|'confirm']
    '7',                 // drag threshold ['n' pixels]
    'no',                // restrict drag movement to container/axis ['yes'|'no']
    '10',                // animate re-ordering [frames per transition, or '0' for no effect]
    'no' ,               // include open/close toggle buttons ['yes'|'no']
    'open',              // default state ['open'|'closed']

    'open',                                          // word for "open", as in "open this box"
    'close',                                         // word for "close", as in "close this box"
    'click-down and drag to move this box',          // sentence for "move this box" by mouse
    'click to %toggle% this box',                    // pattern-match sentence for "(open|close) this box" by mouse
    
    'use the arrow keys to move this box. ',         // sentence for "move this box" by keyboard
    'press the enter key to %toggle% this box. ',    // pattern-match sentence-fragment for "(open|close) this box" by keyboard
    
    '%mytitle%  [%dbxtitle%]',                       // pattern-match syntax for title-attribute conflicts

    'hit the enter key to select this target',       // confirm dialog sentence for "selection okay"
    'sorry, this target cannot be selected'          // confirm dialog sentence for "selection not okay"
  );
  _.bindAll(g.homeDbx,'initBoxes');
  
  $('#emulator').droppable({
    hoverClass: 'drophover',
    drop: function (e,ui) {
      var elem = $(ui.draggable)
        , name = elem.attr('data-name')
        , wtype = elem.attr('data-wtype')
      ;
      if(!elem.hasClass('sidebar')) return;
      
      util.log('dropped',name,wtype);
      bapp.addNewWidget(name,wtype);
    }
  }).disableSelection();
  
  window.bapp = new BuilderAppView();

  // more drag & drop logic
  g.rearrangeManager.onbeforestatechange = function () {
    return util.isUIFree();
  };
  
  g.rearrangeManager.onstatechange = bapp.checkWidgetOrder;
  
  g.rearrangeManager.onboxdrag = function () {
    return util.isUIFree();
  };
  
})(jQuery);
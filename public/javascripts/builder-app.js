(function ($) {
  
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
      this.editor = new EditWidgetView();
      window.mapp = new MobileAppView();
      
      _.bindAll(window.mapp.homeView,'render');
      mapp.widgetsInUse.bind('add',mapp.homeView.render);
      mapp.widgetsInUse.bind('remove',mapp.homeView.render);
      
      mapp.widgetsInUse.bind('add',g.homeDbx.initBoxes);
      mapp.widgetsInUse.bind('remove',g.homeDbx.initBoxes);
      mapp.widgetsInUse.bind('refresh',g.homeDbx.initBoxes);
      mapp.widgets.fetch({
        success: function (widgets,res) {
          // partition widgets
          var isAvailable = function (w) { return w.isAvailable(); };
          mapp.widgetsAvailable.refresh(widgets.select(isAvailable));
          mapp.widgetsInUse.refresh(widgets.reject(isAvailable));
          
          util.log('fetch',widgets,mapp.widgetsAvailable,mapp.widgetsInUse);
        }
      });
      // TODO: grab data from server (bdata)
      this.sidebar = new SidebarView(mapp.widgetsAvailable);
    },
    
    homeViewWidgetClick: function (widget) {
      if(this.mode == 'emulate') return true;

      this.editor.startEditing(widget);
      // returning false will cause the mobile emulator to ignore the click
      return false;
    },
    
    addNewWidget: function (name,wtype) {
      var newWidget = this.sidebar.markWidgetAsInUse(name);
      
      if (newWidget) {
        newWidget.save(null, {
          error: function (model,res) {
            util.log('error saving',model,res);
            // TODO: notify user
          },
          success: function (model,res) {
            util.log('success',model,res);
            mapp.widgetsInUse.add(model);
          }
        });
      }
    },
    
    removeWidget: function (widget) {
      mapp.widgetsInUse.remove(widget);
      this.sidebar.markWidgetAsAvailable(widget);

      widget.save(null, {
        error: function (model,res) {
          util.log('error saving',model,res);
          // TODO: notify user
        },
        success: function (model,res) {
          util.log('Saved widget',model,res);
        }
      });
    }
    
  });

  // make stuff (dragg|dropp)able
  var rearrangeManager = new dbxManager(
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
  rearrangeManager.onstatechange = function () {
    $('#home-widgets .home-icon').each(function (idx,elem) {
      var codeName = util.uglifyName($(elem).find('.title').text());
      mapp.widgetsInUse.setOrderByName(codeName,idx);
    });
  };
  
})(jQuery);
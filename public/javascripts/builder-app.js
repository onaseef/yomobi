(function ($) {
  
  // ----------------------------
  window.BuilderWidgets = Widgets.extend({
    
    initialize: function () {
      _.bindAll(this,'addOrder','updateOverallOrder');
      this.bind('add',this.addOrder);
      // mapp.homeView.bind('render',this.updateOverallOrder);
    },
    
    addOrder: function (widget) {
      // this is -1 because the widget is already added
      widget.order = this.models.length - 1;
      this.sort({ silent:true });
      this.updateOverallOrder({ noUpdate:true });

      util.reserveWidget(widget,true);
      widget.save(null,{
        success: function () {
          util.releaseWidget(widget);
        }
      });
    },
    
    getWidgetByName: function (widgetName) {
      return this.find(function (w) { return w.get('name') == widgetName; });
    },
    
    updateOverallOrder: function (options) {
      var i = 0, worder = {}, changed = false, options = options || {};
      this.each(function (widget) {
        if (!options.noUpdate) {
          var iconIdx = $(widget.homeView.el).index();
          changed = changed || widget.order != iconIdx;
          widget.order = iconIdx;
        }
        worder[widget.get('name')] = widget.order;
      });

      // check if new worder is different than current worder
      var newNames = _.keys(worder)
        , oldNames = _.keys(bapp.worderDoc.worder)
        , changed  = changed
                  || newNames.length != oldNames.length
                  || newNames.length != _.intersect(newNames,oldNames).length
      ;

      if (!options.noSync && changed && (util.reserveUI() || options.forceSync)) {
        util.log('Syncing worder...');
        // tell server to update order
        bapp.worderDoc.worder = worder;
        $.post('/order',bapp.worderDoc,function (newWorderDoc) {
          bapp.worderDoc = newWorderDoc;
          util.releaseUI();
        });
      }
    }
    
  });
  
  // -----------------------------------------------
  var super = {
    resize: window.MobileAppView.prototype.resize,
    transition: window.MobileAppView.prototype.transition,
    goHome: window.MobileAppView.prototype.goHome,
  }
  window.MobileAppView = window.MobileAppView.extend({
    
    events: {
      'click .back-btn':      'goBack',
      'click .go-home':       'goHome'
    },

    goBack: function () {
      // a widget is guarenteed to be being edited,
      // since back buttons only live in widget pages.
      if (bapp.currentEditor.widget.pageView.onBackBtnClick)
        return bapp.currentEditor.widget.pageView.onBackBtnClick();
      this.transition('back');
    },
    
    goHome: function (e) {
      e.preventDefault();
      super.goHome.call(this);
    },
    
    goToPage: function (widgetName) {
      mapp.transition('forward');
    },
    
    scrollTo: function (position,elem) {
      elem = elem || this.el;
      var targetTop = $(elem).offset().top
        , screenTop = this.el.parent().offset().top
      ;
      switch (position) {
        case 'top':     var dest = targetTop - screenTop; break;
        default:        var dest = p.top + $(elem).height();
      }
      util.log('Scrolling to elem',elem,'dest',dest,'scrollTop',this.el.parent().scrollTop());
      
      // this.el.parent().scrollTop(dest);
    },
    
    transition: function (direction) {
      $('#mobile-scroller').scrollTop(0);
      super.transition.call(this,direction,true);
    },
    
    resize: function (height) {
      super.resize.call(this,height);
      var emulatorWidth = ($('#mobile-container').height() < 480) ? 320 : 320+util.scrollbarWidth();
      $('#emulator').width(emulatorWidth);
    },
  });
  
  // ----------------------------------
  BuilderAppView = Backbone.View.extend({
    
    // can either be 'edit' or 'emulate'
    mode: 'edit',
    
    initialize: function () {
      _.bindAll(this,'rebindSortables');
      
      window.Widgets.prototype.url = 'http://yomobi.couchone.com/' + g.appData.company +
         '/_design/widgets/_view/by_name?include_docs=true',
      
      window.mapp = new MobileAppView({
        widgetsInUse: new BuilderWidgets(),
        homeViewWidgets: 'widgetsInUse'
      });
      
      mapp.widgetsInUse.bind('add',mapp.homeView.render);
      mapp.widgetsInUse.bind('remove',mapp.homeView.render);

      mapp.homeView.bind('render',this.rebindSortables);
      
      // first fetch overall widget order
      var self = this;
      mapp.fetchWorder(function (worderDoc) {

        self.worderDoc = worderDoc;
        mapp.worder = worderDoc.worder;
        
        // now fetch the widgets themselves
        mapp.widgets.fetch({
          success: function (widgets,res) {
            
            mapp.widgetsInUse.refresh(widgets.models);
            mapp.widgetsInUse.updateOverallOrder({ noSync:true });

            // TODO: grab data from server (bdata)
            var widgetsAvailable =  _.map(bdata, function (data,name) {
              var wdata = _.extend({},data);
              delete wdata.editAreaTemplate;
              if (wdata.singleton)
                wdata.singletonInUse = !!mapp.widgetsInUse.getWidgetByName(wdata.name);
              return wdata;
            });
            mapp.widgetsAvailable.refresh( _.compact(widgetsAvailable) );
          
            $('#emulator .loader-overlay').hide();
            util.log('fetch',widgets,mapp.widgetsAvailable,mapp.widgetsInUse);
          }
        });
      });
      
      this.sidebar = new SidebarView({ widgets:mapp.widgetsAvailable });
    },
    
    homeViewWidgetClick: function (widget) {
      if(this.mode == 'emulate') return true;

      if (this.currentEditor && this.currentEditor.widget)
        this.currentEditor.widget.homeView.highlight(false);
      this.currentEditor = widget.getEditor();
      this.currentEditor.startEditing();
      // returning false will cause the mobile emulator to ignore the click
      return false;
    },
    
    addNewWidget: function (name,wtype) {
      util.log('adding new widget',name,wtype);
      if (!util.reserveUI()) return;
      var self = this;
      
      this.validateWidgetName(name,wtype, {
        onValid: function (validName) {
          var newWidget = self.sidebar.cloneWidgetByType(wtype);
      
          if (newWidget) {
            newWidget.set({ name:validName });
            util.pushUIBlock(validName);
            mapp.widgetsInUse.add(newWidget);

            // TODO: use data from server
            if (bdata[newWidget.get('wtype')].singleton)
              bapp.sidebar.setSingletonInUse(newWidget.get('name'),true);
            mapp.resize();
          }
        },
        onCancel: function () {
          util.releaseUI();
        }
      });
    },

    // validateWidget
    //  If widget name is not valid, returns false and opens a dialog box
    //  else returns true
    // NOTE: name is in uglified form
    // 
    validateWidgetName: function (name,wtype,options) {
      var error = null
        , self = this
        , options = options || {}
        , prettyName = util.prettifyName(name)
        , isValid = !!name.match(/^[a-z][a-z0-9\-]*$/) || (error = 'Invalid name')

        , exception = options.exception || '_'
        , isSameName = function (w) { var n=w.get('name'); return n == name && n != exception; }
        , isValid = error || !mapp.widgetsInUse.find(isSameName) || (error = 'Name already in use.')
        , isValid = error || prettyName.length <= 16 || (error = 'Name is too long (16 characters max).')
      ;
      
      if (isValid === true) return options.onValid(name);
      
      // find ALL widgets of this wtype
      var isSameWtype = function (w) { return w.get('wtype') == wtype }
        , pluckPrettyName = function (w) { return util.prettifyName(w.get('name')) }
        , existingNames = mapp.widgetsInUse.select(isSameWtype).map(pluckPrettyName)
      ;
      var dialogHtml = util.getTemplate('add-widget-dialog')({
        wtype: wtype.toUpperCase(),
        defaultName: util.prettifyName(name),
        names: existingNames,
        error: error
      });
      
      $(dialogHtml).dialog({
        resizable: false,
        modal: true,
        draggable: false,
        close: function () { options.onCancel && options.onCancel(); },
        buttons: {
        	"Add New Widget": function() {
            var newName = $(this).find('input[name=wname]').val()
              , newName = $.trim(newName)
              , newName = util.uglifyName(newName)
                newName = util.scrubUglyName(newName)
            ;
        		$(this).dialog("close");

            self.validateWidgetName(newName,wtype,options);
        	},
        	Cancel: function() {
        		$(this).dialog("close");
        		options.onCancel && options.onCancel();
        	}
      	}
    	});
    	
    	return false;
    },
    
    removeWidget: function (widget) {
      mapp.widgetsInUse.remove(widget);

      widget.destroy({
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
          // TODO: use data from server
          if (bdata[widget.get('wtype')].singleton)
            bapp.sidebar.setSingletonInUse(widget.get('name'),false);
          mapp.resize();
        }
      });
    },
    
    rebindSortables: function () {
      g.homeDbx.initBoxes();
      mapp.widgetsInUse.updateOverallOrder({ forceSync:true });
    },
    
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
    'freeform-insert',   // orientation ['vertical'|'horizontal'|'freeform'|'freeform-insert'|'confirm']
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

    over: function () {
      var targetHeight = $('#emulator').height();
      $('#emulator .drophover-overlay').height(targetHeight);
    },
    drop: function (e,ui) {
      
      if (mapp.pageLevel != 0) {
        $('#dialog-invalid-drag').dialog({
          modal: true,
          buttons: {
            Ok: function () { $(this).dialog('close'); }
          }
        });
        return;
      }
      
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
  
  g.rearrangeManager.onstatechange = mapp.widgetsInUse.updateOverallOrder;
  
  g.rearrangeManager.onboxdrag = function () {
    return util.isUIFree();
  };
  
})(jQuery);
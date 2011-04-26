(function ($) {
  
  // ----------------------------
  window.BuilderWidgets = Widgets.extend({
    
    initialize: function () {
      _.bindAll(this,'addOrder','updateOverallOrder');
      this.bind('add',this.addOrder);
      this.bind('remove',_.bind(this.updateOverallOrder,{},true));
    },
    
    addOrder: function (widget) {
      widget.order = -1;
      this.updateOverallOrder();

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
    
    updateOverallOrder: function (noSync) {
      var i = 0, worder = {};
      this.each(function (widget) {
        widget.order = i; i += 1;
        worder[widget.get('name')] = widget.order;
      });
      util.log( 'NEW ORDER', worder );
      if (!noSync) {
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
  window.MobileAppView = window.MobileAppView.extend({

    goBack: function () {
      // a widget is guarenteed to be being edited,
      // since back buttons only live in widget pages.
      if (bapp.currentEditor.widget.pageView.onBackBtnClick)
        return bapp.currentEditor.widget.pageView.onBackBtnClick();
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
      
      window.Widgets.prototype.url = 'http://yomobi.couchone.com/' + g.appData.company +
         '/_design/widgets/_view/by_name?include_docs=true',
      
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
      
      // first fetch overall widget order
      var self = this;
      mapp.fetchWorder(function (worderDoc) {

        self.worderDoc = worderDoc;
        mapp.worder = worderDoc.worder;
        
        // now fetch the widgets themselves
        mapp.widgets.fetch({
          success: function (widgets,res) {
            
            mapp.widgetsInUse.refresh(widgets.models);
            mapp.widgetsInUse.updateOverallOrder(true);

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
            util.log('new');
            newWidget.set({ name:validName });
            util.pushUIBlock(validName);
            mapp.widgetsInUse.add(newWidget);

            // TODO: use data from server
            if (bdata[newWidget.get('wtype')].singleton)
              bapp.sidebar.setSingletonInUse(newWidget.get('name'),true);
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
    // 
    validateWidgetName: function (name,wtype,options) {
      var self = this
        , options = options || {}
        , name = util.uglifyName($.trim(name))
        , isValid = !!name.match(/^[a-z][a-z0-9\-]*$/)

        , exception = options.exception || '_'
        , isSameName = function (w) { var n=w.get('name'); return n == name && n != exception; }
        , isValid = isValid && !mapp.widgetsInUse.find(isSameName)
      ;
      
      if (isValid) return options.onValid(name);
      
      // find ALL widgets of this wtype
      var isSameWtype = function (w) { return w.get('wtype') == wtype }
        , pluckPrettyName = function (w) { return util.prettifyName(w.get('name')) }
        , existingNames = mapp.widgetsInUse.select(isSameWtype).map(pluckPrettyName)
      ;
      var dialogHtml = util.getTemplate('add-widget-dialog')({
        wtype: wtype.toUpperCase(),
        defaultName: util.prettifyName(name),
        names: existingNames
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
        changed = changed || idx !== widget.order;
      });
      
      if (changed === true && util.reserveUI()) {
        $('#home-widgets .home-icon').not(isClone).each(function (idx,elem) {
          var codeName = util.uglifyName($(elem).find('.title').text())
            , widget = mapp.widgetsInUse.getWidgetByName(codeName)
          ;
          widget.order = idx;
        });
        
        mapp.widgetsInUse.updateOverallOrder();
      }
    },
    
    rebindSortables: function () {
      // this.homeView.render();
      g.homeDbx.initBoxes();
      this.checkWidgetOrder();
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
  
  g.rearrangeManager.onstatechange = bapp.checkWidgetOrder;
  
  g.rearrangeManager.onboxdrag = function () {
    return util.isUIFree();
  };
  
})(jQuery);
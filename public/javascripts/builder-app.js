(function ($) {

  var pluckPrettyName = function (w) { return util.prettifyName(w.get('name')) };
  var pluckName = function (w) { return w.get('name'); };
  var unsavedChangesText = "You have unsaved changes. Click Cancel to go back and save changes, or click OK if you wish to discard your changes.";

  // ----------------------------
  window.BuilderWidgets = Widgets.extend({
    
    initialize: function () {
      _.bindAll(this,'addOrder','updateOverallOrder');
      this.bind('add',this.onAdd);
      this.bind('remove', _.bind(function () { this.lastMod = -1; },this));
      this.lastMod = 0;
    },
    
    onAdd: function (widget) {
      // +1 on length to make sure order update catches the change
      widget.setOrder( _.keys(mapp.worder).length+1 );
      this.sort({ silent:true });
      this.updateOverallOrder({ noUpdate:true });

      // util.reserveWidget(widget,true);
      self = this;

      util.pushUIBlock('new-widget');
      widget.save(null,{
        success: function () {
          // util.releaseWidget(widget);
          bapp.homeViewWidgetClick(widget);
          self.updateOverallOrder({
            forceSync: true,
            callback: function () { util.clearUIBlock('new-widget'); }
          });
        }
      });
      this.lastMod = 1;
    },
    
    updateOverallOrder: function (options) {
      var i = 0, worder = {}, options = options || {}, changed = options.forceChange;
      this.each(function (widget) {
        if (!options.noUpdate) {
          var iconIdx = $(widget.homeView.el).index();
          changed = changed || widget.getOrder() != iconIdx;
          widget.setOrder(iconIdx);
        }
        worder[widget.get('name')] = widget.getOrder();
      });

      // check if new worder is different than current worder
      var newNames = _.keys(worder)
        , oldNames = _.keys(bapp.worderDoc.worder)
        , changed  = changed
                  || newNames.length != oldNames.length
                  || newNames.length != _.intersect(newNames,oldNames).length
      ;
      if (!options.noSync && changed && (util.reserveUI() || options.forceSync)) {
        // tell server to update order
        bapp.worderDoc.worder = worder;
        bapp.syncWorderDoc(options.callback);
      }
    }
    
  });
  
  // -----------------------------------------------
  var superObj = {
    resize: window.MobileAppView.prototype.resize,
    transition: window.MobileAppView.prototype.transition,
    goHome: window.MobileAppView.prototype.goHome
  }
  window.MobileAppView = window.MobileAppView.extend({
    
    events: {
      'click .back-btn':      'goBack',
      'click .go-home':       'goHome',
      'click .wtab':          'onWidgetTabClick'
    },

    goBack: function () {
      // a widget is guarenteed to be being edited,
      // since back buttons only live in widget pages.
      if (bapp.currentEditor.widget.pageView.onBackBtnClick)
        return bapp.currentEditor.widget.pageView.onBackBtnClick();
      this.transition('back');
    },
    
    goHome: function (e) {
      var editor = bapp.currentEditor;
      if (editor && editor.hasChanges()) {
        if (confirm(unsavedChangesText)) {
          editor.onDiscardByNavigation();
          editor.stopEditing();
        }
        else return;
      }
      else if (editor) editor.stopEditing();

      e && e.preventDefault();
      superObj.goHome.call(this);
    },
    
    goToPage: function (widgetName) {
      mapp.transition('forward');
    },
    
    onWidgetTabClick: function (e) {
      e.preventDefault();
      bapp.startEditingPanel('tabBar');
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
    
    resize: function (height) {
      var newHeight = superObj.resize.call(this,height);
      var emulatorWidth = 320 + util.scrollbarWidth();
      $('#emulator').width(emulatorWidth);
    }
  });
  
  // ----------------------------------
  BuilderAppController = Backbone.Controller.extend({
    routes: {
      'edit-tab-bar':  'editTabBar',
      'edit-settings': 'editSettings',
      'edit-keywords': 'editKeywords'
    },
    editTabBar: function () {
      bapp.startEditingPanel('tabBar');
    },
    editSettings: function () {
      bapp.startEditingPanel('settings');
    },
    editKeywords: function () {
      bapp.startEditingPanel('keywords');
    }
  });

  // ----------------------------------
  BuilderAppView = Backbone.View.extend({
    
    // can either be 'edit' or 'emulate'
    mode: 'edit',
    idleTemplate: util.getTemplate('edit-widget-idle'),
    
    tabBarEditor: new window.EditTabBarView(),
    settingsEditor: new window.EditSettingsView(),
    keywordsEditor: new window.EditKeywordsView(),
    
    initialize: function () {
      _.bindAll(this,'rebindSortables');

      new BuilderAppController();
      
      window.Widgets.prototype.url = 'http://'+g.couchLocation+'/m_' + g.db_name +
         '/_design/widgets/_view/by_name?include_docs=true',
      
      window.mapp = new MobileAppView({
        widgetsInUse: new BuilderWidgets(),
        homeViewWidgets: 'widgetsInUse',
        showInvalidWidgets: true,
        scrollElem: $('#mobile-scroller')
      });
      
      mapp.widgetsInUse.bind('add',mapp.homeView.render);
      mapp.widgetsInUse.bind('remove',mapp.homeView.render);

      mapp.homeView.bind('render',this.rebindSortables);
      mapp.homeView.bind('render',function () {
        util.log('CHECKING',mapp.widgetsInUse,mapp.widgetsInUse.lastMod);
        if (mapp.widgetsInUse.lastMod == 1) {
          var height = mapp.homeView.el.height();
          $('#mobile-scroller').animate({ scrollTop:height },3000);
        }
      });
      
      // first fetch overall widget order
      var self = this;
      mapp.fetchWorder(function (worderDoc) {

        self.worderDoc = worderDoc;
        mapp.worder = worderDoc.worder;
        mapp.wtabs  = worderDoc.wtabs;
        
        // now fetch the widgets themselves
        mapp.widgets.fetch({
          success: function (widgets,res) {
            
            mapp.widgetsInUse.refresh(widgets.models);
            mapp.widgetsInUse.updateOverallOrder({ noSync:true });

            // TODO: grab data from server (bdata)
            var widgetsAvailable =  _.map(bdata, function (data) {
              var wdata = _.extend({},data);
              delete wdata.editAreaTemplate;
              
              if (wdata.singleton)
                wdata.singletonInUse = !!mapp.widgetsInUse.findByName(wdata.name);
              return wdata;
            });
            mapp.widgetsAvailable.refresh( _.compact(widgetsAvailable) );
          
            util.toggleLoaderOverlay(false);
            util.log('fetch',widgets,mapp.widgetsAvailable,mapp.widgetsInUse);

            mapp.updateWtabs();
            Backbone.history.start();
          }
        });
      });
      
      this.sidebar = new SidebarView({
        widgets: mapp.widgetsAvailable,
        comparator: pluckName
      });
    },
    
    homeViewWidgetClick: function (widget) {
      if(this.mode == 'emulate') return true;

      var editor = this.currentEditor;
      var isDifferentWidget = editor && editor.widget != widget;

      if (editor && editor.widget) {
        editor.widget.homeView.highlight(false);
        if (editor.hasChanges() && isDifferentWidget) {
          if (confirm(unsavedChangesText)) {
            editor.onDiscardByNavigation();
          }
          else {
            editor.widget.homeView.highlight(true);
            return false;
          }
        }
      }
      this.currentEditor = widget.getEditor();
      this.currentEditor.startEditing(isDifferentWidget);
      // returning false will cause the mobile emulator to ignore the click
      return false;
    },
    
    addNewWidget: function (name,wtype,singleton) {
      util.log('adding new widget',name,wtype);
      if (!util.reserveUI()) return;
      var self = this;
      
      this.validateWidgetName(name,wtype,singleton, {
        isNewWidget: true,
        onValid: function (validName) {
          var newWidget = self.sidebar.cloneWidget(wtype,name);
      
          if (newWidget) {
            newWidget.set({ name:validName });
            mapp.widgetsInUse.add(newWidget);

            if (newWidget.get('singleton'))
              bapp.sidebar.setSingletonInUse(newWidget,true);
          }
          $('#builder .drophover-overlay').hide();
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
    validateWidgetName: function (name,wtype,singleton,options) {
      var error = null
        , self = this
        , options = options || {}
        , prettyName = util.prettifyName(name)
        , isValid = !!name.match(/^[a-z0-9\-]*$/) || (error = 'Invalid name')

        , exception = options.exception || '_'
        , isSameName = function (w) { var n=w.get('name'); return n == name && n != exception; }
        , isValid = error || !mapp.widgetsInUse.find(isSameName) || (error = 'Name already in use.')
        , isValid = error || prettyName.length >= 2 || (error = 'Name is too short (minimum 2 characters).')
        , isValid = error || prettyName.length <= 22 || (error = 'Name is too long (22 characters max).')
        , singletonNamesInUse = error || (singleton && []) || _.map(bapp.sidebar.singletonsInUse(), pluckPrettyName)
        , isValid = error || !_.include(singletonNamesInUse,prettyName) || (error = 'Sorry, that name is reserved.')
      ;
      
      if (isValid === true) return options.onValid(name);

      if (options.isNewWidget) {
        var numberMatch = name.match(/[^0-9]([0-9]+)$/);

        if (numberMatch) {
          var matchIdx = name.indexOf(numberMatch[1])
            , number = parseInt( name.substring(matchIdx) )
            , newName = name.substring(0,matchIdx) + (number + 1)
          ;
        }
        else { var newName = name + '2'; }

        this.validateWidgetName(newName,wtype,singleton,options);
        return false;
      }
      
      // find ALL widgets of this wtype
      var isSameWtype = function (w) { return w.get('wtype') == wtype }
        , existingNames = _.map(mapp.widgetsInUse.select(isSameWtype), pluckPrettyName)
      ;
      var dialogHtml = util.getTemplate('add-widget-dialog')({
        wtype: wtype.toUpperCase(),
        defaultName: util.prettifyName(name),
        names: existingNames,
        error: error
      });

      var buttons = {};

      var actionName = options.mode === 'rename' ? 'Save Name' : 'Add New Widget';
      buttons[actionName] = function () {
        var newName = $(this).find('input[name=wname]').val()
          , newName = $.trim(newName)
          , newName = util.uglifyName(newName)
            newName = util.scrubUglyName(newName)
        ;
        $(this).dialog("close");

        self.validateWidgetName(newName,wtype,singleton,options);
      };

      buttons['Cancel'] = function() {
        $(this).dialog("close");
        options.onCancel && options.onCancel();
      };

      util.dialog(dialogHtml,buttons);
    	
    	return false;
    },
    
    removeWidget: function (widget) {
      this.tabBarEditor.removeTabIfExists(widget.get('name'));
      mapp.widgetsInUse.remove(widget);

      util.pushUIBlock(widget.get('name'));
      widget.destroy({
        error: function (model,res) {
          util.log('error saving',model,res);
          // TODO: notify user
          // util.releaseUI();
          util.clearUIBlock(widget.get('name'));
          util.releaseWidget(model);
        },
        success: function (deadWidget,res) {
          util.log('Saved widget',deadWidget,res);
          // util.releaseUI();
          util.clearUIBlock(widget.get('name'));
          util.releaseWidget(deadWidget);
          // TODO: use data from server
          if (deadWidget.get('singleton'))
            bapp.sidebar.setSingletonInUse(deadWidget,false);
        }
      });
    },
    
    rebindSortables: function () {
      g.homeDbx.initBoxes();
    },
    
    syncWorderDoc: function (callback) {
      util.log('Syncing worder...',bapp.worderDoc);
      util.pushUIBlock('worder');

      $.post('/order',bapp.worderDoc,function (newWorderDoc) {
        bapp.worderDoc = newWorderDoc;
        mapp.worder = newWorderDoc.worder;
        mapp.wtabs  = newWorderDoc.wtabs;
        util.clearUIBlock('worder');
util.log('WORDER SYNC CALLBACK',callback);
        callback && callback();
      });
    },
    
    startEditingPanel: function (panelType) {
      if (this.currentEditor) {
        this.currentEditor.stopEditing();
        mapp.goHome();
      }
      this[panelType + 'Editor'].startEditing();
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
    'freeform-insert',   // orientation ['vertical'|'horizontal'|'freeform'|'freeform-insert'|'confirm']
    '7',                 // drag threshold ['n' pixels]
    'no',                // restrict drag movement to container/axis ['yes'|'no']
    '10',                // animate re-ordering [frames per transition, or '0' for no effect]
    'no' ,               // include open/close toggle buttons ['yes'|'no']
    'open',              // default state ['open'|'closed']

    'open',                                          // word for "open", as in "open this box"
    'close',                                         // word for "close", as in "close this box"
    '',          // sentence for "move this box" by mouse
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
      var targetHeight = $('#emulator').height() + 8;
      $('#builder .drophover-overlay').height(targetHeight).show();
    },
    out: function () {
      $('#builder .drophover-overlay').hide();
    },
    drop: function (e,ui) {
      
      if (mapp.pageLevel != 0) {
        $('#dialog-invalid-drag').dialog({
          modal: true,
          buttons: {
            Ok: function () {
              $(this).dialog('close');
              $('#builder .drophover-overlay').hide();
            }
          }
        });
        return;
      }
      
      var editor = bapp.currentEditor;
      if (editor && editor.hasChanges()) {
        if (!confirm(unsavedChangesText)) {
          $('#builder .drophover-overlay').hide();
          return false;
        }
        else {
          editor.onDiscardByNavigation();
          editor.stopEditing();
        }
      }
      
      var elem = $(ui.draggable)
        , name = elem.data('name')
        , wtype = elem.data('wtype')
        , singleton = elem.hasClass('singleton')
      ;
      if(!elem.hasClass('sidebar')) return;
      
      util.log('dropped',name,wtype,singleton);
      bapp.addNewWidget(name,wtype,singleton);
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
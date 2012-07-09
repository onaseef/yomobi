(function ($) {

  var i18n = g.i18n.builder_app;
  var pluckName = function (w) { return w.get('name'); };

  window.unsavedChangesText = i18n.unsavedChangesText;

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
      widget.setOrder( _.keys(mapp.metaDoc.worder).length+1 );
      this.sort({ silent:true });
      this.updateOverallOrder({ noUpdate:true });

      // util.reserveWidget(widget,true);
      var self = this;

      util.pushUIBlock('new-widget');
      widget.save(null,{
        success: function () {
          // util.releaseWidget(widget);
          bapp.homeViewWidgetClick(widget);
          self.updateOverallOrder({
            bypassUIReserve: true,
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
        worder[widget.id] = widget.getOrder();
      });

      if (options.noSync) return;

      // check if new worder is different than current worder
      var newNames = _.keys(worder)
        , oldNames = _.keys(mapp.metaDoc.worder)
        , changed  = changed
                  || newNames.length != oldNames.length
                  || newNames.length != _.intersect(newNames,oldNames).length
      ;
      if (changed && (util.reserveUI() || options.bypassUIReserve) || options.forceSync) {

        if (options.forceSync) util.reserveUI();
        // tell server to save updated order
        mapp.metaDoc.worder = worder;
        bapp.syncMetaDoc(options.callback);
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
      'click .back-btn':              'goBack',
      'click .tab-bar':               'editTabBar',
      'click .company-info .name':    'editSettings',
      'click .company-info .logo':    'editSettings',
      'click .company-info .slogan':  'editSettings'
    },

    goBack: function () {
      // a widget is guarenteed to be being edited (bapp.currentEditor),
      // since back buttons only live in widget pages.

      if (bapp.currentEditor.onBackBtnClick) {
        if (bapp.currentEditor.onBackBtnClick() === false) return;
      }

      if (bapp.currentEditor.widget.pageView.onBackBtnClick)
        return bapp.currentEditor.widget.pageView.onBackBtnClick();

      this.transition('back');
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

    resize: function (height) {
      var newHeight = superObj.resize.call(this,height);
      var emulatorWidth = 320 + util.scrollbarWidth();
      $('#emulator').width(emulatorWidth);
    },

    editSettings: function () {
      if (bapp.panelHasUnsavedChanges()) return false;
      bapp.startEditingPanel('settings');
    },
    editTabBar:   function (e) {
      e && e.preventDefault();
      if (bapp.panelHasUnsavedChanges()) return false;

      if (window.location.href.indexOf('#edit-tab-bar') === -1) {
        window.location.href = '#edit-tab-bar';
      } else {
        bapp.startEditingPanel('tabBar');
      }
    }
  });

  // ----------------------------------
  BuilderAppController = Backbone.Controller.extend({
    routes: {
      'edit-widget': 'editWidget',
      'edit-tab-bar':  'editTabBar',
      'edit-settings': 'editSettings',
      'edit-advanced-settings': 'editAdvancedSettings',
      'customize': 'customize'
    },
    editWidget: function () {
    },
    editTabBar: function () {
      if (bapp.panelHasUnsavedChanges()) return false;
      bapp.startEditingPanel('tabBar');
    },
    editSettings: function () {
      if (bapp.panelHasUnsavedChanges()) return false;
      bapp.startEditingPanel('settings');
    },
    editAdvancedSettings: function () {
      if (bapp.panelHasUnsavedChanges()) return false;
      bapp.startEditingPanel('advancedSettings');
    },
    customize: function () {
      if (bapp.panelHasUnsavedChanges()) return false;
      bapp.startEditingPanel('customize');
    }
  });

  // ----------------------------------
  BuilderAppView = Backbone.View.extend({

    // can either be 'edit' or 'emulate'
    mode: 'edit',
    idleTemplate: util.getTemplate('edit-widget-idle'),

    tabBarEditor: new window.EditTabBarView(),
    settingsEditor: new window.EditSettingsView(),
    advancedSettingsEditor: new window.EditAdvancedSettingsView(),
    customizeEditor: new window.CustomizeView(),

    widgetsAvailable: new Widgets(),

    initialize: function () {
      _.bindAll(this,'rebindSortables');

      this.router = new BuilderAppController();

      window.Widgets.prototype.url = 'http://'+g.couchLocation+'/m_' + g.db_name +
         '/_design/widgets/_view/by_name?include_docs=true',

      window.mapp = new MobileAppView({
        widgets: new BuilderWidgets(),
        showInvalidWidgets: true,
        scrollElem: $('#mobile-scroller')
      });

      mapp.bind('render', this.bindHoverTooltips);

      mapp.widgets.bind('add',mapp.homeView.render);
      mapp.widgets.bind('remove',mapp.homeView.render);

      mapp.homeView.bind('render',this.rebindSortables);
      mapp.homeView.bind('render',function () {

        if (mapp.widgets.lastMod == 1) {
          var height = mapp.homeView.el.height();
          $('#mobile-scroller').animate({ scrollTop:height },3000);
          mapp.widgets.lastMod = 0;
        }
      });

      // first fetch overall widget order
      var self = this;
      mapp.fetchMetaDoc(function (metaDoc) {

        mapp.metaDoc = metaDoc;
        mapp.render();

        // now fetch the widgets themselves
        mapp.widgets.fetch({
          success: function (widgets,res) {

            mapp.widgets.refresh(widgets.models);
            mapp.widgets.updateOverallOrder({ noSync:true, noUpdate:true });
            mapp.homeView.render();

            if (mapp.metaDoc.worderInit) {
              mapp.initializeWorder();
              mapp.widgets.updateOverallOrder({ noUpdate:true, forceSync:true });
              mapp.homeView.render();
            }

            var widgetsAvailable =  _.map(bdata, function (data) {
              if (data.hideFromSidebar) return;

              var wdata = _.extend({},data);
              delete wdata.editAreaTemplate;

              if (wdata.singleton)
                wdata.singletonInUse = !!mapp.widgets.findByType(wdata.wtype,wdata.wsubtype);
              return wdata;
            });
            self.widgetsAvailable.refresh( _.compact(widgetsAvailable) );

            util.toggleLoaderOverlay(false);
            util.log('fetch',widgets,self.widgetsAvailable,mapp.widgets);

            mapp.updateWtabs();
            Backbone.history.start();

            // this workaround is required for IE
            if (g.openEditSettings) {
              bapp.startEditingPanel('settings');
            }
          }
        });
      });

      this.sidebar = new SidebarView({
        widgets: this.widgetsAvailable,
        comparator: pluckName
      });
    },

    homeViewWidgetClick: function (widget) {
      if(this.mode == 'emulate') return true;
      if (bapp.panelHasUnsavedChanges()) return false;

      var editor = this.currentEditor;
      var isSameWidget = editor && editor.widget === widget;
      if (isSameWidget) return false;

      if (editor && editor.widget) {
        editor.widget.homeView.highlight(false);
        if (editor.hasChanges()) {
          if (!confirm(unsavedChangesText)) {
            editor.onDiscardByNavigation();
          }
          else {
            editor.widget.homeView.highlight(true);
            return false;
          }
        }
      }
      this.currentEditor = widget.getEditor();
      this.currentEditor.startEditing(true,true);
      this.router.saveLocation('edit-widget');
      // returning false will cause the mobile emulator to ignore the click
      return false;
    },

    addNewWidget: function (name,wtype,wsubtype,isSingleton) {
      util.log('adding new widget',name,wtype,wsubtype);
      if (!util.reserveUI()) return;
      var self = this;

      this.validateWidgetName(name,wtype,isSingleton, {
        isNewWidget: true,
        onValid: function (validName) {
          var newWidget = util.newWidgetByType(wtype,wsubtype);

          if (newWidget) {
            newWidget.set({ name:validName });
            mapp.widgets.add(newWidget);

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
    // NOTE: `name` is already in prettified form
    //
    validateWidgetName: function (name,wtype,isSingleton,options) {
      var error = null
        , self = this
        , options = options || {}

        , cname = util.toComparableName(name)

        , exception = options.exception || '_'
        , isSameName = function (w) { var n=w.cname; return n == cname && n != exception; }
        , isValid = error || !mapp.widgets.find(isSameName) || (error = i18n.name_already_in_use)
        , isValid = error || name.length >= 2 || (error = i18n.name_too_short)
        , isValid = error || name.length <= 22 || (error = i18n.name_too_long)
        , singletonNames = error || (isSingleton && []) || bapp.sidebar.getSingletons()
        , isValid = error || !_.include(singletonNames,name) || (error = i18n.name_reserved)
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

        this.validateWidgetName(newName,wtype,isSingleton,options);
        return false;
      }

      var dialogHtml = util.getTemplate('add-widget-dialog')({
        defaultName: name,
        error: error
      });

      var buttons = {};

      var actionName = options.mode === 'rename' ? i18n.save_name : i18n.add_new_widget;
      buttons[actionName] = function () {
        var newName = $(this).find('input[name=wname]').val()
          , newName = $.trim(newName)
        ;
        $(this).dialog("close");

        self.validateWidgetName(newName,wtype,isSingleton,options);
      };

      buttons[i18n.cancel] = function() {
        $(this).dialog("close");
        options.onCancel && options.onCancel();
      };

      util.dialog(dialogHtml,buttons);

    	return false;
    },

    removeWidget: function (widget) {
      this.tabBarEditor.removeTabIfExists(widget.id);
      mapp.widgets.remove(widget);

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
          mapp.widgets.updateOverallOrder({
            bypassUIReserve: true,
            callback: function () {
              util.clearUIBlock(widget.get('name'));
              util.releaseWidget(deadWidget);
              // TODO: use data from server
              if (deadWidget.get('singleton'))
                bapp.sidebar.setSingletonInUse(deadWidget,false);
            }
          });
        }
      });
    },

    rebindSortables: function () {
      g.homeDbx.initBoxes();
    },

    syncMetaDoc: function (callback) {
      util.log('Syncing meta...',mapp.metaDoc);
      util.pushUIBlock('meta');

      $.post('/order',mapp.metaDoc,function (newMetaDoc) {
        newMetaDoc.worder || (newMetaDoc.worder = {});
        mapp.metaDoc = newMetaDoc;
        util.clearUIBlock('meta');
        callback && callback();
      });
    },

    startEditingPanel: function (panelType) {
      var editor = this.currentEditor;
      if (editor && editor.hasChanges()) {
        if (!confirm(unsavedChangesText)) {
          editor.onDiscardByNavigation();
          editor.stopEditing();
          delete bapp.currentEditor;
        }
        else {
          this.router.revert();
          return false;
        }
      }
      else if (editor) {
        editor.stopEditing();
        delete bapp.currentEditor;
      }
      if (bapp.panelHasUnsavedChanges()) return false;
      mapp.goHome();
      this.currentPanel = this[panelType + 'Editor'];
      this.currentPanel.startEditing();
    },

    bindHoverTooltips: function () {
      $('#top-bar .company-info')
        .find('.logo').simpletooltip(bhelp.hoverHelpText.companyLogo, 'help').end()
        .find('.name').simpletooltip(bhelp.hoverHelpText.companyName, 'help').end()
        .find('.slogan').simpletooltip(bhelp.hoverHelpText.companySlogan, 'help').end()
      ;
      $('#top-bar .tab-bar').simpletooltip(bhelp.hoverHelpText.tabBar, 'help');
    },

    panelHasUnsavedChanges: function () {
      if (this.currentPanel && this.currentPanel.hasChanges()) {
        var shouldDiscard = confirm('You have unsaved changes. Discard them?');
        shouldDiscard && this.currentPanel.discardChanges({ byNavigation:true });

        if (!shouldDiscard && this.router.prevHash) {
          this.router.revert();
        }
        return !shouldDiscard;
      }
      return false;
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
      bapp.sidebar.addNewWidgetViaTargetedElem(ui.draggable);
    }
  }).disableSelection();

  window.bapp = new BuilderAppView();

  // more drag & drop logic
  g.rearrangeManager.onbeforestatechange = function () {
    return util.isUIFree();
  };

  g.rearrangeManager.onstatechange = mapp.widgets.updateOverallOrder;

  g.rearrangeManager.onboxdrag = function () {
    return util.isUIFree();
  };

})(jQuery);
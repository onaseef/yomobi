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
      if(newWidget)
        mapp.widgetsInUse.add(newWidget);
    },
    
    removeWidget: function (widget) {
      mapp.widgetsInUse.remove(widget);
      this.sidebar.markWidgetAsAvailable(widget);

      widget.save({ available_:true }, {
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
  
  window.bapp = new BuilderAppView();
  
  // make stuff (dragg|dropp)able
  $('#emulator #home.page .content').sortable({
    tolerance: 'pointer',
    items: '.home-icon',
    placeholder: 'home-icon-placeholder',
    forcePlaceholderSize: true,
    update: function (event,ui) {
      $('#home.page .content .home-icon .title').each(function (idx,elem) {
        var codeName = util.uglifyName($(elem).text());
        util.log('sorting',codeName,idx);
        mapp.widgetsInUse.updateOrder(codeName,idx);
      });
    }
  });
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
})(jQuery);
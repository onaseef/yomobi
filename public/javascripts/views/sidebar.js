(function ($) {
  
  SidebarView = Backbone.View.extend({
    
    el: $('#sidebar'),
    
    widgetTemplate: util.getTemplate('sidebar-widget'),
    
    initialize: function (widgets) {
      var self = this;
      _.bindAll(this,'render');

      this.widgets = widgets;
      this.widgets.bind('add',this.render);
      this.widgets.bind('remove',this.render);
      this.widgets.bind('refresh',this.render);
      
      this.el.find('.widgets .home-icon').live('mouseover',makeDraggable);
      this.render();
    },
    
    render: function () {
      var w_area = $('#sidebar .widgets').empty()
        , self = this
      ;
      util.log(this.widgets);
      this.widgets.each(function (widget) {
        util.log('sidebar render',widget);
        w_area.append( self.widgetTemplate(widget.toJSON()) );
      });
    },
    
    markWidgetAsInUse: function (widgetName) {
      var found = this.widgets.find(function (w) {
        return w.get('name') == widgetName;
      });
      this.widgets.remove(found);
      util.log('markAsInUse',widgetName,found,this.widgets);
      found.unset('available_');
      return found;
    },
    
    markWidgetAsAvailable: function (widget) {
      // TODO: use server data instead (represented by bdata)
      
      // It's important to set available_ first, because setting order
      // when available_ === true will prevent the widget
      // from auto updating
      widget.set({ available_:true });
      widget.set({ order:-1 });
      this.widgets.add(widget);
    }
    
  });
  
})(jQuery);

function makeDraggable () {
  if ($(this).data("init")) return;
  $(this).data("init", true)
         .draggable({ revert:'invalid', zIndex:99 })
         .disableSelection()
  ;
}

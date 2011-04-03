(function ($) {
  
  SidebarView = Backbone.View.extend({
    
    el: $('#sidebar'),
    
    widgetTemplate: util.getTemplate('sidebar-widget'),
    
    initialize: function (widgets) {
      var self = this;
      _.bindAll(this,'render');

      this.widgets = widgets;
      // this.widgets.bind('add',this.render);
      // this.widgets.bind('remove',this.render);
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
    
    cloneWidgetByName: function (widgetName) {
      var found = this.widgets.find(function (w) {
        return w.get('name') == widgetName;
      });
      // this.widgets.remove(found);
      util.log('cloneWidgetByName',widgetName,found,this.widgets);
      if (found) {
        found = new Widget(found.attributes);
        found.set({ order:0 },{ silent:true });
      }
      return found;
    }
    
  });
  
})(jQuery);

function makeDraggable () {
  if ($(this).data("init")) return;
  $(this).data("init", true)
         .draggable({ revert:true, zIndex:99 })
         .disableSelection()
  ;
}

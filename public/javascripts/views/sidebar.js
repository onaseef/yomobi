(function ($) {
  
  SidebarView = Backbone.View.extend({
    
    el: $('#sidebar'),
    
    widgetTemplate: util.getTemplate('sidebar-widget'),
    
    initialize: function (options) {
      var self = this;
      _.bindAll(this,'render');

      this.widgets = options.widgets;
      // this.widgets.bind('add',this.render);
      // this.widgets.bind('remove',this.render);
      this.widgets.bind('refresh',this.render);
      
      this.el.find('.widgets .home-icon').live('mouseover',makeDraggable);
      this.render();
    },
    
    setSingletonInUse: function (wname,inUse) {
      var w = this.widgets.find(function (w) { return w.get('name') == wname; });
      w.set({ singletonInUse:inUse });
      this.render();
    },
    
    render: function () {
      var w_area = $('#sidebar .widgets').empty()
        , self = this
      ;
      util.log(this.widgets);
      this.widgets.each(function (widget) {
        if (widget.get('singletonInUse')) return;
        w_area.append( self.widgetTemplate(widget.toJSON()) );
      });
    },
    
    cloneWidgetByType: function (widgetType) {
      var found = this.widgets.find(function (w) {
        return w.get('wtype') == widgetType;
      });
      // this.widgets.remove(found);
      util.log('cloneWidgetByType',widgetType,found,this.widgets);
      if (found) {
        found = util.newWidget(found.attributes);
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

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
    
    setSingletonInUse: function (widget,inUse) {
      var w = this.widgets.find(function (w) {
        return w.get('name') == widget.get('name') &&
               w.get('wtype') == widget.get('wtype');
      });
      w.set({ singletonInUse:inUse });
      this.render();
    },
    
    render: function () {
      var w_area = $('#sidebar .widgets').empty()
        , self = this
      ;
      this.widgets.each(function (widget) {
        if (widget.get('singletonInUse')) return;
        w_area.append( self.widgetTemplate(widget.getIconData()) );
      });
      w_area.append('<div class="clearfix">');
    },
    
    cloneWidget: function (wtype,name) {
      var found = this.widgets.find(function (w) {
        return w.get('wtype') == wtype && w.get('name') == name;
      });
      // this.widgets.remove(found);
      util.log('cloneWidgetByType',wtype,name,found);
      if (found) {
        found = util.newWidget(found.attributes);
      }
      return found;
    }
    
  });
  
})(jQuery);

function makeDraggable () {
  if ($(this).data("init")) return;
  $(this).data("init", true)
         .draggable({ helper:'clone', revert:'invalid', zIndex:99 })
         .disableSelection()
  ;
}

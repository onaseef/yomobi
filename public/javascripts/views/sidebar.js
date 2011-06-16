(function ($) {
  
  var singletonInUseTooltip = "<p>You may only use <b>one</b> of this type of widget at a time.</p><p>This widget is already in your Yomobi mobile website.</p>";

  SidebarView = Backbone.View.extend({
    
    el: $('#sidebar'),
    
    widgetTemplate: util.getTemplate('sidebar-widget'),

    events: {
      'click #preview-mobile-site': 'previewMobileSite',
      'click .edit-tab-bar': 'tellBappToEditTabBar',
      'click .edit-settings': 'tellBappToEditSettings'
    },
    
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

    isSingletonInUse: function (name,wtype) {
      var w = this.widgets.find(function (w) {
        return w.get('name') == name && w.get('wtype') == wtype;
      });
      return w && w.get('singletonInUse');
    },
    
    singletonsInUse: function () {
      return this.widgets.select(function (w) { return !!w.get('singleton'); });
    },

    render: function () {
      var w_area = $('#sidebar .widgets').empty()
        , self = this
      ;
      this.widgets.each(function (widget) {
        // if (widget.get('singletonInUse')) return;
        var icon = self.widgetTemplate(widget.getIconData());
        w_area.append(icon);
        if (widget.get('singletonInUse')) {
          w_area.find('.home-icon:last')
            .addClass('singletonInUse')
            .simpletooltip(singletonInUseTooltip)
            .mousedown(function () { return false; })
          ;
        }
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
    },

    previewMobileSite: function (e) {
      e.preventDefault();
      // if (typeof this.winRef == 'undefined' || this.winRef.closed) {
      var emulatorWidth = ($('#mobile-container').height() < 480) ? 320 : 320+util.scrollbarWidth();
      this.winRef = window.open(e.target.href,'Your_Mobile_Website',
        'width=' + emulatorWidth + ',height=480,scrollbars=yes');
    },

    tellBappToEditTabBar: function () { bapp.tabBarEditor.startEditing(); },
    tellBappToEditSettings: function () { bapp.settingsEditor.startEditing(); }
    
  });

  function makeDraggable () {
    $this = $(this);
    if ($this.data('init') || $this.hasClass('singletonInUse')) {
      return;
    }
    $this
      .data('init', true)
      .draggable({ helper:'clone', revert:'invalid', zIndex:99 })
      .disableSelection()
    ;
  }

})(jQuery);

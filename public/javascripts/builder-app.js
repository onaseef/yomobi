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
  
  // -----------------------------------------------
  EditWidgetView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-widget'),
    
    defaultEvents: {
      'click .accept-btn':          'accept',
      'click .remove-link':         'remove',
      'click .cancel-btn':          'cancel'
    },
    
    accept: function () {
      util.log('accept');
    },
    
    remove: function () {
      util.log('remove');
    },
    
    cancel: function () {
      util.log('discard');
      this.startEditing(this.editingWidget);
    },
    
    startEditing: function (widget) {
      this.editingWidget = widget;
      util.log('Editing widget:', widget.get('name'),widget.isNew());
      var editAreaData = this.getEditAreaData(widget)
        , templateData = _.extend(widget.toJSON(), editAreaData)
        // TODO: , events = _.extend({},this.defaultEvents,templateData.events)
        , events = _.extend({},this.defaultEvents)
      ;
      this.delegateEvents(events);
      this.el.html(this.template(templateData));
    },
    
    getEditAreaData: function (widget) {
      // TODO: grab edit area data from the server
      var data = bdata[widget.get('name')];
      data.editAreaContent = data.editAreaTemplate(widget.toJSON());
      return data;
    }
    
  });
  
  // ----------------------------------
  BuilderAppView = Backbone.View.extend({
    
    // can either be 'edit' or 'emulate'
    mode: 'edit',
    
    initialize: function () {
      this.editor = new EditWidgetView();
    },
    
    homeViewWidgetClick: function (widget) {
      if(this.mode == 'emulate') return true;

      this.editor.startEditing(widget);
      // returning false will cause the mobile emulator to ignore the click
      return false;
    }
    
  });
  
  window.mapp = new MobileAppView();
  window.bapp = new BuilderAppView();
})(jQuery);
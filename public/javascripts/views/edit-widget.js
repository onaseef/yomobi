(function ($) {
  
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
      util.showLoading(this.el.find('.action-bar'));
      
      // grab values from edit area
      var vals = {};
      util.getInputElements(this.el,'.edit-area').each(function (idx,elem) {
        vals[$(elem).attr('name')] = $(elem).val();
      });
      
      var self = this;
      this.editingWidget.save(vals, {
        error: function (model,res) {
          util.log('error saving',model,res);
          // TODO: notify user
        },
        success: function (model,res) {
          util.log('Saved widget',model,res);
          util.showSuccess(self.el.find('.action-bar'));
        }
      });
    },
    
    remove: function () {
      util.log('remove',this.editingWidget);
      if(!this.editingWidget) return;

      var yes = confirm('Are you sure you want to delete this widget?\n'+
                        '(all data will be lost)');

      if (yes) {
        bapp.removeWidget(this.editingWidget);
        delete this.editingWidget;
      }
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
      util.log('editarea',widget.get('name'),data,bdata);
      data.editAreaContent = data.editAreaTemplate(widget.toJSON());
      return data;
    }
    
  });
  
})(jQuery);
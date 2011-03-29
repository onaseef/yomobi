(function ($) {
  
  window.EditWidgetView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-widget'),
    
    defaultEvents: {
      'click .accept-btn':          'accept',
      'click .remove-link':         'remove',
      'click .cancel-btn':          'cancel'
    },
    
    initialize: function (widget) {
      this.widget = widget;
      var events = _.extend({},this.defaultEvents,this.events);
      this.delegateEvents(events);
      
      if (this.init) this.init();
    },
    
    accept: function () {
      util.log('accept');
      if (!util.reserveWidget(this.widget)) return;
      util.showLoading(this.el.find('.action-bar'));
      
      var values = this.grabWidgetValues();
      
      var self = this;
      this.widget.save(values, {
        error: function (model,res) {
          util.log('error saving',model,res);
          // TODO: notify user
          util.releaseWidget(model);
        },
        success: function (model,res) {
          util.log('Saved widget',model,res);
          util.showSuccess(self.el.find('.action-bar'));
          util.releaseWidget(model);
        }
      });
    },
    
    remove: function () {
      util.log('remove',this.widget);
      if (!this.widget) return;
      if (!util.reserveWidget(this.widget)) return;

      var yes = confirm('Are you sure you want to delete this widget?\n'+
                        '(all data will be lost)');

      if (yes) {
        bapp.removeWidget(this.widget);
        delete this.widget;
        this.stopEditing();
      }
      else {
        util.releaseWidget(this.widget);
      }
    },
    
    cancel: function () {
      util.log('discard');
      if (!util.reserveWidget(this.widget)) return;

      this.startEditing(this.widget);

      util.releaseWidget(this.widget);
    },
    
    startEditing: function () {
      util.log('Editing widget:',this.widget.get('name'),this.widget.isNew());
      var widget = this.widget
        , editAreaData = this.getEditAreaData(widget)
        , templateData = _.extend(widget.toJSON(), editAreaData)
      ;
      this.el.html(this.template(templateData));

      if (this.onEditStart) this.onEditStart();
    },
    
    getEditAreaData: function (widget) {
      // TODO: grab edit area data from the server
      var data = bdata[widget.get('name')];
      data.editAreaContent = data.editAreaTemplate(widget.getEditData());
      return data;
    },
    
    stopEditing: function () {
      this.el.empty();
    },
    
    grabWidgetValues: function () {
      var vals = {};
      util.getInputElements(this.el,'.edit-area').each(function (idx,elem) {
        vals[$(elem).attr('name')] = $(elem).val();
      });
      return vals;
    }
    
  });
  
})(jQuery);
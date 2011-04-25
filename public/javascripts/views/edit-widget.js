(function ($) {
  
  window.EditWidgetView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-widget'),
    
    defaultEvents: {
      'click .accept-btn':          'accept',
      'click .remove-link':         'remove',
      'click .cancel-btn':          'cancel',
      'click .widget-name':         'editName'
    },
    
    initialize: function (widget) {
      _.bindAll(this,'changeName');
      this.widget = widget;
      this.extendedEvents = _.extend({},this.defaultEvents,this.events);
      
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
          model.onSave && model.onSave();
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
        return true;
      }
      else {
        util.releaseWidget(this.widget);
        return false;
      }
    },
    
    cancel: function () {
      util.log('discard');
      if (!util.reserveWidget(this.widget)) return;

      this.startEditing(this.widget);

      util.releaseWidget(this.widget);
    },
    
    editName: function (e) {
      util.log('editName',e);
      var self = this;
      this.el
        .find('.widget-name').hide().end()
        .find('.widget-name-edit')
          .show()
          .find('input[type=text]')
            .focus()
            .blur(this.changeName)
            .keydown(function (e) { if (e.which == 13) self.changeName(e); })
          .end()
        .end()
      ;
    },
    
    changeName: function (e) {
      if (!util.reserveUI()) {
        $(e.target).focus();
        return;
      }
      var self = this
        , prettyName = $(e.target).unbind('blur').unbind('keydown').val()
        , newName = util.scrubUglyName( util.uglifyName(prettyName) )
        , oldName = this.widget.get('name')
      ;
      if (newName === oldName) {
        util.releaseUI();
        self.startEditing();
        return;
      }
      
      bapp.validateWidgetName(newName,this.widget.get('wtype'), {
        exception: oldName,
        
        onValid: function (validName) {
          util.pushUIBlock(validName);
          self.widget.save({ name:validName }, {
            success: function () { util.clearUIBlock(validName); }
          });
          self.startEditing();
        },
        onCancel: function () {
          util.releaseUI();
          self.startEditing();
        }
      });
      util.log('changeName',newName);
    },
    
    startEditing: function () {
      util.log('Editing widget:',this.widget.get('name'),this.widget.isNew());
      var widget = this.widget
        , editAreaData = this.getEditAreaData(widget)
        , templateData = _.extend(widget.toJSON(), editAreaData)
      ;
      this.el.html(this.template(templateData));
      this.delegateEvents(this.extendedEvents);

      if (this.onEditStart) this.onEditStart();
    },
    
    getEditAreaData: function (widget) {
      // TODO: grab edit area data from the server
      var data = bdata[widget.get('wtype')];
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
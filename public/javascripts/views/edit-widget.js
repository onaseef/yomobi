(function ($) {
  
  window.EditWidgetView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-widget'),
    
    defaultEvents: {
      'click .accept-btn':          'accept',
      'click .remove-link':         'remove',
      'click .cancel-btn':          'cancel',
      'click .widget-name':         'editName',
      'keyup input[type=text]':     'checkForChanges',
      'keyup textarea':             'checkForChanges'
    },
    
    initialize: function (widget) {
      _.bindAll(this,'changeName');
      this.widget = widget;
      this.extendedEvents = _.extend({},this.defaultEvents,this.events);
      this.changes = {};
      
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
          if (self.validForShowingStatus != model.validForShowing())
            mapp.homeView.render();
          self.startEditing(true);
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

      this.startEditing(true);

      util.releaseWidget(this.widget);
    },
    
    onDiscardByNavigation: function () {},

    editName: function (e) {
      util.log('editName',e);
      if (this.widget.get('singleton')) return;
      
      var self = this;
      this.el
        .find('.widget-name').hide().end()
        .find('.widget-name-edit')
          .find('input').val(this.widget.get('prettyName')).end()
          .show()
          .find('input[type=text]')
            .focus()
            .blur(this.changeName)
            .keydown(function (e) { if (e.which == 13) self.changeName(e); })
          .end()
        .end()
      ;
    },

    stopEditingName: function (switchToNewName) {
      var newName = this.el
        .find('.widget-name').show().end()
        .find('.widget-name-edit').hide()
          .find('input').val()
      ;
      if (switchToNewName) this.el.find('.widget-name').text(newName);
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
        this.stopEditingName();
        return;
      }
      
      bapp.validateWidgetName(newName,this.widget.get('wtype'),this.widget.get('singleton'), {
        exception: oldName,
        
        onValid: function (validName) {
          self.stopEditingName(true);
          util.pushUIBlock(validName);

          self.widget.save({ name:validName }, {
            success: function () {
              util.clearUIBlock(validName);
              bapp.tabBarEditor.replaceTabIfExists(oldName,newName);
              mapp.widgetsInUse.updateOverallOrder({ forceChange:true, forceSync:true });
            }
          });
        },
        onCancel: function () {
          util.releaseUI();
          self.stopEditingName();
        }
      });
      util.log('changeName',newName);
    },
    
    startEditing: function (resetChanges) {
      util.log('Editing widget:',this.widget.get('name'),this.widget.isNew());
      var widget = this.widget;
      this.validForShowingStatus = widget.validForShowing();

      if (resetChanges) this.changes = {};

      this.el.html( this.template(widget.getEditAreaData()) );
      this.delegateEvents(this.extendedEvents);

      widget.homeView.highlight(true);

      if (widget.get('singleton'))
        this.el.find('.change-label').remove();
      
      if (this.onEditStart) this.onEditStart(resetChanges);
    },
    
    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
      this.changes = {};
    },
    
    grabWidgetValues: function () {
      var vals = {};
      util.getInputElements(this.el,'.edit-area').each(function (idx,elem) {
        if ($(elem).attr('type') == 'checkbox')
          vals[$(elem).attr('name')] = $(elem).is(':checked');
        else
          vals[$(elem).attr('name')] = $(elem).val();
      });
      return vals;
    },

    checkForChanges: function (e) {
      var elem = $(e.target)
        , dataName = elem.attr('name')
        , newData = elem.val()
        , isChanged = this.widget.get(dataName) != newData
      this.setChanged(dataName,isChanged);
    },

    setChanged: function (dataName,isChanged) {
      if (isChanged) this.changes[dataName] = true;
      else delete this.changes[dataName];
    },

    hasChanges: function () {
      return _.keys(this.changes).length > 0;
    }
    
  });
  
})(jQuery);
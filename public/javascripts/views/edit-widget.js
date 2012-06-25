(function ($) {

  window.EditWidgetView = Backbone.View.extend({

    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-widget'),

    defaultEvents: {
      'click .accept-btn':          'accept',
      'click .remove-link':         'remove',
      'click .cancel-btn':          'cancel',
      'click a.rename-link':        'editName',
      'click a.edit-icon-link':     'editIcon',

      'keyup input[type=text][name!=wname]': 'checkForChanges',
      'keyup textarea':                      'checkForChanges'
    },

    initialize: function (widget) {
      _.bindAll(this,'changeName','refreshViews');
      this.widget = widget;
      this.extendedEvents = _.extend({},this.defaultEvents,this.events);
      this.changes = {};

      if (this.init) this.init();
    },

    accept: function (e,callback) {
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

          if (model.get('email')) {
            g.userEmails[model.get('wtype')] = model.get('email');
          }

          if (self.validForShowingStatus != model.validForShowing()
           || self.changes.icon
          ){
            mapp.homeView.render();
          }

          self.startEditing(true);
          callback && callback();
        }
      });
    },

    remove: function () {
      util.log('remove',this.widget);
      if (!this.widget) return;
      if (!util.reserveWidget(this.widget)) return;

      var yes = confirm(g.i18n.delete_widget);

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
      e.preventDefault();
      if (!this.widget._bdata.canRename) return;

      var self = this;
      this.el
        .find('.widget-name').hide().end()
        .find('.widget-name-edit')
          .find('input').val(this.widget.get('name')).end()
          .show()
          .find('input[type=text]')
            .focus()
            .blur(this.changeName)
            .keydown(function (e) { if (e.which == 13) self.changeName(e); })
          .end()
        .end()
      ;
    },

    editIcon: function (e) {
      util.log('editIcon');
      e.preventDefault();
      if (!this.widget._bdata.canEditIcon) return;

      this.editIconDialog = this.editIconDialog || new EditIconDialog();
      this.editIconDialog.model = this.widget;
      this.editIconDialog.options = {
        onClose: this.refreshViews
      };

      this.editIconDialog.prompt();
    },

    refreshViews: function (options) {
      util.log('refreshing', this.changes);
      this.widget.pageView.refresh && this.widget.pageView.refresh();
      mapp.resize();
      if (this.hasChanges()) this.accept();
      else if (options && options.forceEditAreaRefresh) this.startEditing();

      // if this is not done, the "choose file" button might
      // intercept some clicks and open the file dialog
      if (util._uploaders['dialog']) {
        util._uploaders['dialog'].sendToBack();
      }
    },

    stopEditingName: function () {
      var newName = this.el
        .find('.widget-name').show().end()
        .find('.widget-name-edit').hide()
          .find('input').val()
      ;
      this.el.find('.widget-name span').text(this.widget.get('name'));
    },

    changeName: function (e) {
      if (!util.reserveUI()) {
        $(e.target).focus();
        return;
      }
      var self = this
        , newName = $(e.target).unbind('blur').unbind('keydown').val()
        , oldName = this.widget.get('name')
      ;
      if (newName === oldName) {
        util.releaseUI();
        this.stopEditingName();
        return;
      }

      bapp.validateWidgetName(newName,this.widget.get('wtype'),this.widget.get('singleton'), {
        exception: util.toComparableName(oldName),
        mode: 'rename',
        onValid: function (validName) {
          util.pushUIBlock(validName);

          self.widget.save({ name:validName }, {
            success: function () {
              util.clearUIBlock(validName);
              self.stopEditingName();
              mapp.widgets.updateOverallOrder({ forceChange:true, bypassUIReserve:true });
              mapp.updateWtabs();
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

    startEditing: function (resetChanges,isFirstEdit) {
      util.log('Editing widget:',this.widget.get('name'),this.widget.isNew());
      var widget = this.widget
        , helpText = util.getWidgetBData(widget).help
        , editAreaData = _.extend(widget.getEditAreaData(),{ helpText: helpText })
      ;
      this.validForShowingStatus = widget.validForShowing();

      if (resetChanges) this.changes = {};

      this.el.html( this.template(editAreaData) );
      this.delegateEvents(this.extendedEvents);

      // set tabbing order
      this.el.find('input,textarea,select').each(function (idx,elem) {
        elem.setAttribute('tabindex', idx+1);
      });

      widget.homeView.highlight(true);

      this.el.find('p.help-text')
        .toggleClass('can-rename', widget._bdata.canRename)
        .toggleClass('can-edit-icon', widget._bdata.canEditIcon)
      ;
      this.$('.help-bubble').simpletooltip(undefined,'help');

      if (this.onEditStart) this.onEditStart(resetChanges,isFirstEdit);
    },

    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
      this.changes = {};
      this.widget && this.widget.homeView.highlight(false);
      this.onStopEditing && this.onStopEditing();
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
        , isChanged = (this.widget.get(dataName) || '') != newData
      this.setChanged(dataName,isChanged);
    },

    setChanged: function (dataName,isChanged) {
      if (isChanged === true) this.changes[dataName] = true;
      else delete this.changes[dataName];
    },

    hasChanges: function () {
      return _.keys(this.changes).length > 0;
    }

  });


  var editIconTemplate  = util.getTemplate('edit-icon-dialog')
    , closeFunc = function () { $(this).dialog('close'); }
  ;
  window.EditIconDialog = Backbone.View.extend({

    events: {
      'click .icons .wicon-opt':      'selectIcon'
    },

    selectIcon: function (e) {
      this.selectedIcon && this.selectedIcon.removeClass('selected');
      this.selectedIcon = $(e.target).addClass('selected');
      $(this.el).find('.selected-display')
        .find('.wicon-opt').attr('class', 'wicon-opt i-'+this.selectedIcon.data('name')).end()
        .find('label').text(this.selectedIcon.data('pname')).end()
        .show()
      ;
    },

    render: function () {
      var dialogHtml = editIconTemplate({
        icons: window.bicons
      });

      var self = this;
      $(this.el).html(dialogHtml)
        .attr('title',this.el.children[0].title)
      ;
      return this;
    },

    prompt: function () {
      delete this.selectedIcon;

      var dialogContent = this.render().el
        , self = this
        , buttons = {}
      ;
      buttons[g.i18n.save] = function () { $(this).dialog('close'); self.saveIcon(); };
      buttons[g.i18n.cancel] = closeFunc;

      util.dialog(dialogContent, buttons, dialogContent.title, { width:700 });
    },

    saveIcon: function () {
      if (!this.selectedIcon) return;

      util.log('saving icon', this.selectedIcon.data('name'));
      this.model.set({'iconName': this.selectedIcon.data('name')});
      bapp.currentEditor.setChanged('icon',true);
      this.options.onClose && this.options.onClose();
    }

  });

})(jQuery);
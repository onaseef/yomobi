(function ($) {

  var companyNameErrorText = 'Company name must be at least 2 characters and at least ' +
                              g.MAX_COMPANY_NAME_LENGTH+' characters';
  var desktopRedirectTooltip = '[tooltip help]';

  window.EditSettingsView = Backbone.View.extend({

    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-settings'),

    events: {
      'click input[type=submit]':     'validateInput',
      'change input[type=file]':      'enableUploadButton',
      'click input[type=file]':       'enableUploadButton',
      'click .remove-logo':           'onRemoveLogoClick'
    },

    validateInput: function () {
      var name = this.el.find('input[name=company_name]').val();
      if (name.length < 2 || name.length > g.MAX_COMPANY_NAME_LENGTH) {
        this.el.find('p.error').text(companyNameErrorText).show('pulsate',{ times:3 });
        return false;
      }
      this.el
        .find('input[type=submit]').attr('disabled','disabled').end()
        .find('.loader').show().end()
        .find('form').submit();
      ;
    },

    startEditing: function () {
      util.log('Editing Settings');

      this.el.html( this.template({
        wnames: _.keys(mapp.metaDoc.worder),
        wtabs: mapp.metaDoc.wtabs,
        header_color: g.header_color || util.defaultHeaderBackgroundColor,
        header_text_color: g.header_text_color || util.defaultHeaderTextColor
      }) )
        .find('.help-bubble').simpletooltip(undefined,'help').end()
        .find('input:file').keypress(function () { return false; }).end()
      ;
      this.delegateEvents();

      var self = this;
      util.spawnColorPicker(this.el.find('.color-picker'), {
        onChange: function (color,elem) {
          var targetName = $(elem).data('target');
          self.el.find('[name='+targetName+']').val(color);
        }
      });
    },

    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    },

    enableUploadButton: util.enableFileUploadButton,

    onRemoveLogoClick: function (e) {
      e.preventDefault();
      $(e.target).siblings('input[type=hidden]').val(1);
      this.el.find('form').submit();
    }

  });

})(jQuery);

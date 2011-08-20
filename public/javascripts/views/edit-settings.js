(function ($) {
  
  var companyNameErrorText = 'Company name must be at least 2 characters and at least ' +
                              g.MAX_COMPANY_NAME_LENGTH+' characters';
  var desktopRedirectTooltip = '[tooltip help]';

  window.EditSettingsView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-settings'),
    
    events: {
      'click input[type=submit]':     'validateInput',
      'click .read-only, textarea':   'selectText',
      'keyup .read-only, textarea':   'preventChange',
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

    selectText: function (e) {
      $(e.target).select();
    },

    preventChange: function (e) {
      var originalValue = $(e.target).data('orig-val');
      $(e.target).val(originalValue).select();
    },
    
    startEditing: function () {
      util.log('Editing Settings');
      
      this.el.html( this.template({
        wnames: _.keys(mapp.worder),
        wtabs: mapp.wtabs
      }) )
        .find('.help-bubble').simpletooltip(undefined,'help').end()
        .find('input:file').keypress(function () { return false; }).end()
      ;
      this.delegateEvents();
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

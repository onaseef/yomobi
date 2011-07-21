(function ($) {
  
  var companyNameErrorText = 'Company name must be at least 2 characters and at least 40 characters';
  var desktopRedirectTooltip = '[tooltip help]';

  window.EditSettingsView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-settings'),
    
    events: {
      'click input[type=submit]': 'validateInput',
      'click input[type=text], textarea': 'selectText',
      'keyup input[type=text], textarea': 'preventChange'
    },
    
    initialize: function () {
      
    },
    
    validateInput: function () {
      var name = this.el.find('input[name=company_name]').val();
      if (name.length < 2 || name.length > 40) {
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
        .find('.help-bubble').simpletooltip(desktopRedirectTooltip,'help')
      ;
      this.delegateEvents();
    },
    
    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    }
    
  });
  
})(jQuery);

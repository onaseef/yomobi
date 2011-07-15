(function ($) {
  
  var companyNameErrorText = 'Company name must be at least 2 characters and at least 40 characters';

  window.EditSettingsView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-settings'),
    
    events: {
      'click input[type=submit]': 'validateInput'
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
    
    startEditing: function () {
      util.log('Editing Settings');
      
      this.el.html( this.template({
        wnames: _.keys(mapp.worder),
        wtabs: mapp.wtabs
      }) );
      this.delegateEvents();
    },
    
    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    }
    
  });
  
})(jQuery);

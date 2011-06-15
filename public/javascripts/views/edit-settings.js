(function ($) {
  
  window.EditSettingsView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-settings'),
    errorCount: 0,
    
    events: {
      'click input[type=submit]': 'validateInput'
    },
    
    initialize: function () {
      
    },
    
    validateInput: function () {
      // /^[a-z0-9 _$()+-]{2,16}$/i
      var name = this.el.find('input[name=company_name]').val();
      if (!name.match(/^[a-z0-9 _$()+-]{2,16}$/i)) {
        this.el.find('p.error').text('Invalid company name ('+this.errorCount+')');
        this.errorCount += 1;
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

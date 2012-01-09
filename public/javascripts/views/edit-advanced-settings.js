(function ($) {

  window.EditAdvancedSettingsView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-advanced-settings'),
    
    events: {
      'click input[type=submit]': 'submit'
    },
    
    initialize: function () {
      
    },
    
    submit: function () {
      var self = this;
      var keywords = this.el
        .find('input[type=submit]').prop('disabled',true).end()
        .find('.checkmark').hide().end()
        .find('.loader').show().end()
        .find('textarea').val()
      ;
      $.post('/builder/adv-settings', { keywords:keywords }, function () {
        self.el
          .find('.checkmark').show().end()
          .find('.loader').hide().end()
          .find('input[type=submit]').prop('disabled',false).end()
        ;
        g.keywords = keywords;
      })
      .error(function (e,textStatus,errorThrown) {
        self.el
          .find('.loader').hide().end()
          .find('input[type=submit]').prop('disabled',false).end()
        ;
        self.el.find('p.error').text(e.responseText).show('pulsate',{ times:3 });
      });
    },
    
    startEditing: function () {
      util.log('Editing Settings');
      
      this.el.html( this.template({
        keywords: g.keywords
      }) );
      this.delegateEvents();
    },
    
    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    }
    
  });
  
})(jQuery);

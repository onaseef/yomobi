//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.booking = Widget.extend({
    
  });
  
  window.widgetPages.booking = WidgetPageView.extend({

    events: {
      'submit': 'submit'
    },
    
    init: function (widget) {
      _.bindAll(this,'submit');
    },
    
    submit: function () {
      var self = this
        , form = this.el.find('form')
        , url  = form.attr('action')
        , params = form.serialize()
        , method = form.attr('method')
        , error = this.validateParams( util.getFormValueHash(form) )
      ;
      if (error) {
        console.log('ERROR',error);
        this.showError(error.name,error.reason);
        return false;
      }

      $.post(url,params,function (data) {
        util.log('data',data);
        self.el
          .find('.input-wrap').hide().end()
          .find('.thanks-wrap').show().end()
        ;
      });
      
      return false;
    },

    showError: function (name,reason) {
      this.el.find('form .error').remove();
      var elem = this.el.find('form [name='+name+']');
      console.log('ELEM:',elem);
      elem.before( $('<p>').addClass('error').text(reason) );
    },

    validateParams: function (params) {
      console.log("Validating params:",params);

      params.phone = params.phone.replace(/[^0-9]+/g,'');
      if (params.phone.length != 10)
        return { name:'phone', reason:'Invalid phone number.' };
      return undefined;
    }

  });
  
})(jQuery);

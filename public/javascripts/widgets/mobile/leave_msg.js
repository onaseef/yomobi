//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.leave_msg = Widget.extend({
    
  });
  
  window.widgetPages.leave_msg = WidgetPageView.extend({

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
      ;
      $.post(url,params,function (data) {
        util.log('data',data);
        self.el
          .find('.input-wrap').hide().end()
          .find('.thanks-wrap').show().end()
        ;
      });
      
      return false;
    }
  })
  
})(jQuery);


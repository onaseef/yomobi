//
// MOBILE
//
(function ($) {
  
  window.widgetClasses.booking = Widget.extend({
    requiredAttrs: ['email'],

    getShowData: function () {
      var extraData = {
        times: util.clock15mIncrements()
      };
      return _.extend(this.toJSON(),extraData);
    }
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
      ;

      $.post(url,params,function (data) {
        util.log('data',data);
        self.el
          .find('.input-wrap').hide().end()
          .find('.thanks-wrap').show().end()
        ;
      })
      .error(function (e,textStatus,errorThrown) {
        var msg = prettyErrorMsg($.parseJSON(e.responseText))
        self.el.find('.response').html('ERROR: '+msg);
        mapp.resize();
      });
      
      return false;
    },

    showError: function (name,reason) {
      // this.el.find('form .error').remove();
      // var elem = this.el.find('form [name='+name+']');
      // elem.before( $('<p>').addClass('error').text(reason) );
      var msg = prettyErrorMsg($.parseJSON(e.responseText))
      self.el.find('.response').html('ERROR: '+msg);
      mapp.resize();
    },

    validateParams: function (params) {
      params.phone = params.phone.replace(/[^0-9]+/g,'');
      if (params.phone.length != 10)
        return { name:'phone', reason:'Invalid phone number.' };
      return undefined;
    }

  });
  
  function prettyErrorMsg (serverResponse) {
    var msg = '<ul>';
    if (serverResponse === "bad message")
      msg += '<li>You must provide both a name and phone number.</li>';
    else if (serverResponse === "bad phone")
      msg += '<li>Invalid phone number.</li>';
    util.log('SERVER RESPONSE',serverResponse);
    return msg + '</ul>';
  }

})(jQuery);

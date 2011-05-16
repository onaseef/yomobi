(function ($) {
  
  window.EditTabBarView = Backbone.View.extend({
    
    el: $('#builder .widget-editor'),

    template: util.getTemplate('edit-tab-bar'),
    
    events: {
      'change select': 'updateWtabs'
    },
    
    initialize: function () {
      
    },
    
    updateWtabs: function (e) {
      var self = this
        , $elem = $(e.target)
        , idx = $elem.attr('data-idx')
        , wname = util.uglifyName($elem.val())
        , wname = (wname == '==none==') ? '' : wname
      ;
      if (!util.reserveUI()) {
        $elem.val( util.prettifyName(mapp.wtabs[idx]) );
        return;
      }
      util.log('Updating wtabs',idx,wname);
      mapp.wtabs.splice(idx,1,wname);
      
      bapp.syncWorderDoc(function () {
        mapp.updateWtabs();
      });
    },
    
    startEditing: function () {
      util.log('Editing Tab Bar');
      
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
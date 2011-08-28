(function ($) {

  var pluckName = function (w) { return w && w.get('name'); };
    
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
        , wid = ($elem.val() == '==none==') ? '' : $elem.val()
      ;
      if (!util.reserveUI()) {
        $elem.val( util.prettifyName(mapp.wtabs[idx]) );
        return;
      }
      util.log('Updating wtabs',idx,wid);
      mapp.wtabs.splice(idx,1,wid);
      
      this.leftJustifyWtabs();
      
      bapp.syncMetaDoc(function () {
        mapp.updateWtabs();
        bapp.startEditingPanel('tabBar');
      });
    },

    leftJustifyWtabs: function () {
      leftJustified = _.compact(mapp.wtabs);
      while (leftJustified.length < 3) leftJustified.push('');
      // mapp.wtabs points to a special array; can't just reassign a new one
      mapp.wtabs.length = 0;
      _.each(leftJustified, function (t) { mapp.wtabs.push(t); });
    },

    removeTabIfExists: function (wid) {
      var isChanged = false;

      for (var i=0; i < mapp.wtabs.length; i++) {
        if (mapp.wtabs[i] == wid) {
          isChanged = true;
          mapp.wtabs[i] = '';
        }
      }
      if (isChanged) {
        this.leftJustifyWtabs();
        mapp.updateWtabs();
      }
    },
    
    startEditing: function () {
      util.log('Editing Tab Bar');
      
      var wtabNames = _(mapp.wtabs).chain().map(util.widgetById).map(pluckName).value();
      var widgetVals = _(mapp.worder).chain().keys().map(util.widgetById).compact().map(function (w) {
        return { id:w.get('id'), name:w.get('name') };
      }).value();

      this.el.html( this.template({
        widgetVals: widgetVals,
        wtabs: mapp.wtabs,
        wtabNames: wtabNames
      }) );
      this.delegateEvents();
    },
    
    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    }
    
  });
  
})(jQuery);
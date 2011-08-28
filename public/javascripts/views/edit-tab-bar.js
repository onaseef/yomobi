(function ($) {

  var pluckName = function (w) { return w.get('name'); };
    
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
        , wname = $elem.val()
        , wname = (wname == '==none==') ? '' : wname
      ;
      if (!util.reserveUI()) {
        $elem.val( util.prettifyName(mapp.wtabs[idx]) );
        return;
      }
      util.log('Updating wtabs',idx,wname);
      mapp.wtabs.splice(idx,1,wname);
      
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

    removeTabIfExists: function (name) {
      this.replaceTabIfExists(name,'');
    },

    replaceTabIfExists: function (name,newName) {
      var isChanged = false;

      for (var i=0; i < mapp.wtabs.length; i++) {
        if (mapp.wtabs[i] == name) {
          isChanged = true;
          mapp.wtabs[i] = newName;
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

      this.el.html( this.template({
        wnames: _(mapp.worder).chain().keys().map(util.widgetById).map(pluckName).value(),
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
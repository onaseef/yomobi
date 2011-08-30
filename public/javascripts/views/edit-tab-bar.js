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
        $elem.val( util.prettifyName(mapp.metaDoc.wtabs[idx]) );
        return;
      }
      util.log('Updating wtabs',idx,wid);
      mapp.metaDoc.wtabs.splice(idx,1,wid);
      
      this.leftJustifyWtabs();
      
      bapp.syncMetaDoc(function () {
        mapp.updateWtabs();
        bapp.startEditingPanel('tabBar');
      });
    },

    leftJustifyWtabs: function () {
      var wtabs = mapp.metaDoc.wtabs
        , leftJustified = _.compact(wtabs)
      ;
      while (leftJustified.length < 3) leftJustified.push('');
      // mapp.metaDoc.wtabs points to a special array; can't just reassign a new one
      wtabs.length = 0;
      _.each(leftJustified, function (t) { wtabs.push(t); });
    },

    removeTabIfExists: function (wid) {
      var isChanged = false
        , wtabs = mapp.metaDoc.wtabs
      ;
      for (var i=0; i < wtabs.length; i++) {
        if (wtabs[i] == wid) {
          isChanged = true;
          wtabs[i] = '';
        }
      }
      if (isChanged) {
        this.leftJustifyWtabs();
        mapp.updateWtabs();
      }
    },
    
    startEditing: function () {
      util.log('Editing Tab Bar');

      var wtabNames = _(mapp.metaDoc.wtabs).chain().map(util.widgetById).map(pluckName).value();

      var widgetVals = _(mapp.metaDoc.worder).chain()
        .keys()
        .map(util.widgetById)
        .compact()
        .map(function (w) {
          return { id:w.get('id'), name:w.get('name') };
        }).value()
      ;

      this.el.html( this.template({
        widgetVals: widgetVals,
        wtabs: mapp.metaDoc.wtabs,
        wtabNames: wtabNames
      }) );
      this.delegateEvents();
    },
    
    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    }
    
  });
  
})(jQuery);
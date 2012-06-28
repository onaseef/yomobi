(function ($) {

  var pluckName = function (w) { return w && w.get('name'); };

  var getSetting = function (name) {
    return g.settings[name] || util.defaultSettings[name];
  };
  var setTabBarColors = function () {
    var color = getSetting('tab_bar_color');
    $('#top-bar .tab-bar').css({ background:color});
    var color = getSetting('tab_bar_text_color');
    $('#top-bar .tab-bar td, #top-bar .tab-bar td a').css({ color:color });
util.log('SETTING TAB BAR COLORS', color, $('#top-bar .tab-bar td, #top-bar .tab-bar td a'))
    $('#top-bar .tab-bar').css({ borderColor:color });
  };


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
        , wid = ($elem.val() == '__none__') ? '' : $elem.val()
      ;
      if (!util.reserveUI()) {
        mapp.updateWtabs();
        setTabBarColors();
        return;
      }
      util.log('Updating wtabs',idx,wid);
      mapp.metaDoc.wtabs.splice(idx,1,wid);

      this.leftJustifyWtabs();

      bapp.syncMetaDoc(function () {
        mapp.updateWtabs();
        setTabBarColors();
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

    hasChanges: function () { return false; },
    discardChanges: function () {},

    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    }

  });

})(jQuery);
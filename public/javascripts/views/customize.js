(function ($) {

  var getSetting = function (name) {
    return g.settings[name] || util.defaultSettings[name];
  };

  var updateColor = {
    header_color: function (color) {
      color || (color = getSetting('header_color'));
      $('#top-bar .company-info').css({ background:color });
    },
    header_text_color: function (color) {
      color || (color = getSetting('header_text_color'));
      $('#top-bar .company-info').css({ color:color });
    },
    tab_bar_color: function (color) {
      color || (color = getSetting('tab_bar_color'));
      $('#top-bar .tab-bar').css({ background:color });
      $('#canvas .mobile-footer').css({ background:color });
    },
    tab_bar_text_color: function (color) {
      color || (color = getSetting('tab_bar_text_color'));
      $('#top-bar .tab-bar td, #top-bar .tab-bar td a').css({ color:color });
      $('#canvas .mobile-footer').css({ color:color });
    },
    icon_text_color: function (color) {
      color || (color = getSetting('icon_text_color'));
      $('#canvas .home-icon .title').css({ color:color });
    }
  };


  window.CustomizeView = Backbone.View.extend({

    el: $('#builder .widget-editor'),

    template: util.getTemplate('customize'),

    events: {
      'change [name=area_select]':        'viewArea',
      'change input[type=file]':          'enableUploadButton',
      'click input[type=file]':           'enableUploadButton',
      'change [name=icon_font_family]':   'updateIconFont',
      'click .accept-btn':                'saveChanges',
      'click .cancel-btn':                'discardChanges'
    },

    startEditing: function (targetArea) {
      util.log('Editing Settings');

      var extraData = {
        wnames: _.keys(mapp.metaDoc.worder)
      };
      _.extend(extraData, g.settings, util.defaultSetting);

      this.el.html( this.template(extraData) )
        .find('.help-bubble').simpletooltip(undefined,'help').end()
        .find('input:file').keypress(function () { return false; }).end()
        .find('[name=icon_font_family]').val(extraData.icon_font_family).end()
      ;
      this.delegateEvents();

      var self = this;
      util.spawnColorPicker(this.el.find('.color-picker'), {
        onChange: function (color,elem) {
          var targetName = $(elem).data('target');
          self.el.find('[name='+targetName+']').val(color);
          updateColor[targetName](color);
        }
      });

      targetArea || (targetArea = 'head');
      this.$('[name=area_select]').val(targetArea);
      this.$('.subpanels .' + targetArea).show();
    },

    viewArea: function (e) {
      var targetArea = $(e.target).val();
      this.$('.subpanels > *').hide();
      this.$('.subpanels .' + targetArea).show();
    },

    updateIconFont: function () {
      var font = this.$('[name=icon_font_family]').val();
      $('#canvas .home-icon .title').css({ fontFamily:font });
    },

    saveChanges: function () {
      var submitBtn = this.$('input[type=submit]').prop('disabled',true)
        , loader = this.$('.loader').show()
        , checkmark = this.$('.checkmark').hide()
      ;

      var payload = this.$('.subpanels').serialize();
      $.post('/builder/customize', payload, function (resp) {
        g.settings = resp;
        loader.hide();
        checkmark.show();
        submitBtn.prop('disabled',false);
      });
    },

    discardChanges: function () {
      for (var area in updateColor) updateColor[area]();
      this.$('[name=icon_font_family]')
        .val( getSetting('icon_font_family') );
      this.updateIconFont();
      this.startEditing( this.$('[name=area_select]').val() );
    },

    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    },

    enableUploadButton: util.enableFileUploadButton

  });

})(jQuery);

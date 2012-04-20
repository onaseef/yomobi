(function ($) {

  var hasChanges = false;

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
      $('#top-bar .tab-bar').css({ background:color});
      $('#canvas .mobile-footer').css({ background:color });
    },
    tab_bar_text_color: function (color) {
      color || (color = getSetting('tab_bar_text_color'));
      $('#top-bar .tab-bar td, #top-bar .tab-bar td a').css({ color:color });
      $('#canvas .mobile-footer').css({ color:color });
      $('#top-bar .tab-bar').css({ borderColor:color });
      $('#canvas .mobile-footer').css({ borderColor:color });
    },
    icon_text_color: function (color) {
      color || (color = getSetting('icon_text_color'));
      $('#canvas .home-icon .title').css({ color:color });
    },
    body_bg_color: function (color) {
      color || (color = getSetting('body_bg_color'));
      $('#canvas #home.page').css({ backgroundColor:color });
    }
  };

  var initDialogUploader = function (type, $el, onDone) {
    // configure uploader; callback will be configured later in makeSaveFunc()

    // This delay is needed because the flash object is present for a
    // split second, just enough time for a double click to catch it (bad)
    setTimeout(function () {
      util.initUploader( $el.find('.' +type+ '.wphoto-wrap'), {
        uploadPath: g.customizeUploadPath,
        instanceId: 'customize_' + type,
        auto: true,
        emptyQueue: true,
        onDone: onDone,
        extraParams: { targetType: type }
      });
    }, 300);
  };


  window.CustomizeView = Backbone.View.extend({

    el: $('#builder .widget-editor'),

    template: util.getTemplate('customize'),

    events: {
      'change [name=area_select]':        'viewArea',
      'change input[type=file]':          'enableUploadButton',
      'click input[type=file]':           'enableUploadButton',
      'change [name=icon_font_family]':   'updateIconFont',
      'change [name=body_bg_repeat]':     'updateRepeat',
      'click .accept-btn':                'saveChanges',
      'click .cancel-btn':                'discardChanges',
      'click .remove-banner-link':        'removeBanner',
      'click .remove-body_bg-link':       'removeBodyBg'
    },

    initialize: function () {
      _.bindAll(this, 'onUpload');
    },

    startEditing: function (targetArea) {
      hasChanges = false;

      var extraData = {
        wnames: _.keys(mapp.metaDoc.worder),
        banner_src: g.banner || g.blankImg,
        body_bg_src: g.body_bg || g.blankImg,
        isDefaultBanner: false,
        isPremium: g.isPremium
      };
      var settings = _.extend({}, g.settings);
      for (var p in settings) {
        if (!settings[p]) settings[p] = util.defaultSettings[p];
      }
      _.extend(extraData, settings);

      this.el.html( this.template(extraData) )
        .find('.help-bubble').simpletooltip(undefined,'help').end()
        .find('input:file').keypress(function () { return false; }).end()
        .find('[name=icon_font_family]').val(extraData.icon_font_family).end()
        .find('[name=body_bg_repeat]').val(extraData.body_bg_repeat).end()
      ;
      this.delegateEvents();

      var self = this;
      util.spawnColorPicker(this.el.find('.color-picker'), {
        onChange: function (color,elem) {
          var targetName = $(elem).data('target');
          self.el.find('[name='+targetName+']').val(color);
          updateColor[targetName](color);
          hasChanges || (hasChanges = true);
        }
      });

      targetArea || (targetArea = 'head');
      this.$('[name=area_select]').val(targetArea);
      this.$('.subpanels .' + targetArea).show();

      if (g.isPremium) {
        initDialogUploader('banner', this.el, this.onUpload);
        initDialogUploader('body_bg', this.el, this.onUpload);
      }
    },

    viewArea: function (e) {
      var targetArea = $(e.target).val();
      this.$('.subpanels > *').hide();
      this.$('.subpanels .' + targetArea).show();
    },

    onUpload: function (res) {
      if (res.banner) {
        g.banner = res.banner;
        mapp.render();
        $('img.banner').attr('src', g.banner);
        util._uploaders['customize_banner'].toggleBrowseButton(true);
      }
      else if (res.body_bg) {
        g.body_bg = res.body_bg;
        $('#canvas #home.page').css({
          backgroundImage: 'url('+ g.body_bg +')',
          backgroundRepeat: 'no-repeat'
        });
        $('img.body_bg').attr('src', g.banner);
        $('.bg_repeat').show();
        util._uploaders['customize_body_bg'].toggleBrowseButton(true);
      }
      util.releaseUI();
    },

    removeBanner: function (e) {
      e.preventDefault();
      g.banner = '';
      mapp.render();
      $('img.banner').attr('src', g.blankImg);
      $.post(g.customizeUploadPath, { destroy:1, targetType:'head' });
    },

    removeBodyBg: function (e) {
      e.preventDefault();
      g.body_bg = '';
      $('#canvas #home.page').css({
        backgroundImage: 'none',
        backgroundRepeat: 'none'
      });
      $('img.body_bg').attr('src', g.blankImg);
      $('.bg_repeat').hide();
      $.post(g.customizeUploadPath, { destroy:1, targetType:'body_bg' });
    },

    updateIconFont: function () {
      var font = this.$('[name=icon_font_family]').val();
      $('#canvas .home-icon .title').css({ fontFamily:font });
    },

    updateRepeat: function () {
      var repeat = this.$('[name=body_bg_repeat]').val();
      $('#canvas #home.page').css({ backgroundRepeat:repeat });
    },

    saveChanges: function () {
      if (!g.isPremium) return;

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
      this.$('[name=body_bg_repeat]')
        .val( getSetting('body_bg_repeat') );
      this.updateIconFont();
      this.updateRepeat();
      this.startEditing( this.$('[name=area_select]').val() );
    },

    hasChanges: function () { return hasChanges; },

    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
    },

    enableUploadButton: util.enableFileUploadButton

  });

})(jQuery);

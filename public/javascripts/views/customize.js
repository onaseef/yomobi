(function ($) {

  var hasChanges = false;

  var resizeEmulator = function () {
    g.topBarHeight = $('#top-bar').height();
    mapp.resize();
  };

  var getSetting = function (name) {
    if (!g.isPremium && name != 'header_color' && name != 'header_text_color') {
      return util.defaultSettings[name];
    }
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
      'change select':                    'updateFonts',
      'change [name=body_bg_repeat]':     'updateRepeat',
      'change [name=banner_size]':        'updateBannerSize',
      'click .accept-btn':                'saveChanges',
      'click .cancel-btn':                'discardChanges',
      'click .remove-banner-link':        'removeBanner',
      'click .remove-body_bg-link':       'removeBodyBg',
      'change [name=display_style]':      'updateDisplayStyle',
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
        isPremium: g.isPremium,
        testUser: g.testUser
      };
      var settings = _.extend({}, g.settings);
      for (var p in settings) {
        if (!settings[p] || !g.isPremium)
          settings[p] = util.defaultSettings[p];
      }
      _.extend(extraData, settings);

      this.el.html( this.template(extraData) )
        .find('.help-bubble').simpletooltip(undefined,'help').end()
        .find('input:file').keypress(function () { return false; }).end()
        .find('[name=icon_font_family]').val(extraData.icon_font_family).end()
        .find('[name=header_font_family]').val(extraData.header_font_family).end()
        .find('[name=tab_bar_font_family]').val(extraData.tab_bar_font_family).end()
        .find('[name=body_bg_repeat]').val(extraData.body_bg_repeat).end()
        .find('[name=banner_size]').val(extraData.banner_size).end()
        .find('[name=display_style][value='+extraData.display_style+']').attr('checked', true).end()
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

      targetArea || (targetArea = 'banner');
      this.$('[name=area_select]').val(targetArea);
      this.$('.subpanels .' + targetArea).show();

      if (g.isPremium) {
        initDialogUploader('banner', this.$('.banner'), this.onUpload);
        this.hasInitBodyBgUploader = false;
      }
    },

    viewArea: function (e) {
      var targetArea = $(e.target).val();
      this.$('.subpanels > *').hide();
      this.$('.subpanels .' + targetArea).show();

      if (targetArea === 'home_page' && this.hasInitBodyBgUploader === false
      && g.isPremium) {
        initDialogUploader('body_bg', this.$('.home_page'), this.onUpload);
        this.hasInitBodyBgUploader = true;
      }
    },

    onUpload: function (res) {
      if (res.banner) {
        g.banner = res.banner;
        mapp.render();
        g.settings.banner_size = 'auto';
        this.$('img.banner').attr('src', g.banner).css('width', 'auto');
        $('#emulator img.banner').css('width', 'auto');
        resizeEmulator();

        this.$('[name=banner_size]').val('auto');
        this.$('.banner_size, .remove-banner-link').show();
        util._uploaders['customize_banner'].toggleBrowseButton(true);
      }
      else if (res.body_bg) {
        g.body_bg = res.body_bg;
        $('#canvas #home.page').css({
          backgroundImage: 'url('+ g.body_bg +')',
          backgroundRepeat: 'repeat'
        });
        g.settings.body_bg_repeat = 'repeat';
        $('img.body_bg').attr('src', g.body_bg).css('background-repeat', 'repeat');
        this.$('[name=body_bg_repeat]').val('repeat');
        $('.bg_repeat, .remove-body_bg-link').show();
        util._uploaders['customize_body_bg'].toggleBrowseButton(true);
      }
      util.releaseUI();
    },

    removeBanner: function (e) {
      e.preventDefault();
      if (!confirm(g.i18n.category.delete_node)) return;
      g.banner = '';
      mapp.render();
      $('img.banner').attr('src', g.blankImg);
      $('.banner_size, .remove-banner-link').hide();
      resizeEmulator();
      $.post(g.customizeUploadPath, { destroy:1, targetType:'banner' });
    },

    removeBodyBg: function (e) {
      e.preventDefault();
      if (!confirm(g.i18n.category.delete_node)) return;
      g.body_bg = '';
      $('#canvas #home.page').css({
        backgroundImage: 'none',
        backgroundRepeat: 'none'
      });
      $('img.body_bg').attr('src', g.blankImg);
      $('.bg_repeat, .remove-body_bg-link').hide();
      $.post(g.customizeUploadPath, { destroy:1, targetType:'body_bg' });
    },

    updateFonts: function (useDefault) {
      hasChanges || (hasChanges = true);

      var font = this.$('[name=icon_font_family]').val();
      if (useDefault === true) font = util.defaultSettings.icon_font_family;
      $('#canvas .home-icon .title').css({ fontFamily:font });

      var font = this.$('[name=header_font_family]').val();
      if (useDefault === true) font = util.defaultSettings.header_font_family;
      $('#top-bar .company-info').css({ fontFamily:font });

      var font = this.$('[name=tab_bar_font_family]').val();
      if (useDefault === true) font = util.defaultSettings.tab_bar_font_family;
      $('#top-bar .tab-bar').css({ fontFamily:font });
    },

    updateRepeat: function () {
      hasChanges || (hasChanges = true);
      var repeat = this.$('[name=body_bg_repeat]').val();
      $('#canvas #home.page').css({ backgroundRepeat:repeat });
    },

    updateBannerSize: function () {
      hasChanges || (hasChanges = true);
      var size = this.$('[name=banner_size]').val() || 'auto';
      $('#top-bar .company-info .banner-wrap img').width(size);
      resizeEmulator();
    },

    updateDisplayStyle: function () {
      hasChanges = true;
      
      var $homePage       = $('#canvas #home.page');
      var newDisplayClass = $('#display_style_icon').is(':checked') ? 'display_style_icon' : 'display_style_line';
      
      $homePage.removeClass('display_style_icon display_style_line').addClass(newDisplayClass);
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
        hasChanges = false;
      });
    },

    discardChanges: function (opts) {
      for (var area in updateColor) updateColor[area]();
      this.$('[name=icon_font_family]')
        .val( getSetting('icon_font_family') );
      this.$('[name=body_bg_repeat]')
        .val( getSetting('body_bg_repeat') );
      this.$('[name=banner_size]')
        .val( getSetting('banner_size') );
      this.$('[name=display_style]')
        .attr('checked', false)
        .end()
        .find('[value=' + getSetting('display_style') + ']')
        .attr('checked', true);
      this.updateDisplayStyle();
      this.updateFonts(!g.isPremium);
      this.updateRepeat();
      this.updateBannerSize();
      if (opts.byNavigation === true) {
        hasChanges = false;
      }
      else {
        this.startEditing( this.$('[name=area_select]').val() );
      }
    },

    hasChanges: function () { return hasChanges; },

    stopEditing: function () {
      this.el.html(bapp.idleTemplate());
      destroyUploader('customize_banner');
      destroyUploader('customize_body_bg');
    },

    enableUploadButton: util.enableFileUploadButton

  });

})(jQuery);

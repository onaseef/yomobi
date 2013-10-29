(function ($) {

  var i18n = g.i18n.site_manager;

  window.Site = Backbone.Model.extend({

    initialize: function () {
      this.updateDependentAttrs();
    },

    updateDependentAttrs: function () {
      this.set({
        isOwnedByUser: (this.get('owner') || {}).id === g.user_id,
        isDefault: this.get('id') === g.defaultSite_id
      });
    },

    edit: function () {
      var url = g.activateSitePath(this.toJSON());
      document.location.href = url;
    }
  });
  window.Sites = Backbone.Collection.extend({
    model: Site
  });

  SiteView = Backbone.View.extend({
    tagName: 'li',
    template: util.getTemplate('site-li'),
    initialize: function () {
      this.model.view = this;
    },
    render: function () {
      $(this.el)
        .html( this.template(this.model.toJSON()) )
        .data('site-id', this.model.get('id'))
      ;
      return this;
    }
  });


  ManageSiteView = Backbone.View.extend({
    el: $('#manager-container .accordian'),

    events: {
      'click .content-header':  'viewAccordianSection',
      'click .close-btn':       'closeAccordian'
    },

    initialize: function () {
      this.siteDetailsView = new SiteDetailsView();
      this.signupKeys = new SignupKeyView();
      this.siteGrade = new SiteGradeView();
      this.domains = new SiteDomainsView();
      this.merchant = new MerchantAccountView();
      this.siteAdmins = new SiteAdminsView();

      // The order of sections here MUST match the order of sections in
      // site_manager/index.html.slim .accordian section
      this.sections = [
        this.siteDetailsView,
        this.siteGrade,
        this.domains,
        this.siteAdmins,
        this.signupKeys
//        this.merchant,
      ];
      this.selectedIdx = g.selectedIdx;
    },

    render: function (site) {
      _.each(this.sections, function (v) { v.render(site); });
      if (this.selectedIdx) {
        this.sections[this.selectedIdx].showContent();
      }
      else {
        // Show the siteGrade view by default
        this.siteGrade.showContent();
      }
      return this;
    },

    viewAccordianSection: function (e) {
      _.each(this.sections, function (view) {
        view.el
          .find('.content-header').removeClass('active').end()
          .find('.content-body').hide().end();
      });
      var $header = util.ensureClassAncestor(e.target, 'content-header');
      $header.addClass('active').siblings('.content-body').show();
      this.selectedIdx = $header.parent().index();
      util.saveState(g.siteMgrPath({ idx:this.selectedIdx }), true);
    },

    closeAccordian: function () {
      _.each(this.sections, function (view) {
        var body = view.$('.content-body');
        if ( body.is(':visible') ) {
          body.hide().removeClass('active');
          view.render(sman.getSelectedSite());
        }
      });
      delete this.selectedIdx;
    },

    getActiveSection: function () {
      var section = _.find(this.sections, function (view) {
        return view.$('.content-body').is(':visible');
      });
      return section;
    }
  });

  // shared function
  var showContent = function () {
    this.$('.content-body').show();
    this.$('.content-header').addClass('active');
    return this;
  };


  SiteDetailsView = Backbone.View.extend({
    el: $('#manager-container .accordian > .site-details'),
    template: util.getTemplate('site-details'),
    render: function (site) {
      $(this.el).html( this.template(site.toJSON()) );
      return this;
    }
  });


  SignupKeyView = Backbone.View.extend({
    el: $('#manager-container .accordian > .signup-keys'),
    template: util.getTemplate('signup-keys'),
    events: {
      'click .signup-key-input':     'selectKey',
      'click button.gen-signup-key': 'genSignupKey'
    },
    showContent: showContent,
    render: function (site) {
      $(this.el).html( this.template() );
      this.$('.gen-signup-key').prop('disabled', !site.get('isOwnedByUser'));
      return this;
    },
    // Generate signup key
    genSignupKey: function () {
      var self = this
        , site = sman.getSelectedSite()
        , button = this.$('.gen-signup-key').prop('disabled',true)
      ;
      this.$('.signup-key-input').hide();

      submitForm(site, g.genSignupKey, {
        params: {},
        success: function (resp) {
          self.setSignupKey( resp.key );
          button.prop('disabled',false);
        }
      });
    },
    setSignupKey: function (key) {
      this.$('.signup-key-input').val(key).show();
    },
    selectKey: function () {
      this.$('.signup-key-input').select();
    }
  });


  SiteDomainsView = Backbone.View.extend({
    el: $('#manager-container .accordian > .custom-domains'),
    template: util.getTemplate('custom-domains'),
    domainsTemplate: util.getTemplate('domain-list'),
    events: {
      'click .domains li':            'selectDomain',
      'click .add-domain':            'openDomainDialog',
      'click button.remove-domain':   'removeDomain'
    },
    showContent: showContent,

    selectDomain: function (e) {
      this.$('.domains li').removeClass('ui-selected');
      $(e.currentTarget).addClass('ui-selected');
    },

    openDomainDialog: function (e) {
      this.dialog || (this.dialog = new AdminDialog);
      this.dialog.model = sman.getSelectedSite();
      this.dialog.options = { mode:'addDomain' };
      this.dialog.prompt();
    },

    removeDomain: function () {
      var self = this
        , site = sman.getSelectedSite()
        , domain_id = this.getSelectedDomainId()
      ;
      if (!domain_id) {
        return alert(i18n.select_domain);
      }
      this.$('button').prop('disabled',true);

      submitForm(site, g.removeDomainPath, {
        params: { domain_id:domain_id },
        success: function (resp) {
          site.set(resp.site);
          self.render( site ).showContent();
        }
      });
    },

    getSelectedDomainId: function () {
      return this.$('.domains li.ui-selected').data('id');
    },

    render: function (site) {
      $(this.el).html( this.template(site.toJSON()) );
      this.$('ul.domains').html( this.domainsTemplate(site.toJSON()) );
      return this;
    }
  });


  MerchantAccountView = Backbone.View.extend({
    el: $('#manager-container .accordian > .merchant-account'),
    template: util.getTemplate('merchant-account'),
    showContent: showContent,
    render: function (site) {
      $(this.el).html( this.template() );
      return this;
    }
  });


  SiteGradeView = Backbone.View.extend({
    el: $('#manager-container .accordian > .site-grade'),
    template: util.getTemplate('site-grade'),
    events: {
      'click .back-btn':        'goBack',
      'submit form.pay':        'onPaySubmit',
      'submit form.cancel, click form.cancel [type=submit]':     'confirmCancelSub',
      'click button.renew':     'showPayOptions',
      'click button.ok':   'onOkButton'
    },
    showContent: showContent,
    render: function (site) {
      var subEndDate = site.get('subscriptionEndDate');

      var extraData = {
        actionLabel: site.get('isPremium') ? i18n.manage : i18n.upgrade,
        grade: site.get('isPremium') ? i18n.professional : i18n.standard,
        actionPath: g.upgradeSitePath(site.toJSON()),
        cancelPath: g.cancelSubPath(site.toJSON()),
        expireDate: site.get('expireDate'),
        subscriptionType: i18n[ site.get('subscriptionType') ],
        isSubscribed: subEndDate && subEndDate !== 'cancelled'
      };
      var templateData = _.extend(site.toJSON(), extraData);
      $(this.el).html( this.template(templateData) );

      if (site.get('justCancelled')) {
        this.el.find('.just-cancelled').show();
        this.el.find('.subscribe-options').hide();
        this.el.find('.pay-options').hide();
        site.set({ justCancelled:false });
      }

      // bind button forms' ajax callbacks
      var self = this;
      this.$('form').bind('ajax:error', function (e, xhr, status, error) {
        if (xhr.status === 500) {
          util.log('Unknown Error', xhr, status, error);
          xhr.responseText = '"unknown_error"';
        }
        var msgCode = $.parseJSON(xhr.responseText);
        var msg = g.i18n.error + ': ' + (i18n[msgCode] || msgCode);
        self.$('.error').text( msg ).show('pulsate', { times:3 });
        self.$('[type=submit]').prop('disabled', false);
      });
      this.$('form.pay').bind('ajax:success', function (e, data, status, xhr) {
        self.renderBody(data);
      });
      this.$('form.cancel').bind('ajax:success', function (e, data, status, xhr) {
        var site = sman.getSelectedSite();
        site.set(data.site);
        site.set({ justCancelled:true });
        self.render(site);
        self.$('.content-header').click();
      });
      return this;
    },

    renderBody: function (content) {
      this.el.find('.content-body').html(content);
    },

    goBack: function () {
      this.render( sman.getSelectedSite() );
      this.showContent();
    },

    showPayOptions: function () {
      this.$('button.renew').hide();
      this.$('.pay-options').show();
    },

    onPaySubmit: function (e) {
      if ( this.$('[name=terms]').prop('checked') !== true ) {
        e.preventDefault();
        e.stopPropagation();
        alert(i18n.agree_to_terms);
        return false;
      }
      var self = this;
      _.delay(function () {
        self.$('[type=submit]').prop('disabled', true);
      }, 10);
      return true;
    },

    onPayComplete: function (e) {
      this.el.find('.payment-complete').show();
      this.el.find('.subscribe-options').hide();
      this.el.find('.pay-options').hide();
    },

    onOkButton: function (e) {
      this.render( sman.getSelectedSite() );
      this.showContent();
    },

    confirmCancelSub: function (e) {
      if (!confirm(i18n.cancel_sub_confirm)) {
        e.preventDefault();
        return false;
      }
      var self = this;
      _.delay(function () {
        self.$('[type=submit]').prop('disabled', true);
      }, 10)
      return true;
    }
  });


  SiteAdminsView = Backbone.View.extend({
    el: $('#manager-container .site-admins'),
    template: util.getTemplate('site-admins'),
    adminsTemplate: util.getTemplate('admin-list'),
    showContent: showContent,

    render: function (site) {
      var isSelected = this.$('.content-header').hasClass('active');

      this.el.html( this.template(site.toJSON()) );
      this.$('.help-bubble').simpletooltip(undefined,'help');

      this.$('.add-admin').prop('disabled', !site.get('isOwnedByUser'));
      this.$('.remove-admin, .concede').prop('disabled', true);
      this.$('ul.admins').html( this.adminsTemplate(site.toJSON()) );

      this.$('.content-body').toggle(isSelected);
      this.$('.content-header').toggleClass('active',isSelected);
      return this;
    }
  });


  SiteManagerView = Backbone.View.extend({
    el: $('#manager-container'),
    events: {
      'click .sites li':             'selectSite',
      'click button.edit':           'editSite',
      'click button.create':         'createSite',
      'click button.make-default':   'makeDefaultSite',

      'click .admins li':            'selectAdmin',
      'click button.add-admin':      'addAdmin',
      'click button.remove-admin':   'removeAdmin',
      'click button.concede':        'concedeSite'
    },

    initialize: function () {
      _.bindAll(this, 'getSelectedSite');

      this.sites = new Sites(window._sitesData);
      this.accordian = new ManageSiteView();
      this.renderInit();
    },

    editSite: function () {
      this.getSelectedSite().edit();
    },

    createSite: function () {
      var dialog = new NewSiteDialog({ model:newBlankSite() });
      dialog.prompt();
    },

    makeDefaultSite: function () {
      var site = this.getSelectedSite();

      submitForm(site, g.makeDefaultSitePath, {
        params: {},
        success: function (resp) {
          window.location.reload(true);
        }
      });
    },

    selectSite: function (e) {
      this.el.find('.sites li').removeClass('ui-selected');
      $(e.currentTarget).addClass('ui-selected');

      var site = this.getSelectedSite();
      this.accordian.render(site);
    },

    getSelectedSite: function () {
      var site_id = this.$('.sites li.ui-selected').data('site-id');
      return this.sites.get(site_id);
    },

    selectAdmin: function (e) {
      this.$('.admins li').removeClass('ui-selected');
      $(e.currentTarget).addClass('ui-selected');
      var isSelf = this.getSelectedAdminId() === g.user_id
        , userIsOwner = this.getSelectedSite().get('owner').id === g.user_id
      ;
      this.$('.remove-admin, .concede')
        .prop('disabled',isSelf || !userIsOwner);
    },

    getSelectedAdminId: function () {
      return this.$('.admins li.ui-selected').data('id');
    },

    openAdminDialog: function (mode,admin_id) {
      this.adminDialog || (this.adminDialog = new AdminDialog());

      this.adminDialog.model = this.getSelectedSite();
      this.adminDialog.options = { mode:mode, admin_id:admin_id };
      this.adminDialog.prompt();
    },

    addAdmin: function () {
      this.openAdminDialog('add');
    },

    removeAdmin: function () {
      var site = this.getSelectedSite()
        , admin_id = this.getSelectedAdminId()
      ;
      submitForm(site, g.removeAdminPath, {
        params: { admin_id:admin_id },
        success: function (resp) {
          site.set(resp.site);
          sman.accordian.siteAdmins.render( site );
        }
      });
    },

    concedeSite: function () {
      if (!confirm(g.concedeSiteConfirmation)) return;

      var admin_id = this.getSelectedAdminId()
      this.openAdminDialog('concede', admin_id);
    },

    renderInit: function () {
      var list = this.el.find('.sites').empty();
      this.sites.each(function (site) {
        var view = new SiteView({ model:site });
        list.append(view.render().el);
      });

      var activeSite = this.sites.get(g.activeSite_id);
      $(activeSite.view.el).addClass('ui-selected');
      this.accordian.render(activeSite);
      if (g.payment) {
        this.accordian.siteGrade.showContent().onPayComplete();
      }

      return this;
    },

    render: function () {
      this.sites.each(function (site) {
        site.view.render();
      });
      return this;
    }
  });

  window.sman = new SiteManagerView();



  // // // // //
  // Helpers! //
  // // // // //

  function newBlankSite () {
    return new Site({ title:'', url:'my-site-url', type:57, source_db_name:null });
  }

  function submitForm (model, pathTemplate, options) {
    if (!util.reserve('form-submit')) return;

    var self = this
      , formSelector = options.formSelector || 'form'
      , paramHash = options.params ||
                    util.serializedArrayToHash( this.$(formSelector).serializeArray() )
      , path = pathTemplate( _.extend(model.toJSON(),paramHash) )
      , payload = $.param( paramHash )
    ;
    this.$(formSelector).addClass('submitting');

    $.post(path, payload, function (resp) {
      util.release('form-submit');

      if (resp.status == 'ok') {
        options.success(resp);
      }
      else {
        (options.error || defaultErrorFunc)(resp);
      }
    });
  }

  function defaultErrorFunc (resp) {
    alert(i18n.default_error);
    util.log('removeAdmin error response:', resp);
  }

  var NewSiteDialog = Backbone.View.extend({
    template: util.getTemplate('new-site-dialog'),
    events: {
      'change [name=create_type]':   'changeSiteCreateType',
      'change select.source':        'onSourceSelect',
      'submit':                 'submit'
    },
    initialize: function () {
      _.bindAll(this, 'submit', 'render');
    },

    changeSiteCreateType: function (e) {
      var showType = $(e.target).val() == 'type';
      this.$('.site-type').toggle( showType );
      this.$('.site-source').toggle( !showType );
      this.$('[name="site[source_db_name]"]').val('');
      this.toggleCreateButton(showType);
    },

    onSourceSelect: function (e) {
      var selected = $(e.target).find('option:selected')[0]
        , noop = $(e.target).find('option:first')[0]
        , isBlank = (selected == noop)
      ;
      this.toggleCreateButton( !isBlank );
    },

    toggleCreateButton: function (enabled) {
      $(this.el).parent()
        .find('.ui-dialog-buttonset button:first')
        .prop('disabled', !enabled)
      ;
    },

    render: function (errors) {
      var templateData = {
        errors: errors || {},
        sites: _.map(sman.sites.models, function (m) { return m.attributes; })
      };
      _.extend(templateData, this.model.toJSON());

      var isSourceSpecified = !!this.model.get('source_db_name')
        , radioVal = isSourceSpecified ? 'source' : 'type'
        , sourceVal = this.model.get('source_db_name') || 'www'
      ;
      $(this.el)
        .html( this.template(templateData) )
        .find('select').val(this.model.get('type')).end()
        .find('[name=create_type][value='+radioVal+']').prop('checked',true).end()
        .find('[name="site[source_db_name]"]').val(sourceVal).end()
        .find('.site-type').toggle( !isSourceSpecified ).end()
        .find('.site-source').toggle( isSourceSpecified ).end()
      ;
      return this;
    },

    prompt: function () {
      var dialogContent = this.render().el
        , buttons = {}
      ;
      buttons[g.i18n.create] = this.submit;
      buttons[g.i18n.cancel] = function () { $(this).dialog('close'); };

      this.dialog = util.dialog(dialogContent, buttons, i18n.new_site_dialog_title, {
        width: 484
      });
    },

    submit: function () {
      var self = this;
      submitForm(this.model, g.createSitePath, {
        success: function (resp) {
          self.model.set(resp.site);
          self.model.edit();
        },
        error: function (resp) {
          self.model.set(resp.site);
          self.render(resp.reasons);
        }
      });
      return false;
    }
  });


  var AdminDialog = Backbone.View.extend({
    addTemplate: util.getTemplate('add-admin-dialog'),
    concedeTemplate: util.getTemplate('concede-dialog'),
    addDomainTemplate: util.getTemplate('add-domain-dialog'),
    events: {
      'submit': 'submit'
    },
    paths: {
      'add': g.addAdminPath,
      'concede': g.concedeSitePath,
      'addDomain': g.addDomainPath
    },
    titles: {
      'add': function () {
        return i18n.add_admin_dialog_title + this.model.get('url') + '.yomobi.com';
      },
      'concede': function () {
        return i18n.concede_ownership_dialog_title;
      },
      'addDomain': function () {
        return i18n.add_domain_dialog_title + this.model.get('url') + '.yomobi.com';
      }
    },
    initialize: function () {
      _.bindAll(this, 'submit', 'render');
    },

    render: function (errors,data) {
      var extraData = {
          errors: errors || {},
          admin_id: this.options.admin_id,
          email: ''
        }
        , templateData = this.model.toJSON()
        , template = this[this.options.mode + 'Template']
      ;
      _.extend(templateData, extraData, data);

      $(this.el).html( template(templateData) );

      return this;
    },

    prompt: function () {
      var dialogContent = this.render().el
        , title = this.titles[this.options.mode].call(this)
        , buttons = {}
        , saveLabel = this.options.mode == 'concede' ? i18n['continue'] : i18n.add
      ;
      buttons[g.i18n.save] = this.submit;
      buttons[g.i18n.cancel] = function () { $(this).dialog('close'); };

      this.dialog = util.dialog(dialogContent, buttons, title, {
        width: 484
      });
    },

    submit: function () {
      var self = this;
      var path = this.paths[this.options.mode];
      submitForm(this.model, path, {
        success: function (resp) {
          self.model.set(resp.site);
          self.model.updateDependentAttrs();

          sman.accordian.getActiveSection()
            .render( self.model )
            .showContent()
          ;
          sman.render();
          $(self.el).dialog('close');
        },
        error: function (resp) {
util.log('FAIL', resp);
          self.render(resp.reasons, resp);
        }
      });
      return false;
    }
  });

})(jQuery);
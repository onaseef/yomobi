(function ($) {

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


  SiteDetailsView = Backbone.View.extend({
    el: $('#manager-container .site-details-wrap'),
    template: util.getTemplate('site-details'),
    events: {
      'click .signup-key':            'selectKey'
    },

    render: function (site) {
      this.$('.details').html( this.template(site.toJSON()) );
      this.$('.help-bubble').simpletooltip(undefined,'help');
      this.$('.gen-signup-key, .add-admin')
        .prop('disabled', !site.get('isOwnedByUser'));
      this.$('.remove-admin, .concede').prop('disabled', true);
    },

    setSignupKey: function (key) {
      this.$('.signup-key').val(key).show();
    },

    selectKey: function () {
      this.$('.signup-key').select();
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
      'click button.concede':        'concedeSite',

      'click button.gen-signup-key': 'genSignupKey'
    },

    initialize: function () {
      _.bindAll(this, 'getSelectedSite');

      this.sites = new Sites(window._sitesData);
      this.siteDetailsView = new SiteDetailsView();
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
      this.siteDetailsView.render(site);
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
      var dialog = this.adminDialog || new AdminDialog();
      dialog.model = this.getSelectedSite();
      dialog.options = { mode:mode, admin_id:admin_id };
      dialog.prompt();
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
          sman.siteDetailsView.render( site );
        }
      });
    },

    concedeSite: function () {
      if (!confirm(g.concedeSiteConfirmation)) return;

      var admin_id = this.getSelectedAdminId()
      this.openAdminDialog('concede', admin_id);
    },

    // Generate signup key
    genSignupKey: function () {
      var site = this.getSelectedSite();
      var button = this.$('.gen-signup-key').prop('disabled',true);
      sman.siteDetailsView.$('.signup-key').hide();

      submitForm(site, g.genSignupKey, {
        params: {},
        success: function (resp) {
          sman.siteDetailsView.render( site );
          sman.siteDetailsView.setSignupKey( resp.key );
          button.prop('disabled',false);
        }
      });
    },

    renderInit: function () {
      var list = this.el.find('.sites').empty();
      this.sites.each(function (site) {
        var view = new SiteView({ model:site });
        list.append(view.render().el);
      });

      var activeSite = this.sites.get(g.activeSite_id);
      $(activeSite.view.el).addClass('ui-selected');
      this.siteDetailsView.render(activeSite);

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
    return new Site({ title:'', url:'my-site-url', type:57 });
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
    alert('Something went wrong.');
    util.log('removeAdmin error response:', resp);
  }

  var NewSiteDialog = Backbone.View.extend({
    template: util.getTemplate('new-site-dialog'),
    events: {
      'change [name=create_type]':   'changeSiteCreateType',
      'submit':                 'submit'
    },
    initialize: function () {
      _.bindAll(this, 'submit', 'render');
    },

    changeSiteCreateType: function (e) {
      var showType = $(e.target).val() == 'type';
      e.preventDefault();
      this.$('.site-type').toggle( showType );
      this.$('.site-source').toggle( !showType );
      this.$('[name="site[source_db_name]"]').val('');
    },

    render: function (errors) {
      var templateData = {
        errors: errors || {},
        sites: _.map(sman.sites.models, function (m) { return m.attributes; })
      };
      _.extend(templateData, this.model.toJSON());

      $(this.el)
        .html( this.template(templateData) )
        .find('select').val(this.model.get('type'))
      ;
      return this;
    },

    prompt: function () {
      var dialogContent = this.render().el
        , buttons = {
            "Create": this.submit,
            "Cancel": function () { $(this).dialog('close'); }
          }
      ;
      this.dialog = util.dialog(dialogContent, buttons, 'Create New Site', {
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
          self.render(resp.reasons);
        }
      });
      return false;
    }
  });


  var AdminDialog = Backbone.View.extend({
    addTemplate: util.getTemplate('add-admin-dialog'),
    concedeTemplate: util.getTemplate('concede-dialog'),
    events: {
      'submit': 'submit'
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
        , title = 'Add Admin for YoMobi.com/' + this.model.get('url')
        , title = this.options.mode == 'concede' ? 'Concede Site Ownership' : title

        , buttons = {}
        , saveLabel = this.options.mode == 'concede' ? 'Continue' : 'Add'
      ;
      buttons["Save"] = this.submit;
      buttons["Cancel"] = function () { $(this).dialog('close'); };

      this.dialog = util.dialog(dialogContent, buttons, title, {
        width: 484
      });
    },

    submit: function () {
      var self = this;
      var path = this.options.mode == 'add' ? g.addAdminPath : g.concedeSitePath;
      submitForm(this.model, path, {
        success: function (resp) {
          self.model.set(resp.site);
          self.model.updateDependentAttrs();

          sman.siteDetailsView.render( self.model );
          sman.render();
          $(self.el).dialog('close');
        },
        error: function (resp) {
          self.render(resp.reasons, resp);
        }
      });
      return false;
    }
  });

})(jQuery);
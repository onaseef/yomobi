(function ($) {

  window.Site = Backbone.Model.extend({

    initialize: function () {
      this.set({ owned:(this.get('owner').id === g.user_id) });
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
    el: $('#manager-container .details'),
    template: util.getTemplate('site-details'),

    render: function (site) {
      $(this.el).html( this.template(site.toJSON()) );
    }
  });


  SiteManagerView = Backbone.View.extend({
    el: $('#manager-container'),
    events: {
      'click .sites li':            'selectSite',
      'click button.edit':          'edit',
      'click button.create':        'create',

      'click .admins li':           'selectAdmin',
      'click button.add-admin':     'addAdmin',
      'click button.remove-admin':  'removeAdmin'
    },

    initialize: function () {
      _.bindAll(this, 'getSelectedSite');

      this.sites = new Sites(window._sitesData);
      this.siteDetailsView = new SiteDetailsView();
      this.render();
    },

    edit: function () {
      this.getSelectedSite().edit();
    },

    create: function () {
      var dialog = new NewSiteDialog({ model:newBlankSite() });
      dialog.prompt();
    },

    selectSite: function (e) {
      this.el.find('.sites li').removeClass('ui-selected');
      $(e.currentTarget).addClass('ui-selected');
      this.siteDetailsView.render( this.getSelectedSite() );
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
      this.$('.remove-admin').prop('disabled',isSelf || !userIsOwner);
    },

    getSelectedAdminId: function () {
      return this.$('.admins li.ui-selected').data('id');
    },

    addAdmin: function () {
      var dialog = this.adminDialog || new AdminDialog();
      dialog.model = this.getSelectedSite();
      dialog.prompt();
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
        },
        error: function (resp) {
          alert('Something went wrong.');
          util.log('removeAdmin error response:',resp);
        }
      });
    },

    render: function () {
      var list = this.el.find('ul.sites');
      this.sites.each(function (site) {
        var view = new SiteView({ model:site });
        list.append(view.render().el);
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
        options.error(resp);
      }
    });
  }

  var NewSiteDialog = Backbone.View.extend({
    template: util.getTemplate('new-site-dialog'),
    events: {
      'submit': 'submit'
    },
    initialize: function () {
      _.bindAll(this, 'submit', 'render');
    },

    render: function (errors) {
      var templateData = this.model.toJSON();
      _.extend(templateData, { errors:errors || {} });

      $(this.el)
        .html( this.template(templateData) )
        .find('select').val(this.model.get('type'))
      ;
      return this;
    },

    prompt: function () {
      var dialogContent = this.render().el
        , buttons = {
            "Save": this.submit,
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
          this.render(resp.reasons);
        }
      });
      return false;
    }
  });


  var AdminDialog = Backbone.View.extend({
    template: util.getTemplate('add-admin-dialog'),
    events: {
      'submit': 'submit'
    },
    initialize: function () {
      _.bindAll(this, 'submit', 'render');
    },

    render: function (errors,email) {
      var templateData = this.model.toJSON();
      var extraData = {
        errors: errors || {},
        email: email
      }
      _.extend(templateData, extraData);

      $(this.el).html( this.template(templateData) );
      return this;
    },

    prompt: function () {
      var dialogContent = this.render().el
        , buttons = {
            "Save": this.submit,
            "Cancel": function () { $(this).dialog('close'); }
          }
        , title = 'Add Collaborator for YoMobi.com/' + this.model.get('url')
      ;
      this.dialog = util.dialog(dialogContent, buttons, title, {
        width: 484
      });
    },

    submit: function () {
      var self = this;
      submitForm(this.model, g.addAdminPath, {
        success: function (resp) {
          self.model.set(resp.site);
          window.sman.siteDetailsView.render( self.model );
          $(self.el).dialog('close');
        },
        error: function (resp) {
          self.render(resp.reasons, resp.email);
        }
      });
      return false;
    }
  });

})(jQuery);
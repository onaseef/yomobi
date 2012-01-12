(function ($) {

  window.Site = Backbone.Model.extend({
    edit: function () {
      document.location.href = g.activateSitePath + this.get('id');
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


  SitesView = Backbone.View.extend({
    el: $('#sites-container'),
    events: {
      'click button.edit':          'edit',
      'click button.create':        'create',
      'click .sites li':            'selectSite',
    },

    initialize: function () {
      util.log('Init sites view');
      this.sites = this.options.models;
      this.render();
    },

    edit: function () {
      this.selectedSite().edit();
    },

    create: function () {
      util.log('create');
      var dialog = new NewSiteDialog({ model:newBlankSite() });
      dialog.prompt();
    },

    selectSite: function (e) {
      this.el.find('.sites li').removeClass('ui-selected');
      $(e.currentTarget).addClass('ui-selected');
    },

    render: function () {
      var list = this.el.find('ul.sites');
      this.sites.each(function (site) {
        var view = new SiteView({ model:site });
        list.append(view.render().el);
      });
      return this;
    },

    selectedSite: function () {
      var site_id = this.$('.sites li.ui-selected').data('site-id');
      return this.sites.get(site_id);
    }
  });

  SiteManagerView = Backbone.View.extend({
    events: {
      
    },

    initialize: function () {
      util.log('Init site manager');
      this.sites = new Sites(window._sitesData);
      this.sitesView = new SitesView({ models:this.sites });
    }
  });

  window.sman = new SiteManagerView();



  // // // // //
  // Helpers! //
  // // // // //

  function newBlankSite () {
    return new Site({ title:'', url:'my-site-url', type:57 });
  }

  var NewSiteDialog = Backbone.View.extend({
    template: util.getTemplate('new-site-dialog'),

    initialize: function () {
      _.bindAll(this, 'submit');
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
      var dialog = util.dialog(dialogContent, buttons, 'Create New Site', {
        width: 484
      });
    },

    submit: function () {
      if (!util.reserve('create-site')) return;

      this.$('form').addClass('submitting');
      var payload = this.$('form').serialize();

      var self = this;
      $.post(g.createSitePath, payload, function (resp) {
        self.model.set(resp.site);

        if (resp.status == 'ok') {
          self.model.edit();
        }
        else {
          self.render(resp.reasons);
        }
        util.release('create-site')
      });
    }
  });

})(jQuery);
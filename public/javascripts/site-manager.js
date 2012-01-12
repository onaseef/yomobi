(function ($) {

  window.Site = Backbone.Model.extend({

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
      'click .sites li': 'selectSite',
      'click button.edit': 'edit'
    },

    initialize: function () {
      util.log('Init sites view');
      this.sites = this.options.models;
      this.render();
    },

    edit: function () {
      document.location.href = g.active_site_path + this.selectedSite().get('path');
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

})(jQuery);
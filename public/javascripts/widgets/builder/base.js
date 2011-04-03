// 
// BUILDER
// 
(function ($) {
  
  window.Widget = Backbone.Model.extend({
    
    url: function () {
      var base = '/widgets';
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    },
    sync: util.deleteSync,
    
    pageContent: function () {
      this._template = this._template ||
                       util.getTemplate(this.get('wtype') + '-page');
      return this._template(this.toJSON());
    },
    
    initialize: function () {
      _.bindAll(this,'updateOrder');
      this.bind('change:order',this.updateOrder);
      
      var prettyName = _(this.get('name').split('-')).chain()
          .map(function (word) { return util.prettify(word); })
          .value()
          .join(' ')
      ;
      this.set({ prettyName:prettyName });
      
      this.init && this.init();
    },

    isAvailable: function () {
      return this.get('available_') === true;
    },
    
    onHomeViewClick: function () {
      return !!bapp.homeViewWidgetClick(this);
    },
    
    updateOrder: function () {
      // if available in sidebar, order doesn't matter
      if (this.isAvailable()) {
        util.clearUIBlock(widgetName);
        return;
      }
      
      var widgetName = this.get('name');
      this.save(null, {
        success: function () {
          util.clearUIBlock(widgetName);
        }
      });
    },
    
    getEditor: function () {
      this.editor = this.editor || util.newEditor(this);
      return this.editor;
    },
    
    getEditData: function () {
      return this.toJSON();
    },
    
    set: function(attributes, options) {
      if(attributes._id) {
        attributes.id = attributes._id;
        delete attributes._id;
      }
      return Backbone.Model.prototype.set.call(this, attributes, options);
    }
  });
  
})(jQuery);

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
      this.bind('change:name',this.updatePrettyName);
      
      this.updatePrettyName(this,this.get('name'));
      
      this.init && this.init();
    },
    
    updatePrettyName: function (model,newName) {
      model.set({ prettyName:util.prettifyName(newName) });
      if (this.homeView) this.homeView.render();
    },

    isAvailable: function () {
      return this.get('available_') === true;
    },
    
    onHomeViewClick: function () {
      return !!bapp.homeViewWidgetClick(this);
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

// 
// BUILDER
// 
(function ($) {
  
  var Backbone_set = Backbone.Model.prototype.set;

  window.Widget = window.Widget.extend({
    
    url: function () {
      var base = '/widgets';
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    },
    sync: util.deleteSync,
    
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
    
    getEditAreaData: function () {
      var data = {}
        , wdata = util.getWidgetBData(this)
        , templateId = wdata.wsubtype
        , editAreaTemplate = util.getTemplate(templateId + '-edit-area')
        , editData = _.extend({
            subHelpText: wdata.subHelp
          }, this.getEditData())
      ;
      data.editAreaContent = editAreaTemplate(editData);
      data.iconName = templateId;
      data.helpUrl = 'http://help.yomobi.com/Widgets/' + util.helpifyName(wdata.wsubtype);
      
      return _.extend(data, this.toJSON());
    },
    
    set: function(attributes, options) {
      if (attributes._id) {
        attributes.id = attributes._id;
        delete attributes._id;
      }
      if (attributes.email === null || attributes.email === '') {
        attributes.email = g.userEmails[attributes.wtype] || g.userEmails.yomobi;
      }

      return Backbone_set.call(this, attributes, options);
    }
  });
  
})(jQuery);

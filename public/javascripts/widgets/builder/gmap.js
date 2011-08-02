// 
// BUILDER
// 
(function ($) {
  
  widgetClasses.gmap = widgetClasses.gmap.extend({
    
    onHomeViewClick: function () {
      bapp.homeViewWidgetClick(this)
      return false;
    },

    getEditData: function () {
      var extraData = {
        validForShowing: this.validForShowing()
      };
      return _.extend({},this.toJSON(),extraData);
    },

    validate: function (attrs) {
      if (attrs.city)
        attrs.city = util.capitalize(attrs.city);
      if (attrs.state)
        attrs.state = (attrs.state.length == 2) ? attrs.state.toUpperCase() : util.capitalize(attrs.state);
      if (attrs.addr2 && !attrs.addr1) {
        attrs.addr1 = attrs.addr2;
        delete attrs.addr2;
      }
    }
    
  });

  window.widgetEditors.gmap = window.EditWidgetView.extend({
    onEditStart: function () {
      var c = this.widget.get('country');
      this.el.find('select[name=country]').val(c);
    }
  });
  
})(jQuery);

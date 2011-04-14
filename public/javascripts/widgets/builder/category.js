//
// BUILDER
//
(function ($) {

  window.widgetClasses.category = window.widgetClasses.category.extend({
    
    getEditData: function () {
      var data = {}, self = this;
      return _.extend(this.toJSON(),data);
    },
    
    onHomeViewClick: function () {
      util.log('this',this);
      mapp.viewWidget(this);
      
      bapp.homeViewWidgetClick(this);
      return false;
    }
    
  });

  window.widgetEditors.category = window.EditWidgetView.extend({

    events: {
      'click .category':            'openCategory',
    },
    
    init: function (widget) {
      
    },
    
    onEditStart: function () {
      var self = this;
    },
    
    grabWidgetValues: function () {
      return {};
    },
    
    openCategory: function (e) {
      
    }

  });
  
  window.widgetPages.category = window.widgetPages.category.extend({

    onCategoryClick: function (e) {
      var cat = $(e.target).attr('data-cat');
      var subpage = this.widget.catStack.join('/');
      subpage && (subpage += '/');
      
      mapp.viewWidget(this.widget, subpage + cat);
    },
    
    // this event is only triggered by bapp,
    // thus it's only useful when declared in the builder.
    // 
    onBackBtnClick: function () {
      var catStack = this.widget.catStack
        , newSubpage = _.compact(catStack.pop() && catStack).join('/');

      if (!newSubpage) return mapp.transition('back');

      mapp.viewWidget(this.widget,newSubpage);
    }
    
  });

})(jQuery);


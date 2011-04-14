//
// BUILDER
//
(function ($) {

  window.widgetClasses.category = window.widgetClasses.category.extend({
    
    getEditData: function () {
      var showData = this.getShowData();
      if (showData.items.length === 0) showData.items.push('==None==');
      if (showData.cats.length === 0) showData.cats.push('==None==');
      
      var extraData = {
        currentCat: _.last(this.catStack) || this.get('prettyName')
      };
      return _.extend({},showData,extraData);
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
      this.widget.getEditor().startEditing();
    },
    
    // this event is only triggered by bapp,
    // thus it's only useful when declared in the builder.
    // 
    onBackBtnClick: function () {
      var catStack = this.widget.catStack
        , newSubpage = _.compact(catStack.pop() && catStack).join('/')
      ;
      this.widget.getEditor().startEditing();
      
      if (!newSubpage) return mapp.transition('back');
      mapp.viewWidget(this.widget,newSubpage);
    }
    
  });

})(jQuery);


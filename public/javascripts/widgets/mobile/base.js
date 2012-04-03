//
// MOBILE
//
(function ($) {

  var Backbone_set = Backbone.Model.prototype.set;

  window.Widget = Backbone.Model.extend({

    requiredAttrs: [],

    sync: util.couchSync,
    url: function () {
      return 'http://'+g.couchLocation+'/m_' + g.db_name +
             '/_design/widgets/_view/by_name?include_docs=true' +
             '&key="' + this.get('name') + '"';
    },

    getPageContent: function () {
      util.resetCycle();
      this._template || ( this._template =
                          util.getTemplate(this.get('wtype') + '-page') );
      return this._template(this.getShowData());
    },

    getClassNames: function () {
      return this.get('wtype');
    },

    getTitleContent: function () {
      return '<h3>' + this.get('name') + '</h3>';
    },

    getShowData: function () {
      return this.toJSON();
    },

    getOrder: function () {
      return parseInt( mapp.metaDoc.worder[this.id] || 0, 10 );
    },

    setOrder: function (idx) {
      mapp.metaDoc.worder[this.id] = idx;
    },

    getIconData: function () {
      var wdata = this._bdata || util.getWidgetBData(this);
      return {
        wtype: wdata.wtype,
        wsubtype: wdata.wsubtype,
        name: this.get('name'),
        iconName: this.get('iconName') || wdata.wsubtype,
        singletonClass: wdata.singleton ? 'singleton' : ''
      };
    },

    initialize: function () {
      if (this.get('skipInit')) return;

      this.pageView = new (widgetPages[this.get('wtype')] || WidgetPageView)({
        widget: this
      });

      if ( !this.get('name') ) {
        var name = util.prettifyName(this.get('wsubtype'));
        this.set({ name:name });
      }
      // cname means comparable name
      this.cname = util.toComparableName( this.get('name') );
      this.bind('change:name', function () {
        this.cname = util.toComparableName( this.get('name') );
      }, this);

      this.init && this.init();
    },

    validForShowing: function () {
      // this method should return false if this widget should not show
      // up on the mobile page, i.e. not enough information is present.
      //
      // If validity is more complicated than checking attr presence,
      // this method should be overridden.
      var self = this
        , pluckAttr = function (attr) { return self.get(attr); }
      ;
      return !this.get('hide') && _.all(_.map(this.requiredAttrs, pluckAttr));
    },

    set: function(attributes, options) {
      if (attributes._id) {
        attributes.id = attributes._id;
        delete attributes._id;
      }
      return Backbone_set.call(this, attributes, options);
    },

    onHomeViewClick: function () {
      // returning false will cause the view not
      // to transition into the widget's page
      return true;
    }
  });

  window.WidgetPageView = Backbone.View.extend({

    initialize: function (options) {
      this.widget = options.widget;
      if (this.init) this.init();
    },

    setContentElem: function (elem) {
      elem.attr('class','content '+this.widget.getClassNames('wtype'));
      this.el = elem;
      this.delegateEvents(this.events);
      this.el.trigger('postRender');
    },

    // this callback is triggered every time a widget's page is
    // viewed, whether the link originated from the hame page,
    // or the link is pointing to a subpage.
    //
    // Widgets with more than one page should override this function.
    //
    onPageView: function (subpage) {
      // Since most widgets only have one page,
      // the default direction is 'forward'
      return 'forward';
    },

    onGoHome: function () {},

    // this callback is triggered after the page content is generated,
    // but before the page is added to the dom
    beforePageRender: function ($pageContent) {}

  });

  // // // // // // // // // // // // // // // //
  // Functionality shared between some widgets //
  // // // // // // // // // // // // // // // //

  var imgLoadTimer;
  util.widget.resizeOnImgLoad = function ($pageContent) {
    $pageContent.find('img').unbind('load.yo').bind('load.yo', function () {
      clearTimeout(imgLoadTimer);
      imgLoadTimer = setTimeout(function () { mapp.resize(); }, 50);
    });
  };

  // Used in mobile captcha pages. `this` is assumed to be the widget page view.
  //
  util.widget.spawnCaptcha = function () {
    var myWidget = this.widget;
    setTimeout(function () {
      if (mapp.currentWidget === myWidget) util.spawnAritcaptcha();
    },1000);
  };

  // Used in mobile page forms. `this` is assumed to be the widget page view.
  //
  util.widget.widgetPageViewSubmit = function () {
    var self = this
      , form = this.el.find('form')
      , url  = form.attr('action')
      , params = form.serialize()
      , method = form.attr('method')
    ;
    this.el.find('input[type=submit]').prop('disabled',true);
    $.post(url,params,function (data) {
      util.log('data',data);
      self.el
        .find('.input-wrap').hide().end()
        .find('.thanks-wrap').show().end()
      ;
      $(window).scrollTop(0);
    })
    .error(function (e,textStatus,errorThrown) {
      var msg = self.prettyErrorMsg($.parseJSON(e.responseText))
      self.el.find('.response').html('ERROR: '+msg).show('pulsate',{ times:3 });
      self.el.find('input[type=submit]').prop('disabled',false);
      mapp.resize();
    });

    return false;
  };

  // Refreshes the widget page view.
  //
  util.widgetPage.refresh = function () {
    var newContent = $(this.widget.getPageContent())
      , newTitle = this.widget.getTitleContent()
      , activePage = mapp.getActivePage()
    ;
    this.beforePageRender(newContent);
    activePage.content.empty().append(newContent);
    activePage.topBar.find('.title').html(newTitle);
    this.widget.pageView.setContentElem(activePage.content);
  };

})(jQuery);

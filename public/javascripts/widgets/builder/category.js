//
// BUILDER
//
(function ($) {

  var i18n = g.i18n.category
    , $isSelected = function (idx,elem) { return $(elem).is(':selected') }
    , downcase = function (str) { return str.toLowerCase() }
    , isSpecialKey = function (key) { return key.charAt(0) === '_' }
    , bulletTypes = {
      'cat': '&#x25a0;',
      'item': '&#x25cf;',
      'page': '&#x25cf;'
    }
  ;

  var traverseStruct = function (currentNode,f) {
    if (!currentNode) return;

    f(currentNode._data._id, currentNode);

    for (child_id in currentNode) {
      if (child_id.charAt(0) === '_') continue;
      traverseStruct(currentNode[child_id], f);
    }
  };

  var makeSaveFunc = function (dialogView, options) {

    return function () {
      if (!util.reserveUI()) return;
      // wrap in function for code reuse
      var dialogElem = util.ensureClassAncestor(this,'ui-dialog-content');
      var cb = function (data) {
        util.log('wut', data);
        util.releaseUI();

        if (data.result !== 'success' && data.result !== 'noupload') {
          alert('Photo upload failed ('+ data.result +')');
          return;
        }
        dialogElem.dialog("close");

        if (data.wphotoUrl) {
          $(dialogView.el).find('input[name=wphotoUrl]').val(data.wphotoUrl);
        }
        options.onUpload(options.addAnother);
      };
      // check for queued upload
      var uploader = util._uploaders['dialog'];

      if (options.validator && options.validator(options.addAnother) !== true
         || options.skipUpload
      ) {
        // skip upload until validator returns true
        util.releaseUI();
        options.onUpload(options.addAnother);
      }
      else if (uploader.files.length > 0 && uploader.files[0].status !== plupload.DONE) {
        util.log('has stuff!',dialogElem);
        dialogElem
          .find('input,textarea,button').prop('disabled',true).end()
          .find('a').hide().end()
        ;
        uploader.yomobiOptions.onDone = cb;
        uploader.start();
      }
      else {
        util.log('empty');
        cb({ result:'noupload' });
      }
    }
  };

  var makeCloseFunc = function (dialogView) {
    return function () {
      if (!util.isUIFree()) return;
      $(this).dialog("close");
      dialogView.options.onClose && dialogView.options.onClose();
    };
  }

  var initDialogUploader = function (dialogView, dialog, shouldEmptyQueue) {
    // configure uploader; callback will be configured later in makeSaveFunc()

    // This delay is needed because the flash object is present for a
    // split second, just enough time for a double click to catch it (bad)
    setTimeout(function () {
      util.initUploader( dialog.find('.wphoto-wrap'), {
        instanceId: 'dialog',
        auto: false,
        alwaysOnTop: true,
        emptyQueue: shouldEmptyQueue,
        wid: dialogView.model.id
      });
      // Because we're in a dialog, we need to set the uploader to be
      // on top of everything else.
      util._uploaders['dialog'].bringToFront();
    }, 300);
  }

  var validateOrder = function (node_id, node) {
    var children_ids = _(node).chain().keys().reject(isSpecialKey).value() // 9
      , order = _.compact(node._data._order) // 13
      , intersection = _.intersect(children_ids, order)
      , doesOrderContainAllChildren = children_ids.length === intersection.length
    ;
    if (!doesOrderContainAllChildren) {
      _.each(children_ids, function (id) {
        if (_.indexOf(order,id) === -1) order.unshift(id);
      });
      node._data._order = order;
    }

    // remove duplicates
    order = _.uniq(order);

    var orderHasExtras = order.length > children_ids.length;
    if (orderHasExtras) {
      var extras = _.without.apply(null, [order].concat(children_ids))
      node._data._order = _.without.apply(null, [order].concat(extras))
    }
  };

  var uploaderCallback = function(data) {
    util.log('wutt',data, 'node_id', this.node_id);
    if (data.result !== 'success' && data.result !== 'noupload') {
      alert('Photo upload failed ('+ data.result +')');
      util.releaseUI();
      return;
    }
    var node = this.editor.widget.getNodeById(this.node_id);
    node._data.wphotoUrl = data.wphotoUrl;
    // accept() needs the UI to be free
    util.releaseUI();
    this.editor.accept();
    this.pageView.refresh();
  };

  // // // // // // // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  //  Widget Class  // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  var super_getEditAreaData = window.Widget.prototype.getEditAreaData
    , super_init = window.widgetClasses.category.prototype.init
  ;
  window.widgetClasses.category = window.widgetClasses.category.extend({

    init: function () {
      super_init.call(this);
      this.origStruct = util.clone(this.get('struct'));
    },

    getEditAreaData: function () {
      var editAreaData = super_getEditAreaData.call(this);
      var extraData = {
        hideSaveButton: true,
        hideCancelButton: true,
        hideRemoveLink: mapp.pageLevel !== 0,
        hideHelpText: mapp.pageLevel !== 0
      };
      return _.extend({},editAreaData,extraData);
    },

    getEditData: function () {
      var showData = this.getShowData()
        , isThereStuff = true
      ;

      if (showData.stuff.length === 0) {
        showData.stuff = [{ name:i18n.empty_node_list }];
        isThereStuff = false;
      }

      var extraData = {
        currentCat: util.topCatName(this.catStack) || this.get('name'),
        currentNodeType: _.last(this.catStack)._data.type,
        catCrumbs: util.catStackCrumbs(this.get('name'),this.catStack),
        onHomePage: mapp.pageLevel === 0,
        onRootPage: this.catStack.length === 1,
        isThereStuff: isThereStuff,
        catLabel: this.get('catTypeName'),
        itemLabel: this.get('itemTypeName'),
        itemIconName: 'leaf',
        bulletTypes: bulletTypes,
        wphotoPreviewPath: this.getCurrentLevel(true)._data.wphotoUrl || g.noPhotoPath
      };
      return _.extend({},showData,extraData);
    },

    onHomeViewClick: function () {
      bapp.homeViewWidgetClick(this);
      return false;
    },

    beforeSave: function (attrs) {
      traverseStruct(attrs.struct, validateOrder);
    },

    onSave: function () {
      this.origStruct = util.clone(this.get('struct'));
    }
  });


  // // // // // // // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  //  Editor  // // // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  var super_accept = window.EditWidgetView.prototype.accept
    , super_refreshViews = window.EditWidgetView.prototype.refreshViews
  ;
  window.widgetEditors.category = window.EditWidgetView.extend({

    treeTypes: ['cat'],

    events: {
      'click input[name=beginEditing]':     'enterEditMode',
      'click input[name=back]':             'transitionBack',
      'click .back.button':                 'transitionBack',
      'change [name=hideWidget]':           'toggleHideStatus',

      'click .add-cat.button':              'addCat',
      'click .rename.button':               'onRenameButtonClick',
      'click .edit.button':                 'edit',
      'dblclick .node':                     'edit',
      'click .delete.button':               'deleteNodes',

      'click .add-item.button':             'addItem',
      'click .rename-link':                 'rename',
      'click .remove-wphoto-link':          'removeWPhoto',

      'click .add-rss-feed.button':         'addRssFeed',
      'sortstop':                           'updateOrder'
    },

    init: function (widget) {
      // this is needed for proper inheritance due to closures
      this.AddItemDialog = util.widgetEditor.AddItemDialog;
    },

    // the button that activates this should only be available on the home page
    enterEditMode: function () {
      mapp.viewWidget(this.widget);
      this.startEditing();
    },

    onEditStart: function (resetChanges, firstEdit) {
      if (resetChanges) this.discardChanges();

      if (firstEdit) {
        this.widget.resetCatStack();
      }
      var callback = _.bind(uploaderCallback, {
        node_id: this.widget.getCurrentNode()._data._id,
        editor: this,
        pageView: this.widget.pageView
      });

      if (mapp.pageLevel === 0) {
        this.$('[name=hideWidget]').prop('checked', this.widget.get('hide'));
      }
      else if (mapp.pageLevel > 0 && this.widget.getCurrentNode()._data.type !== 'page') {
        util.initUploader( $(this.el).find('.wphoto-wrap'), {
          onDone: callback,
          emptyQueue: true,
          wid: this.widget.id
        });
      }
      else if (util._uploaders['default']) {
        util._uploaders['default'].destroy();
      }

      $('.nodes').sortable({ handle:'.handle' }).selectable();
    },

    grabWidgetValues: function () {
      return { struct:this.widget.get('struct') };
    },

    accept: function () {
      // grab all selected indicies and make sure they're selected after save
      var select = this.el.find('select[name=stuff]')
        , selectedIdxs = select.find('option').map($isSelected)
        , scrollTop = select.scrollTop()
        , callback = _.bind(this.selectStuff,this,selectedIdxs,scrollTop)
      ;
      // first argument is an event object
      super_accept.call(this,null,callback);
    },

    toggleHideStatus: function (e) {
      var isChecked = $(e.target).is(':checked');
      this.widget.set({ hide:isChecked });
      this.accept();
    },

    remove: function () {
      if ( EditWidgetView.prototype.remove.call(this) )
        mapp.goHome();
    },

    cancel: function () {
      this.discardChanges();
      EditWidgetView.prototype.cancel.call(this);
      mapp.goHome();
      bapp.currentEditor.stopEditing();
    },

    discardChanges: function () {
      util.log('Discarding changes for category widget');
      var currentNode_id = this.widget.getCurrentNode()._data._id;
      this.widget.set({ struct:util.clone(this.widget.origStruct) });
      this.widget.setCatStackById(currentNode_id);
    },

    onDiscardByNavigation: function () {
      this.discardChanges();
    },

    transitionBack: function (e) {
      // transition to the previous page by emulating a click
      mapp.getActivePage().find('.back-btn').click();
    },

    preventSorting: function () {
      if ( !this.hasChanges() ) return;
      this.$('.nodes').sortable('option', 'delay', 50000);
    },

    addCat: function (e) {
      if (!util.isUIFree()) return;

      this.catDialog = this.catDialog || new AddCatDialog();
      this.catDialog.model = this.widget;
      this.catDialog.options = {
        onClose: this.refreshViews
      };

      this.catDialog.enterMode('add').prompt();
    },

    edit: function (e) {
      if (!util.isUIFree()) return;

      // transition into subcat by emulating a click
      var node = this.getFirstSelectedNode();
      if (!node) return alert(i18n.edit_nothing);

      if (_.include(this.treeTypes, node._data.type)) {
        this.widget.pageView.$('tr[data-id='+ node._data._id +']').click();
      }
      else {
        this.editItem( node._data._id );
      }
    },

    onRenameButtonClick: function (e) {
      if (!util.isUIFree()) return;

      var node = this.getFirstSelectedNode();
      if (!node) return alert(i18n.rename_nothing);

      this.catDialog = this.catDialog || new AddCatDialog();
      this.catDialog.model = this.widget;
      this.catDialog.options = {
        onClose: this.refreshViews,
        node_id: node._data._id,
        hideUploader: true
      };

      this.catDialog.enterMode('edit').prompt(null,node._data.name);
    },

    updateOrder: function (e,ui) {
      if (!util.isUIFree()) return;

      var self = this, newOrder = [], noChange = true
        , oldOrder = this.widget.getCurrentNode()._data._order
      ;
      this.$('.nodes .node').each(function (idx, elem) {
        var node_id = $(elem).data('id');
        newOrder.push(node_id);
        noChange = noChange && (node_id === oldOrder[idx]);
      });
      if (noChange) return;

      this.widget.getCurrentNode()._data._order = newOrder;
      this.updateNodeListUI();
    },

    deleteNodes: function (e) {
      if (!util.isUIFree()) return;

      var level = this.widget.getCurrentLevel(true)
        , selectedIds = this.getSelectedNodeIds()
        , hasSomeSelected = selectedIds.length > 0
      ;
      if (hasSomeSelected && !confirm(i18n.delete_node)) return;
      else if (!hasSomeSelected) return alert(i18n.delete_nothing);

      _.map(selectedIds, function (node_id) {

        if (level[node_id]) {
          delete level[node_id];
          var orderIdx = _.indexOf(level._data._order, node_id);
          level._data._order.splice(orderIdx,1);
        }
      });

      this.updateNodeListUI();
    },

    getSelectedNodeIds: function () {
      return this.$('.nodes .node.ui-selected').map(function (idx,elem) {
        return $(elem).data('id');
      });
    },

    getFirstSelectedNode: function () {
      var node_id = this.$('.nodes .node.ui-selected:first').data('id');
      return node_id ? this.widget.getNodeById(node_id) : null;
    },

    addItem: function (e) {
      if (!util.isUIFree()) return;

      this.itemDialog = this.itemDialog || new this.AddItemDialog({ model:this.widget });
      this.itemDialog.model = this.widget;
      this.itemDialog.options = {
        onClose: this.refreshViews,
        hideUploader: this.itemDialog.type === 'page'
      };

      this.itemDialog.enterMode('add').prompt();
    },

    addRssFeed: function (e) {
      if (!util.isUIFree()) return;

      // Node the important lack of `this` before `AddItemDialog`
      this.itemDialog = this.rssDialog ||
                        new util.widgetEditor.AddItemDialog({ model:this.widget });
      this.rssDialog || (this.rssDialog = this.itemDialog);

      this.itemDialog.model = this.widget;
      this.itemDialog.options = {
        onClose: this.refreshViews,
        hideUploader: this.itemDialog.type === 'page',
        defaultItem: { name:'', type:'rss-feed' }
      };

      this.itemDialog.enterMode('add').prompt(undefined);
    },

    editItem: function (item_id) {
      if (!util.isUIFree()) return;
      util.log('Editing item');

      var level = this.widget.getCurrentLevel(true)
        , item = level[item_id]._data
      ;
      if (_.isEmpty(item)) return alert(i18n.edit_nothing);

      var dialog = this.itemDialog || new this.AddItemDialog({ model: this.widget });
      this.itemDialog || (this.itemDialog = dialog);
      dialog.options = {
        onClose: this.refreshViews
      };
      dialog.enterMode('edit').prompt(null,item);
    },

    removeWPhoto: function (e) {
      e.preventDefault();
      var currentNode = this.widget.getCurrentLevel(true);
      this.removeWPhotoFromNode(currentNode);
      this.accept();
      this.widget.pageView.refresh();
    },

    removeWPhotoFromNode: function (node) {
      node._data.wphotoUrl = '';
    },

    selectStuff: function (selectedIdxs,scrollTop) {
      this.el.find('select[name=stuff]')
        .find('option')
          .each(function (idx,elem) {
            if (selectedIdxs[idx] === true) elem.selected = 'selected';
          })
      ;
      // not sure why, but this seems to work while chaining does not.
      // no time to investigate
      this.el.find('select[name=stuff]').scrollTop(scrollTop);
    },

    updateNodeListUI: function () {
      this.setChanged('something',true);
      this.refreshViews();
    },

    refreshViews: function (options) {
      this.preventSorting();
      super_refreshViews.call(this, options);
    }

  });


  // // // // // // // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  //  Widget Page   // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  // // // // // // // // // // // // // // // // // // // // // // // // //
  window.widgetPages.category = window.widgetPages.category.extend({

    onItemClick: function (e) {
      var target = util.ensureClassAncestor(e.target, 'item');
      if (!target) return;

      var node_id = target.data('id');
      this.widget.getEditor()
        .el.find('.nodes .node')
        .removeClass('ui-selected')
        .filter('[data-id="' + node_id + '"]')
          .addClass('ui-selected')
          .dblclick()
      ;
    },

    onCategoryClick: function (e) {
      if (!mapp.canTransition()) return;

      var target = util.ensureClassAncestor(e.target, 'item');
      if (!target) return;

      var cat_id = target.data('id');

      mapp.viewWidget(this.widget, cat_id);
      this.widget.getEditor().startEditing();
    },

    // this event is only triggered by bapp,
    // thus it's only useful when declared in the builder.
    //
    onBackBtnClick: function () {
      if (!mapp.canTransition()) return;

      var catStack = this.widget.catStack;

      if (catStack.length === 1) {
        mapp.goHome();
      }
      else {
        catStack.pop();
        var subpage = (catStack.length === 1) ? null : _.last(catStack)._data._id;
        mapp.viewWidget(this.widget, subpage);
      }

      this.widget.getEditor().startEditing();
    },

    refresh: function () {
      if (mapp.pageLevel === 0) return;
      util.widgetPage.refresh.call(this);
    }

  });






  ////////////////////////////
  // private helper classes //
  ////////////////////////////
  var addCatTemplate  = util.getTemplate('add-subcat-dialog')
    , editCatTemplate = util.getTemplate('edit-subcat-dialog')
  ;
  window.AddCatDialog = Backbone.View.extend({

    type: 'cat',

    events: {
      'keydown input[name="cat"]':      'onKeyDown'
    },

    onKeyDown: function (e) {
      var code = e.keyCode || e.which;
      if (code == 13) this.addAnotherSaveFunc.call(this.el);
    },

    initialize: function () {
      _.bindAll(this,'validateCategory', 'isCategoryValid');
      this.addedCats = [];
    },

    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },

    render: function (error,level,name) {
      var template = (this.mode == 'add') ? addCatTemplate : editCatTemplate;

      var dialogHtml = template({
        error: error,
        name: name,
        typeName: this.getTypeName(),
        addedCats: this.addedCats,
        hideUploader: this.type === 'page'
      });

      var self = this;
      $(this.el).html(dialogHtml)
        .attr('title',this.el.children[0].title)
      ;
      return this;
    },

    prompt: function (error,origName,keepAddedCats) {
      if (!keepAddedCats) this.addedCats.length = 0;

      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(error,level,origName).el
        , buttons = {}
        , shouldEmptyUploadQueue = !error
      ;
      // cache for later use in validateCategory
      this.level = level;
      if (!error) this.origName = origName;

      buttons[g.i18n.save] = makeSaveFunc(this, {
        onUpload: this.validateCategory,
        validator: this.isCategoryValid,
        skipUpload: this.options.hideUploader
      });
      buttons[g.i18n.cancel] = makeCloseFunc(this);

      // cache for use when user hits enter key
      this.addAnotherSaveFunc = makeSaveFunc(this, {
        addAnother: true,
        onUpload: this.validateCategory,
        validator: this.isCategoryValid,
        skipUpload: this.options.hideUploader
      });

      var dialog = util.dialog(dialogContent, buttons, dialogContent.title)
        .find('p.error').show('pulsate',{times:3}).end()
        .find('[name=add]').click(this.addAnotherSaveFunc).end()
      ;

      if (this.options.hideUploader) {
        util._uploaders['dialog'] && util._uploaders['dialog'].destroy();
      }
      else {
        initDialogUploader(this, dialog, shouldEmptyUploadQueue);
      }
    },

    isCategoryValid: function (addAnother) {
      // TODO: redundant code. Make validateCategory() use
      //       this code somehow.
      var name = $(this.el).find('input[name=cat]').val()
        , name = $.trim(name)

        , nameCompare = name.toLowerCase()
        , origNameCompare = (this.origName || '').toLowerCase()
        , existingNames = _.map(this.getCatNames(), downcase)
      ;
      if (_.isEmpty(name) && this.addedCats.length > 0 && addAnother !== true) {
        return true;
      }
      if (_.isEmpty(name) ||
          nameCompare !== origNameCompare &&
          _.contains(existingNames,nameCompare)
      ){
        return false;
      }
      if (this.mode === 'add' ||
          this.mode == 'edit' && name !== this.origName
      ){
        return true;
      }
      return false;
    },

    validateCategory: function (addAnother) {
  		$(this.el).dialog("close");
      var name = $(this.el).find('input[name=cat]').val()
        , name = $.trim(name)

        , nameCompare = name.toLowerCase()
        , origNameCompare = (this.origName || '').toLowerCase()
        , existingNames = _.map(this.getCatNames(), downcase)
      ;
      if (_.isEmpty(name) && this.addedCats.length > 0 && addAnother !== true)
        this.options.onClose && this.options.onClose();
  		else if (_.isEmpty(name)) {
  		  this.prompt(i18n.empty_name_error,undefined,true);
      }
      else if ( nameCompare !== origNameCompare && _.contains(existingNames,nameCompare) )
        this.prompt(i18n.name_in_use_error,name,true);
      else if (this.mode == 'add') {
        this.addNodeToStruct({
          type: this.type,
          name: name,
          wphotoUrl: $(this.el).find('input[name=wphotoUrl]').val()
        });
        this.addedCats.push(name);

        bapp.currentEditor.setChanged('something',true);
        if (addAnother)
          this.prompt(undefined,undefined,true);
        else
          this.options.onClose && this.options.onClose();
      }
      else if (this.mode == 'edit' && name !== this.origName) {
        this.renameNode(name);

        bapp.currentEditor.setChanged('something',true);
        this.options.onClose && this.options.onClose();
      }
    },

    getCatNames: function () {
      return _.pluck(this.level._items, 'name');
    },

    addNodeToStruct: function (data) {
      var level = this.model.getCurrentLevel(true)
        , level_id = level._data._id
        , cat_id = util.generateId()
        , newPath = this.model.paths[ level_id ].concat([cat_id])
        , newCat = {
          _data: _.extend({ _id:cat_id, _order:[] }, data)
        }
      ;
      level[cat_id] = newCat;
      this.model.paths[cat_id] = newPath;
      level._data._order.push(cat_id);
    },

    renameNode: function (newName) {
      if (!this.options.node_id) return;

      var node = this.level._ref[this.options.node_id];
      node._data.name = newName;
    },

    getTypeName: function () {
      var node = this.model.getCurrentNode()[this.options.node_id]
        , isCat = this.mode === 'add' || node && node._data.type === 'cat'
        , typeName = isCat ? 'catTypeName' : 'itemTypeName'
      ;
      if (node && node._data.type === 'rss-feed')
        return 'Rss Feed';
      else
        return this.model.get(typeName);
    }

  });

  // =================================
  var itemDialogTemplate = util.getTemplate('item-dialog');
  util.widgetEditor.AddItemDialog = Backbone.View.extend({

    initialize: function () {
      this.template = util.getTemplate(this.model.get('wsubtype')+'-item-dialog-content');
      this.addedItems = [];
      _.bindAll(this, 'saveItem', 'isItemValid');
    },

    enterMode: function (mode) {
      this.mode = mode;
      return this;
    },

    render: function (flash,level,item) {
      flash || (flash = {});
      item || (item = {});
      var itemTypeName = item.type || this.model.get('itemTypeName');
      var title = (this.mode == 'add' ? i18n.dialog.add_new_item : i18n.dialog.edit_item) + util.prettifyName(itemTypeName);

      var templateData = _.extend({}, item, {
        flash: flash,
        _items: level._items,
        itemTypeName: this.model.get('itemTypeName'),
        addedItems: this.addedItems,
        mode: this.mode
      });
      var template = (item.type === 'rss-feed') ?
                      util.getTemplate('rss-feed-item-dialog-content') :
                      this.template;
      templateData.innerContent = template(templateData);
      var dialogHtml = itemDialogTemplate(templateData);

      $(this.el).html(dialogHtml).attr('title',title);
      return this;
    },

    prompt: function (flash,item,keepAddedItems) {
      if (!keepAddedItems) this.addedItems.length = 0;
      item || (item = this.options.defaultItem);

      var self = this
        , level = this.model.getCurrentLevel()
        , dialogContent = this.render(flash,level,item).el
        , shouldEmptyUploadQueue = !flash || !flash.error
      ;
      // cache for later use
      this.level = level;
      if (!flash || !flash.error) this.origItem = item;

      var buttons = {};

      buttons[g.i18n.save] = makeSaveFunc(this, { onUpload:this.saveItem, validator:this.isItemValid });
      buttons[g.i18n.cancel] = makeCloseFunc(this);

      var dialog = util.dialog(dialogContent, buttons, dialogContent.title)
        .find('p.error').show('pulsate',{times:3}).end()
        .find('p.success').show('pulsate',{times:1}).end()
        .find('input[name=add]').click( makeSaveFunc(this, {
            onUpload: this.saveItem,
            validator: this.isItemValid,
            addAnother: true
            })
          ).end()
        .find('.remove-wphoto-link').click(function (e) {
          e.preventDefault();
          $(this).hide();
          $(self.el).find('[name=wphotoUrl]').val('').end()
                    .find('.wphoto-wrap img').hide();
          util._uploaders['dialog'].reposition();
        }).end()
      ;

      initDialogUploader(this, dialog, shouldEmptyUploadQueue);
    },

    validateItem: function (item) {

      var name = $.trim(item.name)
        , nameCompare = name.toLowerCase()
        , origNameCompare = (this.origItem || {name:''}).name.toLowerCase()
        , existingNames = _.map(_.pluck(this.level._items,'name'), downcase)
      ;
  		if (_.isEmpty(name)) {
  		  this.prompt({ error:i18n.empty_name_error },item,true);
  		  return false;
  		}
      else if (nameCompare !== origNameCompare && _.include(existingNames,nameCompare)) {
        this.prompt({ error:i18n.name_in_use_error },item,true);
        return false;
      }
      else if (item.type === 'rss-feed' && !item.url) {
        this.prompt({ error:i18n.rss_url_required },item,true);
        return false;
      }
      return true;
    },

    isItemValid: function (addAnother) {
      // TODO: redundant code. Make saveItem() use
      //       this code somehow.
      var activeItemData = {};
      $(this.el).find('.item-input').each(function (idx,elem) {
        activeItemData[$(elem).attr('name')] = $(elem).val();
      });

      var inputs = _(activeItemData).chain().reject(util.keq('type'))
                                    .values().compact().value();
      if (inputs.length === 0 && this.addedItems.length > 0 && addAnother !== true) {
        return true;
      }
      if (!this.validateItem(activeItemData)) {
        return false;
      }
      if (this.mode == 'add' || this.mode == 'edit') {
        return true;
      }
      return false;
    },

    saveItem: function (addAnother) {
      var activeItemData = {};
      $(this.el).find('.item-input').each(function (idx,elem) {
        activeItemData[$(elem).attr('name')] = $(elem).val();
      });

      var inputs = _(activeItemData).chain().reject(util.keq('type'))
                                    .values().compact().value();
      if (inputs.length === 0 && this.addedItems.length > 0 && addAnother !== true)
        return this.options.onClose && this.options.onClose();
      if (!this.validateItem(activeItemData)) return;

      if (this.mode == 'add') {
        AddCatDialog.prototype.addNodeToStruct.call(this,activeItemData);

        this.addedItems.push(activeItemData.name);
        bapp.currentEditor.setChanged('something',true);

        if (addAnother === true)
          this.prompt({ success:i18n.add_node_success },undefined,true);
        else
          this.options.onClose && this.options.onClose();
      }
      else if (this.mode == 'edit') {
        var origItem_id = this.origItem._id;
        var oldItem = _.detect(this.level._items, function (i) {
          return i._id == origItem_id
        });
        _.extend(oldItem,activeItemData);

        bapp.currentEditor.setChanged('something',true);
        this.options.onClose && this.options.onClose();
      }
    }
  });

})(jQuery);


(function() {

  window.Locomotive = {
    mounted_on: window.Locomotive.mounted_on,
    Models: {},
    Collections: {},
    Views: {}
  };

  window.Locomotive.Views.Memberships = {};

}).call(this);
(function() {
  var _ref;

  window.Aloha = (_ref = window.Aloha) != null ? _ref : window.Aloha = {};

  window.Aloha.settings = {
    logLevels: {
      'error': true,
      'warn': true,
      'info': false,
      'debug': false
    },
    errorhandling: true,
    plugins: {
      format: {
        config: ['b', 'i', 'u', 'del', 'sub', 'sup', 'p', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'removeFormat'],
        editables: {
          '.editable-short-text': ['b', 'i', 'u']
        }
      },
      link: {
        config: ['a'],
        editables: {
          '.editable-short-text': []
        }
      },
      list: {
        config: ['ul'],
        editables: {
          '.editable-short-text': []
        }
      },
      image: {
        ui: {
          insert: false,
          crop: false
        }
      }
    },
    i18n: {
      available: ['en', 'fr', 'pt-BR', 'es', 'de', 'no', 'ru', 'nl']
    },
    sidebar: {
      disabled: true
    }
  };

}).call(this);
(function() {
  String.prototype.trim = function() {
    return this.replace(/^\s+/g, '').replace(/\s+$/g, '');
  }

  String.prototype.repeat = function(num) {
    for (var i = 0, buf = ""; i < num; i++) buf += this;
    return buf;
  }

  String.prototype.truncate = function(length) {
    if (this.length > length) {
      return this.slice(0, length - 3) + "...";
    } else {
      return this;
    }
  }

  String.prototype.slugify = function(sep) {
    if (typeof sep == 'undefined') sep = '_';
    var alphaNumRegexp = new RegExp('[^\\w\\' + sep + ']', 'g');
    var avoidDuplicateRegexp = new RegExp('[\\' + sep + ']{2,}', 'g');
    return this.replace(/\s/g, sep).replace(alphaNumRegexp, '').replace(avoidDuplicateRegexp, sep).toLowerCase();
  }

  window.addParameterToURL = function(key, value, context) { // code from http://stackoverflow.com/questions/486896/adding-a-parameter-to-the-url-with-javascript
    if (typeof context == 'undefined') context = document;

    key = encodeURIComponent(key); value = encodeURIComponent(value);

    var kvp = context.location.search.substr(1).split('&');

    var i = kvp.length; var x; while(i--) {
      x = kvp[i].split('=');

      if (x[0] == key) {
        x[1] = value;
        kvp[i] = x.join('=');
        break;
      }
    }

    if (i < 0) { kvp[kvp.length] = [key,value].join('='); }

    //this will reload the page, it's likely better to store this until finished
    context.location.search = kvp.join('&');
  }

  window.addJavascript = function(doc, src, options) {
    var script = doc.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    if (options && options.onload) {
      script.onload = options.onload;
      delete(options.onload);
    }
    for (var key in options) {
      script.setAttribute(key, options[key]);
    }
    doc.body.appendChild(script);
  }

  window.addStylesheet = function(doc, src, options) {
    var stylesheet = doc.createElement('link');
    stylesheet.style = 'text/css';
    stylesheet.href = src;
    stylesheet.media = 'screen';
    stylesheet.rel = 'stylesheet';
    doc.head.appendChild(stylesheet);
  }

  $.ui.dialog.prototype.overlayEl = function() { return this.overlay.$el; }

})();

$.growl.settings.noticeTemplate = '' +
  '<div class="notice %title%">' +
  '  <p>%message%</p>' +
  '</div>';

$.growl.settings.dockCss = {
  position: 'fixed',
  bottom: '20px',
  left: '0px',
  width: '100%',
  zIndex: 50000
};

// $.growl.settings.displayTimeout = 500;
(function() {

  Handlebars.registerHelper('each_with_index', function(context, block) {
    var data, num, ret, _i, _len;
    ret = "";
    for (_i = 0, _len = context.length; _i < _len; _i++) {
      num = context[_i];
      data = context[num];
      data._index = num;
      ret = ret + block(data);
    }
    return ret;
  });

}).call(this);
(function() {

  window.Locomotive.tinyMCE = {
    defaultSettings: {
      theme: 'advanced',
      skin: 'locomotive',
      plugins: 'safari,jqueryinlinepopups,locomotive_media,fullscreen',
      extended_valid_elements: 'iframe[width|height|frameborder|allowfullscreen|src|title]',
      theme_advanced_buttons1: 'fullscreen,code,|,bold,italic,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,blockquote,|,link,unlink,|,locomotive_media',
      theme_advanced_buttons2: 'formatselect,fontselect,fontsizeselect',
      theme_advanced_buttons3: '',
      theme_advanced_toolbar_location: 'top',
      theme_advanced_toolbar_align: 'left',
      height: '300',
      width: '709',
      convert_urls: false,
      fullscreen_new_window: false,
      fullscreen_settings: {
        theme_advanced_path_location: 'top'
      }
    },
    minimalSettings: {
      theme: 'advanced',
      skin: 'locomotive',
      plugins: 'safari,jqueryinlinepopups,locomotive_media',
      theme_advanced_buttons1: 'code,|,bold,italic,strikethrough,|,fontselect,fontsizeselect,|,link,unlink,|,locomotive_media',
      theme_advanced_buttons2: '',
      theme_advanced_buttons3: '',
      theme_advanced_toolbar_location: 'top',
      theme_advanced_toolbar_align: 'left',
      height: '20',
      width: '709',
      convert_urls: false
    },
    popupSettings: {
      theme: 'advanced',
      skin: 'locomotive',
      plugins: 'safari,jqueryinlinepopups,locomotive_media,fullscreen',
      extended_valid_elements: 'iframe[width|height|frameborder|allowfullscreen|src|title]',
      theme_advanced_buttons1: 'fullscreen,code,|,bold,italic,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,blockquote,|,link,unlink,|,locomotive_media',
      theme_advanced_buttons2: 'formatselect,fontselect,fontsizeselect',
      theme_advanced_buttons3: '',
      theme_advanced_toolbar_location: 'top',
      theme_advanced_toolbar_align: 'left',
      height: '300',
      width: '545',
      convert_urls: false,
      fullscreen_new_window: false,
      fullscreen_settings: {
        theme_advanced_path_location: 'top'
      }
    }
  };

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.Account = (function(_super) {

    __extends(Account, _super);

    function Account() {
      return Account.__super__.constructor.apply(this, arguments);
    }

    Account.prototype.paramRoot = 'account';

    Account.prototype.urlRoot = "" + Locomotive.mounted_on + "/accounts";

    return Account;

  })(Backbone.Model);

  Locomotive.Models.CurrentAccount = (function(_super) {

    __extends(CurrentAccount, _super);

    function CurrentAccount() {
      return CurrentAccount.__super__.constructor.apply(this, arguments);
    }

    CurrentAccount.prototype.url = "" + Locomotive.mounted_on + "/my_account";

    return CurrentAccount;

  })(Locomotive.Models.Account);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.ContentAsset = (function(_super) {

    __extends(ContentAsset, _super);

    function ContentAsset() {
      return ContentAsset.__super__.constructor.apply(this, arguments);
    }

    ContentAsset.prototype.paramRoot = 'content_asset';

    ContentAsset.prototype.urlRoot = "" + Locomotive.mounted_on + "/content_assets";

    ContentAsset.prototype.initialize = function() {
      return this.prepare();
    };

    ContentAsset.prototype.prepare = function() {
      this.set({
        image: this.get('content_type') === 'image'
      });
      return this;
    };

    return ContentAsset;

  })(Backbone.Model);

  Locomotive.Models.ContentAssetsCollection = (function(_super) {

    __extends(ContentAssetsCollection, _super);

    function ContentAssetsCollection() {
      return ContentAssetsCollection.__super__.constructor.apply(this, arguments);
    }

    ContentAssetsCollection.prototype.model = Locomotive.Models.ContentAsset;

    ContentAssetsCollection.prototype.url = "" + Locomotive.mounted_on + "/content_assets";

    return ContentAssetsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.ContentEntry = (function(_super) {

    __extends(ContentEntry, _super);

    function ContentEntry() {
      return ContentEntry.__super__.constructor.apply(this, arguments);
    }

    ContentEntry.prototype.paramRoot = 'content_entry';

    ContentEntry.prototype.urlRoot = "" + Locomotive.mounted_on + "/content_types/:slug/entries";

    ContentEntry.prototype.initialize = function() {
      var _this = this;
      this.urlRoot = this.urlRoot.replace(':slug', this.get('content_type_slug'));
      _.each(this.get('has_many_custom_fields'), function(field) {
        var collection, name;
        name = field[0];
        collection = new Locomotive.Models.ContentEntriesCollection(_this.get(name));
        return _this.set_attribute(name, collection);
      });
      return _.each(this.get('many_to_many_custom_fields'), function(field) {
        var collection, name;
        name = field[0];
        collection = new Locomotive.Models.ContentEntriesCollection(_this.get(name));
        collection.comparator = function(entry) {
          return entry.get('__position') || 0;
        };
        return _this.set_attribute(name, collection);
      });
    };

    ContentEntry.prototype.set_attribute = function(attribute, value) {
      var data;
      data = {};
      data[attribute] = value;
      return this.set(data);
    };

    ContentEntry.prototype.update_attributes = function(attributes) {
      var _this = this;
      return _.each(attributes.file_custom_fields, function(field) {
        var attribute;
        attribute = "" + field + "_url";
        _this.set_attribute(attribute, attributes[attribute]);
        return _this.set_attribute("remove_" + field, false);
      });
    };

    ContentEntry.prototype.toMinJSON = function() {
      var _this = this;
      return _.tap({}, function(hash) {
        return _.each(_this.attributes, function(val, key) {
          if (key === 'id' || key === '_destroy' || key.indexOf('position_in_') === 0) {
            return hash[key] = val;
          }
        });
      });
    };

    ContentEntry.prototype.toJSON = function() {
      var _this = this;
      return _.tap(ContentEntry.__super__.toJSON.apply(this, arguments), function(hash) {
        if (hash['_slug'] === null) {
          hash['_slug'] = '';
        }
        _.each(_.keys(hash), function(key) {
          if (!_.include(_this.get('safe_attributes'), key)) {
            return delete hash[key];
          }
        });
        _.each(_this.get('has_many_custom_fields'), function(field) {
          var name;
          name = field[0];
          if (_this.get(name).length > 0) {
            return hash["" + name + "_attributes"] = _this.get(name).toMinJSON();
          }
        });
        return _.each(_this.get('many_to_many_custom_fields'), function(field) {
          var name, setter_name;
          name = field[0];
          setter_name = field[1];
          return hash[setter_name] = _this.get(name).sort().map(function(entry) {
            return entry.id;
          });
        });
      });
    };

    return ContentEntry;

  })(Backbone.Model);

  Locomotive.Models.ContentEntriesCollection = (function(_super) {

    __extends(ContentEntriesCollection, _super);

    function ContentEntriesCollection() {
      return ContentEntriesCollection.__super__.constructor.apply(this, arguments);
    }

    ContentEntriesCollection.prototype.model = Locomotive.Models.ContentEntry;

    ContentEntriesCollection.prototype.url = "" + Locomotive.mounted_on + "/content_types/:slug/entries";

    ContentEntriesCollection.prototype.toMinJSON = function() {
      var _this = this;
      return this.map(function(entry) {
        return entry.toMinJSON();
      });
    };

    return ContentEntriesCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.ContentType = (function(_super) {

    __extends(ContentType, _super);

    function ContentType() {
      return ContentType.__super__.constructor.apply(this, arguments);
    }

    ContentType.prototype.paramRoot = 'content_type';

    ContentType.prototype.urlRoot = "" + Locomotive.mounted_on + "/content_types";

    ContentType.prototype.initialize = function() {
      return this._normalize();
    };

    ContentType.prototype._normalize = function() {
      return this.set({
        entries_custom_fields: new Locomotive.Models.CustomFieldsCollection(this.get('entries_custom_fields'))
      });
    };

    ContentType.prototype.toJSON = function() {
      var _this = this;
      return _.tap(ContentType.__super__.toJSON.apply(this, arguments), function(hash) {
        delete hash.entries_custom_fields;
        if ((_this.get('entries_custom_fields') != null) && _this.get('entries_custom_fields').length > 0) {
          return hash.entries_custom_fields_attributes = _this.get('entries_custom_fields').toJSONForSave();
        }
      });
    };

    return ContentType;

  })(Backbone.Model);

  Locomotive.Models.ContentTypesCollection = (function(_super) {

    __extends(ContentTypesCollection, _super);

    function ContentTypesCollection() {
      return ContentTypesCollection.__super__.constructor.apply(this, arguments);
    }

    ContentTypesCollection.prototype.model = Locomotive.Models.ContentType;

    ContentTypesCollection.prototype.url = "" + Locomotive.mounted_on + "/content_types";

    return ContentTypesCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.CustomField = (function(_super) {

    __extends(CustomField, _super);

    function CustomField() {
      return CustomField.__super__.constructor.apply(this, arguments);
    }

    CustomField.prototype.initialize = function() {
      this._normalize();
      if (this.get('name') == null) {
        return this.set({
          name: this.get('label').slugify()
        });
      }
    };

    CustomField.prototype._normalize = function() {
      return this.set({
        select_options: new Locomotive.Models.CustomFieldSelectOptionsCollection(this.get('select_options'))
      });
    };

    CustomField.prototype._undesired_fields = ['select_options', 'type_text', 'text_formatting_text', 'inverse_of_text', 'class_name_text', 'undefined_text', 'undefined', 'created_at', 'updated_at'];

    CustomField.prototype._relationship_fields = ['class_name', 'inverse_of', 'ui_enabled'];

    CustomField.prototype.is_relationship_type = function() {
      return _.include(['belongs_to', 'has_many', 'many_to_many'], this.get('type'));
    };

    CustomField.prototype.toJSONForSave = function() {
      var _this = this;
      return _.tap({}, function(hash) {
        var key, value, _ref;
        _ref = _this.toJSON();
        for (key in _ref) {
          value = _ref[key];
          if (!_.include(_this._undesired_fields, key)) {
            if (_.include(_this._relationship_fields, key)) {
              if (_this.is_relationship_type()) {
                hash[key] = value;
              }
            } else {
              hash[key] = value;
            }
          }
        }
        if ((_this.get('select_options') != null) && _this.get('select_options').length > 0) {
          return hash.select_options_attributes = _this.get('select_options').toJSONForSave();
        }
      });
    };

    return CustomField;

  })(Backbone.Model);

  Locomotive.Models.CustomFieldsCollection = (function(_super) {

    __extends(CustomFieldsCollection, _super);

    function CustomFieldsCollection() {
      return CustomFieldsCollection.__super__.constructor.apply(this, arguments);
    }

    CustomFieldsCollection.prototype.model = Locomotive.Models.CustomField;

    CustomFieldsCollection.prototype.toJSONForSave = function() {
      var _this = this;
      return this.map(function(model) {
        return model.toJSONForSave();
      });
    };

    return CustomFieldsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.CustomFieldSelectOption = (function(_super) {

    __extends(CustomFieldSelectOption, _super);

    function CustomFieldSelectOption() {
      return CustomFieldSelectOption.__super__.constructor.apply(this, arguments);
    }

    CustomFieldSelectOption.prototype.destroyed = function() {
      return this.get('_destroy') === true;
    };

    CustomFieldSelectOption.prototype.toJSONForSave = function() {
      var _this = this;
      return _.tap({}, function(hash) {
        var key, value, _ref, _results;
        _ref = _this.toJSON();
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          if (!_.include(['created_at', 'updated_at'], key)) {
            _results.push(hash[key] = value);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    return CustomFieldSelectOption;

  })(Backbone.Model);

  Locomotive.Models.CustomFieldSelectOptionsCollection = (function(_super) {

    __extends(CustomFieldSelectOptionsCollection, _super);

    function CustomFieldSelectOptionsCollection() {
      return CustomFieldSelectOptionsCollection.__super__.constructor.apply(this, arguments);
    }

    CustomFieldSelectOptionsCollection.prototype.model = Locomotive.Models.CustomFieldSelectOption;

    CustomFieldSelectOptionsCollection.prototype.toJSONForSave = function() {
      var _this = this;
      return this.map(function(model) {
        return model.toJSONForSave();
      });
    };

    return CustomFieldSelectOptionsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.Domain = (function(_super) {

    __extends(Domain, _super);

    function Domain() {
      return Domain.__super__.constructor.apply(this, arguments);
    }

    return Domain;

  })(Backbone.Model);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.EditableElement = (function(_super) {

    __extends(EditableElement, _super);

    function EditableElement() {
      return EditableElement.__super__.constructor.apply(this, arguments);
    }

    EditableElement.prototype.toJSONForSave = function() {
      var _this = this;
      return _.tap({}, function(hash) {
        var key, value, _ref;
        _ref = _this.toJSON();
        for (key in _ref) {
          value = _ref[key];
          if (_.include(['id', 'source', 'content', 'remove_source'], key)) {
            hash[key] = value;
          }
        }
        if (_this.get('type') === 'EditableFile') {
          return delete hash['content'];
        } else {
          return delete hash['source'];
        }
      });
    };

    return EditableElement;

  })(Backbone.Model);

  Locomotive.Models.EditableElementsCollection = (function(_super) {

    __extends(EditableElementsCollection, _super);

    function EditableElementsCollection() {
      return EditableElementsCollection.__super__.constructor.apply(this, arguments);
    }

    EditableElementsCollection.prototype.model = Locomotive.Models.EditableElement;

    EditableElementsCollection.prototype.blocks = function() {
      var names,
        _this = this;
      names = _.uniq(this.map(function(editable, index) {
        return editable.get('block_name');
      }));
      return _.tap([], function(list) {
        return _.each(names, function(name, index) {
          return list.push({
            name: name,
            index: index
          });
        });
      });
    };

    EditableElementsCollection.prototype.by_block = function(name) {
      return this.filter(function(editable) {
        return editable.get('block_name') === name;
      });
    };

    EditableElementsCollection.prototype.toJSONForSave = function() {
      var _this = this;
      return this.map(function(model) {
        return model.toJSONForSave();
      });
    };

    return EditableElementsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.Membership = (function(_super) {

    __extends(Membership, _super);

    function Membership() {
      return Membership.__super__.constructor.apply(this, arguments);
    }

    Membership.prototype.toJSONForSave = function() {
      var _this = this;
      return _.tap({}, function(hash) {
        var key, value, _ref, _results;
        _ref = _this.toJSON();
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          if (_.include(['id', '_id', 'role', '_destroy'], key)) {
            _results.push(hash[key] = value);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    return Membership;

  })(Backbone.Model);

  Locomotive.Models.MembershipsCollection = (function(_super) {

    __extends(MembershipsCollection, _super);

    function MembershipsCollection() {
      return MembershipsCollection.__super__.constructor.apply(this, arguments);
    }

    MembershipsCollection.prototype.model = Locomotive.Models.Membership;

    MembershipsCollection.prototype.toJSONForSave = function() {
      var _this = this;
      return this.map(function(model) {
        return model.toJSONForSave();
      });
    };

    return MembershipsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.Page = (function(_super) {

    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.paramRoot = 'page';

    Page.prototype.urlRoot = "" + Locomotive.mounted_on + "/pages";

    Page.prototype.initialize = function() {
      this._normalize();
      return this.set({
        edit_url: "" + Locomotive.mounted_on + "/pages/" + this.id + "/edit"
      });
    };

    Page.prototype._normalize = function() {
      return this.set({
        editable_elements: new Locomotive.Models.EditableElementsCollection(this.get('editable_elements') || [])
      });
    };

    Page.prototype.toJSON = function() {
      var _this = this;
      return _.tap(Page.__super__.toJSON.apply(this, arguments), function(hash) {
        _.each(['fullpath', 'localized_fullpaths', 'templatized_from_parent', 'target_klass_name_text', 'content_type_id_text', 'edit_url', 'parent_id_text', 'response_type_text'], function(key) {
          return delete hash[key];
        });
        delete hash['editable_elements'];
        if ((_this.get('editable_elements') != null) && _this.get('editable_elements').length > 0) {
          hash.editable_elements = _this.get('editable_elements').toJSONForSave();
        }
        delete hash['target_klass_name'];
        if (_this.get('templatized') === true) {
          return hash.target_klass_name = _this.get('target_klass_name');
        }
      });
    };

    return Page;

  })(Backbone.Model);

  Locomotive.Models.PagesCollection = (function(_super) {

    __extends(PagesCollection, _super);

    function PagesCollection() {
      return PagesCollection.__super__.constructor.apply(this, arguments);
    }

    return PagesCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.Site = (function(_super) {

    __extends(Site, _super);

    function Site() {
      return Site.__super__.constructor.apply(this, arguments);
    }

    Site.prototype.paramRoot = 'site';

    Site.prototype.urlRoot = "" + Locomotive.mounted_on + "/sites";

    Site.prototype.initialize = function() {
      var domains, memberships,
        _this = this;
      domains = _.map(this.get('domains_without_subdomain'), function(name) {
        return new Locomotive.Models.Domain({
          name: name
        });
      });
      memberships = new Locomotive.Models.MembershipsCollection(this.get('memberships'));
      return this.set({
        domains: domains,
        memberships: memberships
      });
    };

    Site.prototype.includes_domain = function(name_with_port) {
      var name;
      name = name_with_port.replace(/:[0-9]*/, '');
      return name === this.domain_with_domain() || _.any(this.get('domains'), function(domain) {
        return domain.get('name') === name;
      });
    };

    Site.prototype.domain_with_domain = function() {
      return "" + (this.get('subdomain')) + "." + (this.get('domain_name'));
    };

    Site.prototype.toJSON = function() {
      var _this = this;
      return _.tap(Site.__super__.toJSON.apply(this, arguments), function(hash) {
        delete hash.memberships;
        if ((_this.get('memberships') != null) && _this.get('memberships').length > 0) {
          hash.memberships_attributes = _this.get('memberships').toJSONForSave();
        }
        delete hash.domains;
        return hash.domains = _.map(_this.get('domains'), function(domain) {
          return domain.get('name');
        });
      });
    };

    return Site;

  })(Backbone.Model);

  Locomotive.Models.CurrentSite = (function(_super) {

    __extends(CurrentSite, _super);

    function CurrentSite() {
      return CurrentSite.__super__.constructor.apply(this, arguments);
    }

    CurrentSite.prototype.url = "" + Locomotive.mounted_on + "/current_site";

    return CurrentSite;

  })(Locomotive.Models.Site);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.Snippet = (function(_super) {

    __extends(Snippet, _super);

    function Snippet() {
      return Snippet.__super__.constructor.apply(this, arguments);
    }

    Snippet.prototype.paramRoot = 'snippet';

    Snippet.prototype.urlRoot = "" + Locomotive.mounted_on + "/snippets";

    return Snippet;

  })(Backbone.Model);

  Locomotive.Models.SnippetsCollection = (function(_super) {

    __extends(SnippetsCollection, _super);

    function SnippetsCollection() {
      return SnippetsCollection.__super__.constructor.apply(this, arguments);
    }

    SnippetsCollection.prototype.model = Locomotive.Models.Snippet;

    SnippetsCollection.prototype.url = "" + Locomotive.mounted_on + "/snippets";

    return SnippetsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Models.ThemeAsset = (function(_super) {

    __extends(ThemeAsset, _super);

    function ThemeAsset() {
      return ThemeAsset.__super__.constructor.apply(this, arguments);
    }

    ThemeAsset.prototype.paramRoot = 'theme_asset';

    ThemeAsset.prototype.urlRoot = "" + Locomotive.mounted_on + "/theme_assets";

    return ThemeAsset;

  })(Backbone.Model);

  Locomotive.Models.ThemeAssetsCollection = (function(_super) {

    __extends(ThemeAssetsCollection, _super);

    function ThemeAssetsCollection() {
      return ThemeAssetsCollection.__super__.constructor.apply(this, arguments);
    }

    ThemeAssetsCollection.prototype.model = Locomotive.Models.ThemeAsset;

    ThemeAssetsCollection.prototype.url = "" + Locomotive.mounted_on + "/theme_assets";

    return ThemeAssetsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Locomotive.Views.ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.el = 'body';

    ApplicationView.prototype.render = function() {
      this.render_flash_messages(this.options.flash);
      this.add_submenu_behaviours();
      this.center_ui_dialog();
      this.enable_sites_picker();
      this.enable_content_locale_picker();
      if (this.options.view != null) {
        this.view = new this.options.view(this.options.view_data || {});
        this.view.render();
      }
      window.Locomotive.tinyMCE.defaultSettings.language = window.locale;
      window.Locomotive.tinyMCE.minimalSettings.language = window.locale;
      return this;
    };

    ApplicationView.prototype.render_flash_messages = function(messages) {
      return _.each(messages, function(couple) {
        return $.growl(couple[0], couple[1]);
      });
    };

    ApplicationView.prototype.center_ui_dialog = function() {
      return $(window).resize(function() {
        return $('.ui-dialog-content:visible').dialog('option', 'position', 'center');
      });
    };

    ApplicationView.prototype.add_submenu_behaviours = function() {
      var css;
      $('#submenu ul li.hoverable').each(function() {
        var link, popup, timer;
        timer = null;
        link = $(this);
        (popup = link.find('.popup')).removeClass('popup').addClass('submenu-popup').bind('show', function() {
          return link.find('a').addClass('hover') & popup.css({
            top: link.offset().top + link.height() - 2,
            left: link.offset().left - parseInt(popup.css('padding-left'))
          }).show();
        }).bind('hide', function() {
          return link.find('a').removeClass('hover') & $(this).hide();
        }).bind('mouseleave', function() {
          return popup.trigger('hide');
        }).bind('mouseenter', function() {
          return clearTimeout(timer);
        });
        $(document.body).append(popup);
        return link.hover(function() {
          return popup.trigger('show');
        }, function() {
          return timer = window.setTimeout((function() {
            return popup.trigger('hide');
          }), 30);
        });
      });
      css = $('#submenu > ul').attr('class');
      if (css !== '') {
        return $("#submenu > ul > li." + css).addClass('on');
      }
    };

    ApplicationView.prototype.enable_sites_picker = function() {
      var left, link, picker;
      link = this.$('#sites-picker-link');
      picker = this.$('#sites-picker');
      if (picker.size() === 0) {
        return;
      }
      left = link.position().left + link.parent().position().left - (picker.width() - link.width());
      picker.css('left', left);
      return link.bind('click', function(event) {
        event.stopPropagation() & event.preventDefault();
        return picker.toggle();
      });
    };

    ApplicationView.prototype.enable_content_locale_picker = function() {
      var link, picker;
      link = this.$('#content-locale-picker-link');
      picker = this.$('#content-locale-picker');
      if (picker.size() === 0) {
        return;
      }
      link.bind('click', function(event) {
        event.stopPropagation() & event.preventDefault();
        return picker.toggle();
      });
      return picker.find('li').bind('click', function(event) {
        var locale;
        locale = $(this).attr('data-locale');
        return window.addParameterToURL('content_locale', locale);
      });
    };

    ApplicationView.prototype.unique_dialog_zindex = function() {
      var _base;
      (_base = window.Locomotive).jQueryModals || (_base.jQueryModals = 0);
      return 998 + window.Locomotive.jQueryModals++;
    };

    return ApplicationView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentAssets || (_base.ContentAssets = {});

  Locomotive.Views.ContentAssets.PickerItemView = (function(_super) {

    __extends(PickerItemView, _super);

    function PickerItemView() {
      return PickerItemView.__super__.constructor.apply(this, arguments);
    }

    PickerItemView.prototype.tagName = 'li';

    PickerItemView.prototype.className = 'asset';

    PickerItemView.prototype.events = {
      'click h4 a, .icon, .image': 'select_asset',
      'click a.remove': 'remove_asset'
    };

    PickerItemView.prototype.render = function() {
      $(this.el).html(ich.content_asset(this.model.toJSON()));
      return this;
    };

    PickerItemView.prototype.select_asset = function(event) {
      event.stopPropagation() & event.preventDefault();
      return this.on_select(this.model);
    };

    PickerItemView.prototype.on_select = function() {
      if (this.options.parent.options.on_select) {
        return this.options.parent.options.on_select(this.model);
      }
    };

    PickerItemView.prototype.remove_asset = function(event) {
      var message;
      event.stopPropagation() & event.preventDefault();
      message = $(event.target).attr('data-confirm') || $(event.target).parent().attr('data-confirm');
      if (confirm(message)) {
        return this.model.destroy();
      }
    };

    return PickerItemView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  Locomotive.Views.Shared.AssetPickerView = (function(_super) {

    __extends(AssetPickerView, _super);

    function AssetPickerView() {
      return AssetPickerView.__super__.constructor.apply(this, arguments);
    }

    AssetPickerView.prototype.tag = 'div';

    AssetPickerView.prototype.initialize = function() {
      _.bindAll(this, 'add_assets', 'add_asset', 'remove_asset');
      this.collection.bind('reset', this.add_assets);
      this.collection.bind('add', this.add_asset);
      return this.collection.bind('remove', this.remove_asset);
    };

    AssetPickerView.prototype.render = function() {
      $(this.el).html(this.template()());
      this.create_dialog();
      return this;
    };

    AssetPickerView.prototype.template = function() {};

    AssetPickerView.prototype.fetch_assets = function() {};

    AssetPickerView.prototype.build_uploader = function(el, link) {};

    AssetPickerView.prototype.create_dialog = function() {
      var _this = this;
      return this.dialog || (this.dialog = $(this.el).dialog({
        autoOpen: false,
        modal: true,
        zIndex: window.application_view.unique_dialog_zindex(),
        width: 650,
        create: function(event, ui) {
          var actions, input, link;
          $(_this.el).prev().find('.ui-dialog-title').html(_this.$('h2').html());
          _this.$('h2').remove();
          actions = _this.$('.dialog-actions').appendTo($(_this.el).parent()).addClass('ui-dialog-buttonpane ui-widget-content ui-helper-clearfix');
          actions.find('#close-link').click(function(event) {
            return _this.close(event);
          });
          input = actions.find('input[type=file]');
          link = actions.find('#upload-link');
          return _this.build_uploader(input, link);
        },
        open: function(event, ui, extra) {
          return $(_this.el).dialog('overlayEl').bind('click', function() {
            return _this.close();
          });
        }
      }));
    };

    AssetPickerView.prototype.open = function() {
      return $(this.el).dialog('open');
    };

    AssetPickerView.prototype.close = function(event) {
      if (event != null) {
        event.stopPropagation() & event.preventDefault();
      }
      $(this.el).dialog('overlayEl').unbind('click');
      return $(this.el).dialog('close');
    };

    AssetPickerView.prototype.shake = function() {
      return $(this.el).parents('.ui-dialog').effect('shake', {
        times: 4
      }, 100);
    };

    AssetPickerView.prototype.center = function() {
      return $(this.el).dialog('option', 'position', 'center');
    };

    AssetPickerView.prototype.add_assets = function(collection) {
      var _this = this;
      collection.each(function(asset) {
        return _this.add_asset(asset, true);
      });
      return this._refresh();
    };

    AssetPickerView.prototype.add_asset = function(asset, first) {};

    AssetPickerView.prototype.remove_asset = function(asset) {};

    AssetPickerView.prototype._move_to_last_asset = function() {
      var limit;
      limit = this.$('ul.list li.clear').position();
      if (limit != null) {
        return this.$('ul.list').animate({
          scrollTop: limit.top
        }, 100);
      }
    };

    AssetPickerView.prototype._refresh = function() {
      if (this.collection.length === 0) {
        this.$('ul.list').hide() & this.$('p.no-items').show();
      } else {
        this.$('p.no-items').hide() & this.$('ul.list').show();
        this._on_refresh();
      }
      if (this.dialog != null) {
        return this.center();
      }
    };

    AssetPickerView.prototype._on_refresh = function() {};

    AssetPickerView.prototype._reset = function() {};

    return AssetPickerView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentAssets || (_base.ContentAssets = {});

  Locomotive.Views.ContentAssets.PickerView = (function(_super) {

    __extends(PickerView, _super);

    function PickerView() {
      return PickerView.__super__.constructor.apply(this, arguments);
    }

    PickerView.prototype.number_items_per_row = 4;

    PickerView.prototype._item_views = [];

    PickerView.prototype.template = function() {
      return ich.content_asset_picker;
    };

    PickerView.prototype.fetch_assets = function() {
      var _this = this;
      this._reset();
      return this.collection.fetch({
        success: function() {
          return _this.open();
        }
      });
    };

    PickerView.prototype.build_uploader = function(el, link) {
      var _this = this;
      link.bind('click', function(event) {
        event.stopPropagation() & event.preventDefault();
        return el.click();
      });
      return el.bind('change', function(event) {
        return _.each(event.target.files, function(file) {
          var asset;
          asset = new Locomotive.Models.ContentAsset({
            source: file
          });
          return asset.save({}, {
            headers: {
              'X-Flash': true
            },
            success: function(model, response) {
              return _this.collection.add(model.prepare());
            },
            error: function() {
              return _this.shake();
            }
          });
        });
      });
    };

    PickerView.prototype.add_asset = function(asset, first) {
      var view;
      view = new Locomotive.Views.ContentAssets.PickerItemView({
        model: asset,
        parent: this
      });
      (this._item_views || (this._item_views = [])).push(view);
      this.$('ul.list .clear').before(view.render().el);
      this._refresh();
      if (first !== true) {
        return this._move_to_last_asset();
      }
    };

    PickerView.prototype.remove_asset = function(asset) {
      var view;
      view = _.find(this._item_views, function(tmp) {
        return tmp.model === asset;
      });
      if (view != null) {
        view.remove();
      }
      return this._refresh();
    };

    PickerView.prototype._on_refresh = function() {
      var self;
      self = this;
      return this.$('ul.list li.asset').each(function(index) {
        if ((index + 1) % self.number_items_per_row === 0) {
          return $(this).addClass('last');
        } else {
          return $(this).removeClass('last');
        }
      });
    };

    PickerView.prototype._reset = function() {
      _.each(this._item_views || [], function(view) {
        return view.remove();
      });
      return PickerView.__super__._reset.call(this);
    };

    return PickerView;

  })(Locomotive.Views.Shared.AssetPickerView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  Locomotive.Views.Shared.FormView = (function(_super) {

    __extends(FormView, _super);

    function FormView() {
      return FormView.__super__.constructor.apply(this, arguments);
    }

    FormView.prototype.el = '#content';

    FormView.prototype.render = function() {
      this.make_title_editable();
      this._hide_last_separator();
      this.make_inputs_foldable();
      this.enable_save_with_keys_combination();
      this.enable_form_notifications();
      return this;
    };

    FormView.prototype.save = function(event) {};

    FormView.prototype.save_in_ajax = function(event, options) {
      var form, previous_attributes,
        _this = this;
      event.stopPropagation() & event.preventDefault();
      form = $(event.target).trigger('ajax:beforeSend');
      this.clear_errors();
      options || (options = {
        headers: {},
        on_success: null,
        on_error: null
      });
      previous_attributes = _.clone(this.model.attributes);
      return this.model.save({}, {
        headers: options.headers,
        silent: true,
        success: function(model, response, xhr) {
          form.trigger('ajax:complete');
          model.attributes = previous_attributes;
          if (options.on_success) {
            return options.on_success(response, xhr);
          }
        },
        error: function(model, xhr) {
          var errors;
          form.trigger('ajax:complete');
          errors = JSON.parse(xhr.responseText);
          _this.show_errors(errors);
          if (options.on_error) {
            return options.on_error();
          }
        }
      });
    };

    FormView.prototype.make_title_editable = function() {
      var target, title,
        _this = this;
      title = this.$('h2 a.editable');
      if (title.size() > 0) {
        target = this.$("#" + (title.attr('rel')));
        target.parent().hide();
        return title.click(function(event) {
          var newValue;
          event.stopPropagation() & event.preventDefault();
          newValue = prompt(title.attr('title'), title.html());
          if (newValue && newValue !== '') {
            title.html(newValue);
            return target.val(newValue).trigger('change');
          }
        });
      }
    };

    FormView.prototype.make_inputs_foldable = function() {
      var self;
      self = this;
      this.$('.formtastic fieldset.foldable.folded ol').hide();
      return this.$('.formtastic fieldset.foldable legend').click(function() {
        var content, parent;
        parent = $(this).parent();
        content = $(this).next();
        if (parent.hasClass('folded')) {
          parent.removeClass('folded');
          return content.slideDown(100, function() {
            return self.after_inputs_fold(parent);
          });
        } else {
          return content.slideUp(100, function() {
            return parent.addClass('folded');
          });
        }
      });
    };

    FormView.prototype.enable_save_with_keys_combination = function() {
      var _this = this;
      return $.cmd('S', (function() {
        var input;
        input = _this.$('form input[type=text]:focus, form input[type=password]:focus');
        if (input.size() > 0) {
          input.trigger('change');
        }
        return _this.$('form input[type=submit]').trigger('click');
      }), [], {
        ignoreCase: true
      });
    };

    FormView.prototype.enable_form_notifications = function() {
      return this.$('form').formSubmitNotification();
    };

    FormView.prototype.after_inputs_fold = function() {};

    FormView.prototype.clear_errors = function() {
      return this.$('.inline-errors').remove();
    };

    FormView.prototype.show_errors = function(errors) {
      var attribute, html, message, _results;
      _results = [];
      for (attribute in errors) {
        message = errors[attribute];
        if (_.isString(message[0])) {
          html = $("<div class=\"inline-errors\"><p>" + message[0] + "</p></div>");
          _results.push(this.show_error(attribute, message[0], html));
        } else {
          _results.push(this.show_error(attribute, message));
        }
      }
      return _results;
    };

    FormView.prototype.show_error = function(attribute, message, html) {
      var anchor, input;
      input = this.$("#" + this.model.paramRoot + "_" + attribute);
      if (input.size() === 0) {
        input = this.$("#" + this.model.paramRoot + "_" + attribute + "_id");
      }
      if (!(input.size() > 0)) {
        return;
      }
      anchor = input.parent().find('.error-anchor');
      if (anchor.size() === 0) {
        anchor = input;
      }
      return anchor.after(html);
    };

    FormView.prototype._enable_checkbox = function(name, options) {
      var model_name,
        _this = this;
      options || (options = {});
      model_name = options.model_name || this.model.paramRoot;
      return this.$("li#" + model_name + "_" + name + "_input input[type=checkbox]").checkToggle({
        on_callback: function() {
          _.each(options.features, function(exp) {
            return this.$("li#" + model_name + "_" + exp + "_input").hide();
          });
          if (options.on_callback != null) {
            options.on_callback();
          }
          return _this._hide_last_separator();
        },
        off_callback: function() {
          _.each(options.features, function(exp) {
            return this.$("li#" + model_name + "_" + exp + "_input").show();
          });
          if (options.off_callback != null) {
            options.off_callback();
          }
          return _this._hide_last_separator();
        }
      });
    };

    FormView.prototype._hide_last_separator = function() {
      var _this = this;
      return _.each(this.$('fieldset'), function(fieldset) {
        $(fieldset).find('li.last').removeClass('last');
        return $(_.last($(fieldset).find('li.input:visible'))).addClass('last');
      });
    };

    return FormView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentEntries || (_base.ContentEntries = {});

  Locomotive.Views.ContentEntries.FormView = (function(_super) {

    __extends(FormView, _super);

    function FormView() {
      return FormView.__super__.constructor.apply(this, arguments);
    }

    FormView.prototype.el = '#content';

    FormView.prototype._select_field_view = null;

    FormView.prototype._file_field_views = [];

    FormView.prototype._has_many_field_views = [];

    FormView.prototype._many_to_many_field_views = [];

    FormView.prototype.events = {
      'submit': 'save'
    };

    FormView.prototype.initialize = function() {
      this.content_type || (this.content_type = new Locomotive.Models.ContentType(this.options.content_type));
      this.model || (this.model = new Locomotive.Models.ContentEntry(this.options.content_entry));
      return Backbone.ModelBinding.bind(this);
    };

    FormView.prototype.render = function() {
      FormView.__super__.render.call(this);
      this.enable_checkboxes();
      this.enable_datepickers();
      this.enable_richtexteditor();
      this.enable_select_fields();
      this.enable_file_fields();
      this.enable_has_many_fields();
      this.enable_many_to_many_fields();
      this.slugify_label_field();
      return this;
    };

    FormView.prototype.enable_checkboxes = function() {
      return this.$('li.input.toggle input[type=checkbox]').checkToggle();
    };

    FormView.prototype.enable_datepickers = function() {
      return this.$('li.input.date input[type=text]').datepicker();
    };

    FormView.prototype.enable_richtexteditor = function() {
      var _this = this;
      return _.each(this.$('li.input.rte textarea.html'), function(textarea) {
        var settings;
        settings = _.extend({}, _this.tinyMCE_settings(), {
          oninit: (function(editor) {
            return $.cmd('S', (function() {
              editor.save();
              $(textarea).trigger('changeSilently');
              return _this.$('form').trigger('submit');
            }), [], {
              ignoreCase: true,
              document: editor.dom.doc
            });
          }),
          onchange_callback: function(editor) {
            editor.save();
            return $(textarea).trigger('changeSilently');
          }
        });
        return $(textarea).tinymce(settings);
      });
    };

    FormView.prototype.enable_select_fields = function() {
      var _this = this;
      this._select_field_view = new Locomotive.Views.Shared.Fields.SelectView({
        model: this.content_type
      });
      return _.each(this.model.get('select_custom_fields'), function(name) {
        var $input_wrapper;
        $input_wrapper = _this.$("#" + _this.model.paramRoot + "_" + name + "_id_input");
        $input_wrapper.append(ich.edit_select_options_button());
        return $input_wrapper.find('a.edit-options-button').bind('click', function(event) {
          event.stopPropagation() & event.preventDefault();
          return _this._select_field_view.render_for(name, function(options) {
            var $select;
            $select = $input_wrapper.find('select');
            $select.find('option[value!=""]').remove();
            return _.each(options, function(option) {
              if (!option.destroyed()) {
                return $select.append(new Option(option.get('name'), option.get('id'), false, option.get('id') === _this.model.get("" + name + "_id")));
              }
            });
          });
        });
      });
    };

    FormView.prototype.enable_file_fields = function() {
      var _this = this;
      return _.each(this.model.get('file_custom_fields'), function(name) {
        var view;
        view = new Locomotive.Views.Shared.Fields.FileView({
          model: _this.model,
          name: name
        });
        _this._file_field_views.push(view);
        return _this.$("#" + _this.model.paramRoot + "_" + name + "_input label").after(view.render().el);
      });
    };

    FormView.prototype.enable_has_many_fields = function() {
      var _this = this;
      if (!this.model.isNew()) {
        return _.each(this.model.get('has_many_custom_fields'), function(field) {
          var inverse_of, name, new_entry, view;
          name = field[0];
          inverse_of = field[1];
          new_entry = new Locomotive.Models.ContentEntry(_this.options["" + name + "_new_entry"]);
          view = new Locomotive.Views.Shared.Fields.HasManyView({
            model: _this.model,
            name: name,
            new_entry: new_entry,
            inverse_of: inverse_of
          });
          if (view.ui_enabled()) {
            _this._has_many_field_views.push(view);
            return _this.$("#" + _this.model.paramRoot + "_" + name + "_input label").after(view.render().el);
          }
        });
      }
    };

    FormView.prototype.enable_many_to_many_fields = function() {
      var _this = this;
      return _.each(this.model.get('many_to_many_custom_fields'), function(field) {
        var name, view;
        name = field[0];
        view = new Locomotive.Views.Shared.Fields.ManyToManyView({
          model: _this.model,
          name: name,
          all_entries: _this.options["all_" + name + "_entries"]
        });
        if (view.ui_enabled()) {
          _this._many_to_many_field_views.push(view);
          return _this.$("#" + _this.model.paramRoot + "_" + name + "_input label").after(view.render().el);
        }
      });
    };

    FormView.prototype.slugify_label_field = function() {
      return this.$('li.input.highlighted > input[type=text]').slugify({
        target: this.$('#content_entry__slug')
      });
    };

    FormView.prototype.refresh_file_fields = function() {
      var _this = this;
      return _.each(this._file_field_views, function(view) {
        return view.refresh();
      });
    };

    FormView.prototype.refresh = function() {
      var _this = this;
      this.$('li.input.toggle input[type=checkbox]').checkToggle('sync');
      return _.each(this._file_field_views, function(view) {
        return view.refresh();
      });
    };

    FormView.prototype.reset = function() {
      var _this = this;
      this.$('li.input.string input[type=text], li.input.text textarea, li.input.date input[type=text]').val('').trigger('change');
      _.each(this.$('li.input.rte textarea.html'), function(textarea) {
        $(textarea).tinymce().setContent('');
        return $(textarea).trigger('change');
      });
      _.each(this._file_field_views, function(view) {
        return view.reset();
      });
      return this.$('li.input.toggle input[type=checkbox]').checkToggle('sync');
    };

    FormView.prototype.remove = function() {
      var _this = this;
      this._select_field_view.remove();
      _.each(this._file_field_views, function(view) {
        return view.remove();
      });
      _.each(this._has_many_field_views, function(view) {
        return view.remove();
      });
      _.each(this._many_to_many_field_views, function(view) {
        return view.remove();
      });
      return FormView.__super__.remove.apply(this, arguments);
    };

    FormView.prototype.tinyMCE_settings = function() {
      return window.Locomotive.tinyMCE.defaultSettings;
    };

    return FormView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentEntries || (_base.ContentEntries = {});

  Locomotive.Views.ContentEntries.PopupFormView = (function(_super) {

    __extends(PopupFormView, _super);

    function PopupFormView() {
      this.reset = __bind(this.reset, this);
      return PopupFormView.__super__.constructor.apply(this, arguments);
    }

    PopupFormView.prototype.initialize = function() {
      this.create_dialog();
      return PopupFormView.__super__.initialize.call(this);
    };

    PopupFormView.prototype.render = function() {
      PopupFormView.__super__.render.call(this);
      return this;
    };

    PopupFormView.prototype.save = function(event) {
      var _this = this;
      return this.save_in_ajax(event, {
        headers: {
          'X-Flash': true
        },
        on_success: function(response, xhr) {
          var entry;
          entry = new Locomotive.Models.ContentEntry(response);
          _this.options.parent_view.insert_or_update_entry(entry);
          return _this.close();
        }
      });
    };

    PopupFormView.prototype.create_dialog = function() {
      var _this = this;
      return this.dialog = $(this.el).dialog({
        autoOpen: false,
        modal: true,
        zIndex: window.application_view.unique_dialog_zindex(),
        width: 770,
        create: function(event, ui) {
          var actions;
          $(_this.el).prev().find('.ui-dialog-title').html(_this.$('h2').html());
          _this.$('h2').remove();
          actions = _this.$('.dialog-actions').appendTo($(_this.el).parent()).addClass('ui-dialog-buttonpane ui-widget-content ui-helper-clearfix');
          actions.find('#close-link').click(function(event) {
            return _this.close(event);
          });
          return actions.find('input[type=submit]').click(function(event) {
            var $buttons_pane, $form;
            $form = _this.el.find('form');
            $buttons_pane = $(event.target).parent();
            $.rails.disableFormElements($buttons_pane);
            return $form.trigger('submit').bind('ajax:complete', function() {
              return $.rails.enableFormElements($buttons_pane);
            });
          });
        },
        open: function(event, ui, extra) {
          return $(_this.el).dialog('overlayEl').bind('click', function() {
            return _this.close();
          });
        }
      });
    };

    PopupFormView.prototype.open = function() {
      var parent_el;
      parent_el = $(this.el).parent();
      if (this.model.isNew()) {
        parent_el.find('.edit-section').hide();
        parent_el.find('.new-section').show();
      } else {
        parent_el.find('.new-section').hide();
        parent_el.find('.edit-section').show();
      }
      this.clear_errors();
      return $(this.el).dialog('open');
    };

    PopupFormView.prototype.close = function(event) {
      if (event != null) {
        event.stopPropagation() & event.preventDefault();
      }
      this.clear_errors();
      $(this.el).dialog('overlayEl').unbind('click');
      return $(this.el).dialog('close');
    };

    PopupFormView.prototype.center = function() {
      return $(this.el).dialog('option', 'position', 'center');
    };

    PopupFormView.prototype.reset = function(entry) {
      this.model.set(entry.attributes);
      if (entry.isNew()) {
        this.model.id = null;
        return PopupFormView.__super__.reset.call(this);
      } else {
        return this.refresh();
      }
    };

    PopupFormView.prototype.slugify_label_field = function() {};

    PopupFormView.prototype.enable_has_many_fields = function() {};

    PopupFormView.prototype.enable_many_to_many_fields = function() {};

    PopupFormView.prototype.tinyMCE_settings = function() {
      return window.Locomotive.tinyMCE.popupSettings;
    };

    return PopupFormView;

  })(Locomotive.Views.ContentEntries.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentEntries || (_base.ContentEntries = {});

  Locomotive.Views.ContentEntries.EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      return EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.save = function(event) {
      var _this = this;
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          _this.model.update_attributes(response);
          return _this.refresh_file_fields();
        }
      });
    };

    return EditView;

  })(Locomotive.Views.ContentEntries.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentEntries || (_base.ContentEntries = {});

  Locomotive.Views.ContentEntries.IndexView = (function(_super) {

    __extends(IndexView, _super);

    function IndexView() {
      return IndexView.__super__.constructor.apply(this, arguments);
    }

    IndexView.prototype.el = '#content';

    IndexView.prototype.render = function() {
      this.make_sortable();
      return this;
    };

    IndexView.prototype.make_sortable = function() {
      var self;
      self = this;
      return this.$('ul#entries-list.sortable').sortable({
        handle: 'span.handle',
        items: 'li.item',
        axis: 'y',
        update: function(event, ui) {
          return self.call_sort($(this));
        }
      });
    };

    IndexView.prototype.call_sort = function(folder) {
      return $.rails.ajax({
        url: folder.attr('data-url'),
        type: 'post',
        dataType: 'json',
        data: {
          entries: _.map(folder.sortable('toArray'), function(el) {
            return el.replace('entry-', '');
          }),
          _method: 'put'
        },
        success: this.on_successful_sort,
        error: this.on_failed_sort
      });
    };

    IndexView.prototype.on_successful_sort = function(data, status, xhr) {
      return $.growl('success', xhr.getResponseHeader('X-Message'));
    };

    IndexView.prototype.on_failed_sort = function(data, status, xhr) {
      return $.growl('error', xhr.getResponseHeader('X-Message'));
    };

    return IndexView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentEntries || (_base.ContentEntries = {});

  Locomotive.Views.ContentEntries.NewView = (function(_super) {

    __extends(NewView, _super);

    function NewView() {
      return NewView.__super__.constructor.apply(this, arguments);
    }

    NewView.prototype.save = function(event) {
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          return window.location.href = xhr.getResponseHeader('location');
        }
      });
    };

    return NewView;

  })(Locomotive.Views.ContentEntries.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentTypes || (_base.ContentTypes = {});

  Locomotive.Views.ContentTypes.FormView = (function(_super) {

    __extends(FormView, _super);

    function FormView() {
      return FormView.__super__.constructor.apply(this, arguments);
    }

    FormView.prototype.el = '#content';

    FormView.prototype.events = {
      'submit': 'save'
    };

    FormView.prototype.initialize = function() {
      this.model = new Locomotive.Models.ContentType(this.options.content_type);
      return Backbone.ModelBinding.bind(this);
    };

    FormView.prototype.render = function() {
      FormView.__super__.render.call(this);
      this.render_custom_fields();
      this.slugify_name();
      this.enable_liquid_editing();
      this.enable_public_submission_checkbox();
      this.enable_order_by_toggler();
      return this;
    };

    FormView.prototype.render_custom_fields = function() {
      this.custom_fields_view = new Locomotive.Views.ContentTypes.CustomFieldsView({
        model: this.model,
        inverse_of_list: this.options.inverse_of_list
      });
      return this.$('#custom_fields_input').append(this.custom_fields_view.render().el);
    };

    FormView.prototype.slugify_name = function() {
      return this.$('#content_type_name').slugify({
        target: this.$('#content_type_slug'),
        sep: '_'
      });
    };

    FormView.prototype.enable_liquid_editing = function() {
      var input,
        _this = this;
      input = this.$('#content_type_raw_item_template');
      return this.editor = CodeMirror.fromTextArea(input.get()[0], {
        mode: 'liquid',
        autoMatchParens: false,
        lineNumbers: false,
        passDelay: 50,
        tabMode: 'shift',
        theme: 'default',
        onChange: function(editor) {
          return _this.model.set({
            raw_item_template: editor.getValue()
          });
        }
      });
    };

    FormView.prototype.after_inputs_fold = function() {
      return this.editor.refresh();
    };

    FormView.prototype.enable_public_submission_checkbox = function() {
      var _this = this;
      return this._enable_checkbox('public_submission_enabled', {
        on_callback: function() {
          return _this.$('#content_type_public_submission_accounts_input').show();
        },
        off_callback: function() {
          return _this.$('#content_type_public_submission_accounts_input').hide();
        }
      });
    };

    FormView.prototype.enable_order_by_toggler = function() {
      var _this = this;
      return this.$('#content_type_order_by_input').bind('change', function(event) {
        var target;
        target = _this.$('#content_type_order_direction_input');
        if ($(event.target).val() === '_position') {
          return target.hide();
        } else {
          return target.show();
        }
      });
    };

    FormView.prototype.show_error = function(attribute, message, html) {
      var _this = this;
      if (attribute !== 'entries_custom_fields') {
        return FormView.__super__.show_error.apply(this, arguments);
      } else {
        if (_.isEmpty(message)) {
          return;
        }
        return _.each(_.keys(message), function(key) {
          var view, _messages;
          _messages = message[key];
          if (key === 'base') {
            html = $("<div class=\"inline-errors\"><p>" + _messages[0] + "</p></div>");
            return _this.$('#custom_fields_input .list').after(html);
          } else {
            view = _this.custom_fields_view.find_entry_view(key);
            if (view != null) {
              return view.show_error(_messages[0]);
            }
          }
        });
      }
    };

    FormView.prototype.remove = function() {
      this.custom_fields_view.remove();
      return FormView.__super__.remove.apply(this, arguments);
    };

    return FormView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentTypes || (_base.ContentTypes = {});

  Locomotive.Views.ContentTypes.CustomFieldEntryView = (function(_super) {

    __extends(CustomFieldEntryView, _super);

    function CustomFieldEntryView() {
      return CustomFieldEntryView.__super__.constructor.apply(this, arguments);
    }

    CustomFieldEntryView.prototype.tagName = 'li';

    CustomFieldEntryView.prototype.className = 'custom-field';

    CustomFieldEntryView.prototype.events = {
      'click a.toggle': 'toggle',
      'click a.remove': 'remove'
    };

    CustomFieldEntryView.prototype.initialize = function() {
      var _this = this;
      this.inverse_of_list = this.options.parent_view.options.inverse_of_list;
      return this.model.bind('change', function(custom_field) {
        if (_this.model.hasChanged('type')) {
          _this.switch_to_type();
        }
        if (_this.model.hasChanged('class_name') && (_this.model.get('class_name') != null)) {
          return _this.fetch_inverse_of_list();
        }
      });
    };

    CustomFieldEntryView.prototype.render = function() {
      $(this.el).html(ich.custom_field_entry(this.model.toJSON()));
      if (!this.model.isNew()) {
        this.fetch_inverse_of_list();
      }
      Backbone.ModelBinding.bind(this, {
        all: 'class'
      });
      this.make_fields_editable();
      this.enable_behaviours();
      this.switch_to_type();
      return this;
    };

    CustomFieldEntryView.prototype.enable_behaviours = function() {
      var required_input;
      required_input = this.$('.required-input input[type=checkbox]');
      required_input.checkToggle({
        on_label: required_input.attr('data-on-label'),
        off_label: required_input.attr('data-off-label')
      });
      this.$('li.input.toggle input[type=checkbox]').checkToggle();
      return this.render_select_options_view();
    };

    CustomFieldEntryView.prototype.switch_to_type = function() {
      this.$('li.input.extra').hide();
      switch (this.model.get('type')) {
        case 'select':
          return this.$('li.input.select-options').show();
        case 'text':
          return this.$('li.input.text-formatting').show();
        case 'belongs_to':
          this.$('li.input.localized').hide();
          return this.$('li.input.class-name').show();
        case 'has_many':
        case 'many_to_many':
          this.$('li.input.localized').hide();
          this.$('li.input.class-name').show();
          this.$('li.input.inverse-of').show();
          return this.$('li.input.ui-enabled').show();
      }
    };

    CustomFieldEntryView.prototype.fetch_inverse_of_list = function() {
      var list,
        _this = this;
      this.$('li.input.inverse-of select option').remove();
      list = this.inverse_of_list[this.model.get('type')] || [];
      _.each(list, function(data) {
        var option;
        if (data.class_name === _this.model.get('class_name')) {
          option = new Option(data.label, data.name, data.name === _this.model.get('inverse_of') || list.length === 1);
          return _this.$('li.input.inverse-of select').append(option);
        }
      });
      if (!(this.model.get('inverse_of') != null) && list.length > 0) {
        return this.model.set({
          inverse_of: list[0].name
        });
      }
    };

    CustomFieldEntryView.prototype.render_select_options_view = function() {
      this.select_options_view = new Locomotive.Views.ContentTypes.SelectOptionsView({
        model: this.model,
        collection: this.model.get('select_options')
      });
      return this.$('#content_type_contents_custom_field_select_options_input').append(this.select_options_view.render().el);
    };

    CustomFieldEntryView.prototype.make_fields_editable = function() {
      return this.$('.label-input input[type=text], .type-input select').editableField();
    };

    CustomFieldEntryView.prototype.toggle = function(event) {
      var form;
      event.stopPropagation() & event.preventDefault();
      form = this.$('ol');
      if (form.is(':hidden')) {
        this.$('a.toggle').addClass('open');
        return form.slideDown();
      } else {
        this.$('a.toggle').removeClass('open');
        return form.slideUp();
      }
    };

    CustomFieldEntryView.prototype.show_error = function(message) {
      var html;
      html = $("<span class=\"inline-errors\">" + message + "</span>");
      return this.$('.required-input').after(html);
    };

    CustomFieldEntryView.prototype.remove = function(event) {
      event.stopPropagation() & event.preventDefault();
      if (confirm($(event.target).attr('data-confirm'))) {
        this.$('.label-input input[type=text], .type-input select').editableField('destroy');
        CustomFieldEntryView.__super__.remove.call(this);
        return this.options.parent_view.remove_entry(this.model, this);
      }
    };

    return CustomFieldEntryView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentTypes || (_base.ContentTypes = {});

  Locomotive.Views.ContentTypes.CustomFieldsView = (function(_super) {
    var _entry_views;

    __extends(CustomFieldsView, _super);

    function CustomFieldsView() {
      return CustomFieldsView.__super__.constructor.apply(this, arguments);
    }

    CustomFieldsView.prototype.tagName = 'div';

    CustomFieldsView.prototype.className = 'list';

    _entry_views = [];

    CustomFieldsView.prototype.events = {
      'click .new-entry a.add': 'add_entry',
      'keypress .new-entry input[type=text]': 'add_on_entry_from_enter'
    };

    CustomFieldsView.prototype.initialize = function() {
      return _.bindAll(this, 'refresh_position_entries');
    };

    CustomFieldsView.prototype.render = function() {
      $(this.el).html(ich.custom_fields_list(this.model.toJSON()));
      this.render_entries();
      this.make_list_sortable();
      return this;
    };

    CustomFieldsView.prototype.make_list_sortable = function() {
      return this.sortable_list = this.$('> ul').sortable({
        handle: '.handle',
        items: 'li.custom-field',
        axis: 'y',
        update: this.refresh_position_entries
      });
    };

    CustomFieldsView.prototype.refresh_position_entries = function() {
      return _.each(this._entry_views, function(view) {
        return view.model.set({
          position: $(view.el).index()
        });
      });
    };

    CustomFieldsView.prototype.find_entry_view = function(key) {
      return _.find(this._entry_views, function(view) {
        if (key.length > 3) {
          return view.model.id === key;
        } else {
          return view.model.get('position') === parseInt(key);
        }
      });
    };

    CustomFieldsView.prototype.add_entry = function(event) {
      var custom_field, labelInput, typeInput;
      event.stopPropagation() & event.preventDefault();
      labelInput = this.$('> .new-entry input[name=label]');
      typeInput = this.$('> .new-entry select');
      if (labelInput.val() !== '') {
        custom_field = new Locomotive.Models.CustomField({
          label: labelInput.val(),
          type: typeInput.val()
        });
        this.model.get('entries_custom_fields').add(custom_field);
        this._insert_entry(custom_field);
        this.$('> .empty').hide();
        this.sortable_list.sortable('refresh');
        return labelInput.val('');
      }
    };

    CustomFieldsView.prototype.add_on_entry_from_enter = function(event) {
      if (event.keyCode !== 13) {
        return;
      }
      return this.add_entry(event);
    };

    CustomFieldsView.prototype.remove_entry = function(custom_field, view) {
      if (custom_field.isNew()) {
        this.model.get('entries_custom_fields').remove(custom_field);
      } else {
        custom_field.set({
          _destroy: true
        });
      }
      this._entry_views = _.reject(this._entry_views, function(_view) {
        return _view === view;
      });
      this.refresh_position_entries();
      if (this._entry_views.length === 0) {
        return this.$('> .empty').show();
      }
    };

    CustomFieldsView.prototype.render_entries = function() {
      var _this = this;
      if (this.model.get('entries_custom_fields').length === 0) {
        return this.$('> .empty').show();
      } else {
        return this.model.get('entries_custom_fields').each(function(custom_field) {
          return _this._insert_entry(custom_field);
        });
      }
    };

    CustomFieldsView.prototype._insert_entry = function(custom_field) {
      var view;
      view = new Locomotive.Views.ContentTypes.CustomFieldEntryView({
        model: custom_field,
        parent_view: this
      });
      (this._entry_views || (this._entry_views = [])).push(view);
      this.$('> ul').append(view.render().el);
      return this.refresh_position_entries();
    };

    return CustomFieldsView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentTypes || (_base.ContentTypes = {});

  Locomotive.Views.ContentTypes.EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      return EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.save = function(event) {
      var _this = this;
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          return _.each(response.entries_custom_fields, function(data) {
            var custom_field;
            custom_field = _this.model.get('entries_custom_fields').detect(function(entry) {
              return entry.get('name') === data.name;
            });
            if (custom_field.isNew()) {
              return custom_field.set({
                id: data._id,
                _id: data._id
              });
            }
          });
        }
      });
    };

    return EditView;

  })(Locomotive.Views.ContentTypes.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentTypes || (_base.ContentTypes = {});

  Locomotive.Views.ContentTypes.NewView = (function(_super) {

    __extends(NewView, _super);

    function NewView() {
      return NewView.__super__.constructor.apply(this, arguments);
    }

    NewView.prototype.save = function(event) {
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          return window.location.href = xhr.getResponseHeader('location');
        }
      });
    };

    NewView.prototype.enable_liquid_editing = function() {
      return true;
    };

    return NewView;

  })(Locomotive.Views.ContentTypes.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ContentTypes || (_base.ContentTypes = {});

  Locomotive.Views.ContentTypes.SelectOptionsView = (function(_super) {

    __extends(SelectOptionsView, _super);

    function SelectOptionsView() {
      return SelectOptionsView.__super__.constructor.apply(this, arguments);
    }

    SelectOptionsView.prototype.tagName = 'div';

    SelectOptionsView.prototype.className = 'list';

    SelectOptionsView.prototype.events = {
      'click a.add': 'add_entry',
      'click span.name': 'edit_entry',
      'click a.remove': 'remove_entry',
      'click a.drag': 'do_nothing'
    };

    SelectOptionsView.prototype.initialize = function() {
      _.bindAll(this, 'refresh_position_entries', '_insert_entry');
      return this.collection.bind('add', this._insert_entry);
    };

    SelectOptionsView.prototype.render = function() {
      $(this.el).html(ich.select_options_list());
      this.prompt_message = this.$('> ul').attr('data-prompt');
      this.render_entries();
      this.make_list_sortable();
      return this;
    };

    SelectOptionsView.prototype.render_entries = function() {
      return this.collection.each(this._insert_entry);
    };

    SelectOptionsView.prototype.make_list_sortable = function() {
      return this.sortable_list = this.$('> ul').sortable({
        handle: 'a.drag',
        items: 'li.entry',
        update: this.refresh_position_entries
      });
    };

    SelectOptionsView.prototype.refresh_position_entries = function() {
      var _this = this;
      return this.$('> ul li.entry').each(function(index, view_dom) {
        var select_option;
        select_option = _this.collection.getByCid($(view_dom).attr('data-cid'));
        return select_option.set({
          position: index
        });
      });
    };

    SelectOptionsView.prototype.do_nothing = function(event) {
      return event.stopPropagation() & event.preventDefault();
    };

    SelectOptionsView.prototype.add_entry = function(event) {
      var name;
      event.stopPropagation() & event.preventDefault();
      name = prompt(this.prompt_message);
      if (name !== '') {
        return this.collection.add([
          {
            name: name
          }
        ]);
      }
    };

    SelectOptionsView.prototype.edit_entry = function(event) {
      var name, select_option, span, view_dom;
      event.stopPropagation() & event.preventDefault();
      span = $(event.target);
      view_dom = span.closest('li');
      select_option = this.collection.getByCid(view_dom.attr('data-cid'));
      if ((name = prompt(this.prompt_message, select_option.get('name'))) !== '') {
        select_option.set({
          name: name
        });
        return span.html(name);
      }
    };

    SelectOptionsView.prototype.remove_entry = function(event) {
      var link, select_option, view_dom;
      event.stopPropagation() & event.preventDefault();
      link = $(event.target);
      view_dom = link.closest('li');
      select_option = this.collection.getByCid(view_dom.attr('data-cid'));
      if (confirm(link.attr('data-confirm'))) {
        if (select_option.isNew()) {
          this.collection.remove(select_option);
        } else {
          select_option.set({
            _destroy: true
          });
        }
        return view_dom.remove();
      }
    };

    SelectOptionsView.prototype._insert_entry = function(select_option) {
      var view_dom;
      view_dom = ich.select_option_entry(select_option.toJSON());
      view_dom.attr('data-cid', select_option.cid);
      this.$('> ul').append(view_dom);
      return this.refresh_position_entries;
    };

    return SelectOptionsView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Sites || (_base.Sites = {});

  Locomotive.Views.Sites.DomainsView = (function(_super) {
    var _entry_views;

    __extends(DomainsView, _super);

    function DomainsView() {
      return DomainsView.__super__.constructor.apply(this, arguments);
    }

    DomainsView.prototype.tagName = 'div';

    DomainsView.prototype.className = 'list';

    _entry_views = [];

    DomainsView.prototype.events = {
      'click .new-entry a.add': 'add_entry',
      'keypress .new-entry input[type=text]': 'add_on_entry_from_enter'
    };

    DomainsView.prototype.render = function() {
      $(this.el).html(ich.domains_list(this.model.toJSON()));
      this.render_entries();
      this.enable_ui_effects();
      return this;
    };

    DomainsView.prototype.add_entry = function(event) {
      var domain, input;
      event.stopPropagation() & event.preventDefault();
      input = this.$('.new-entry input[name=domain]');
      if (input.val() !== '') {
        domain = new Locomotive.Models.Domain({
          name: input.val()
        });
        this.model.get('domains').push(domain);
        this._insert_entry(domain);
        this.$('ul li.domain:last input[type=text]').editableField();
        this.$('.empty').hide();
        return input.val('');
      }
    };

    DomainsView.prototype.add_on_entry_from_enter = function(event) {
      if (event.keyCode !== 13) {
        return;
      }
      return this.add_entry(event);
    };

    DomainsView.prototype.change_entry = function(domain, value) {
      return domain.set({
        name: value
      });
    };

    DomainsView.prototype.remove_entry = function(domain) {
      var list,
        _this = this;
      list = _.reject(this.model.get('domains'), function(_domain) {
        return _domain === domain;
      });
      this.model.set({
        domains: list
      });
      if (this.model.get('domains').length === 0) {
        return this.$('.empty').show();
      }
    };

    DomainsView.prototype.render_entries = function() {
      var _this = this;
      if (this.model.get('domains').length === 0) {
        return this.$('.empty').show();
      } else {
        _.each(this.model.get('domains'), function(domain) {
          return _this._insert_entry(domain);
        });
        return this.show_errors();
      }
    };

    DomainsView.prototype.show_errors = function() {
      var _this = this;
      return _.each(this.options.errors.domain || [], function(message) {
        return _this.show_error(message);
      });
    };

    DomainsView.prototype.show_error = function(message) {
      return _.each(this._entry_views || [], function(view) {
        var html;
        if (new RegExp("^" + (view.model.get('name'))).test(message)) {
          html = $('<span></span>').addClass('inline-errors').html(message);
          return view.$('input[type=text].path').after(html);
        }
      });
    };

    DomainsView.prototype.enable_ui_effects = function() {
      return this.$('.domain input[type=text]').editableField();
    };

    DomainsView.prototype._insert_entry = function(domain) {
      var view;
      view = new Locomotive.Views.Sites.DomainEntryView({
        model: domain,
        parent_view: this
      });
      (this._entry_views || (this._entry_views = [])).push(view);
      return this.$('ul').append(view.render().el);
    };

    return DomainsView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).CurrentSite || (_base.CurrentSite = {});

  Locomotive.Views.CurrentSite.EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      return EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.el = '#content';

    EditView.prototype.events = {
      'submit': 'save'
    };

    EditView.prototype.initialize = function() {
      this.model = new Locomotive.Models.CurrentSite(this.options.site);
      return Backbone.ModelBinding.bind(this, {
        checkbox: 'class'
      });
    };

    EditView.prototype.render = function() {
      EditView.__super__.render.call(this);
      this.add_toggle_mode_for_locales();
      this.make_locales_sortable();
      this.render_domains();
      this.render_memberships();
      return this.enable_liquid_editing();
    };

    EditView.prototype.add_toggle_mode_for_locales = function() {
      return this.$('#site_locales_input .list input[type=checkbox]').bind('change', function(event) {
        var el;
        el = $(event.target);
        if (el.is(':checked')) {
          return el.closest('.entry').addClass('selected');
        } else {
          return el.closest('.entry').removeClass('selected');
        }
      });
    };

    EditView.prototype.make_locales_sortable = function() {
      var _this = this;
      return this.sortable_locales_list = this.$('#site_locales_input .list').sortable({
        items: '.entry',
        tolerance: 'pointer',
        update: function() {
          var list;
          list = _.map(_this.$('#site_locales_input .list input:checked'), function(el) {
            return $(el).val();
          });
          return _this.model.set({
            locales: list
          });
        }
      });
    };

    EditView.prototype.render_domains = function() {
      this.domains_view = new Locomotive.Views.Sites.DomainsView({
        model: this.model,
        errors: this.options.errors
      });
      return this.$('#site_domains_input label').after(this.domains_view.render().el);
    };

    EditView.prototype.render_memberships = function() {
      this.memberships_view = new Locomotive.Views.Sites.MembershipsView({
        model: this.model
      });
      return this.$('#site_memberships_input').append(this.memberships_view.render().el);
    };

    EditView.prototype.enable_liquid_editing = function() {
      var input,
        _this = this;
      if (($('#site_robots_txt').length)) {
        input = this.$('#site_robots_txt');
        return this.editor = CodeMirror.fromTextArea(input.get()[0], {
          mode: 'liquid',
          autoMatchParens: false,
          lineNumbers: false,
          passDelay: 50,
          tabMode: 'shift',
          theme: 'default',
          onChange: function(editor) {
            return _this.model.set({
              robots_txt: editor.getValue()
            });
          }
        });
      }
    };

    EditView.prototype.save = function(event) {
      if (this.model.includes_domain(window.location.host)) {
        return this.save_in_ajax(event);
      }
    };

    EditView.prototype.show_error = function(attribute, message, html) {
      if (attribute === 'domains') {
        return this.domains_view.show_error(message);
      } else {
        return EditView.__super__.show_error.apply(this, arguments);
      }
    };

    EditView.prototype.after_inputs_fold = function() {
      return this.editor.refresh();
    };

    EditView.prototype.remove = function() {
      this.domains_view.remove();
      this.memberships_view.remove();
      return EditView.__super__.remove.apply(this, arguments);
    };

    return EditView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).EditableElements || (_base.EditableElements = {});

  Locomotive.Views.EditableElements.ControlView = (function(_super) {

    __extends(ControlView, _super);

    function ControlView() {
      return ControlView.__super__.constructor.apply(this, arguments);
    }

    ControlView.prototype.tagName = 'li';

    ControlView.prototype.className = 'control input';

    ControlView.prototype.render = function() {
      $(this.el).html(ich.editable_control_input(this.model.toJSON()));
      this.bind_model();
      return this;
    };

    ControlView.prototype.after_render = function() {};

    ControlView.prototype.refresh = function() {
      return this.bind_model();
    };

    ControlView.prototype.bind_model = function() {
      return Backbone.ModelBinding.bind(this, {
        select: 'class'
      });
    };

    return ControlView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).EditableElements || (_base.EditableElements = {});

  Locomotive.Views.EditableElements.EditAllView = (function(_super) {

    __extends(EditAllView, _super);

    function EditAllView() {
      return EditAllView.__super__.constructor.apply(this, arguments);
    }

    EditAllView.prototype.id = 'editable-elements';

    EditAllView.prototype.tagName = 'div';

    EditAllView.prototype._editable_elements_views = [];

    EditAllView.prototype.render = function() {
      window.bar = this;
      if (this.collection.isEmpty()) {
        $(this.el).hide();
      } else {
        this.blocks = this.collection.blocks();
        $(this.el).html(ich.editable_elements_edit({
          blocks: this.blocks
        }));
        this.render_elements();
        this.enable_nav();
      }
      return this;
    };

    EditAllView.prototype.after_render = function() {
      var _this = this;
      return _.each(this._editable_elements_views, function(view) {
        return view.after_render();
      });
    };

    EditAllView.prototype.refresh = function() {
      var _this = this;
      return _.each(this._editable_elements_views, function(view) {
        view.model = _this.collection.get(view.model.get('id'));
        return view.refresh();
      });
    };

    EditAllView.prototype.unbind_model = function() {
      var _this = this;
      return _.each(this._editable_elements_views, function(view) {
        return Backbone.ModelBinding.unbind(view);
      });
    };

    EditAllView.prototype.render_elements = function() {
      var index,
        _this = this;
      index = 0;
      return _.each(this.blocks, function(block) {
        var list;
        list = _this.collection.by_block(block.name);
        return _.each(list, function(element) {
          var view, view_class;
          element.set({
            index: index
          });
          view_class = (function() {
            switch (element.get('type')) {
              case 'EditableShortText':
                return Locomotive.Views.EditableElements.ShortTextView;
              case 'EditableLongText':
                return Locomotive.Views.EditableElements.LongTextView;
              case 'EditableFile':
                return Locomotive.Views.EditableElements.FileView;
              case 'EditableControl':
                return Locomotive.Views.EditableElements.ControlView;
            }
          })();
          view = new view_class({
            model: element
          });
          _this.$("#block-" + block.index + " > fieldset > ol").append(view.render().el);
          _this._editable_elements_views.push(view);
          return index += 1;
        });
      });
    };

    EditAllView.prototype.enable_nav = function() {
      var _this = this;
      return this.$('.nav a').click(function(event) {
        var index, link;
        event.stopPropagation() & event.preventDefault();
        link = $(event.target);
        index = parseInt(link.attr('href').match(/block-(.+)/)[1]);
        _this.$('.wrapper ul li.block').hide();
        _this.$("#block-" + index).show();
        _this._hide_last_separator();
        link.parent().find('.on').removeClass('on');
        return link.addClass('on');
      });
    };

    EditAllView.prototype._hide_last_separator = function() {
      var _this = this;
      return _.each(this.$('fieldset'), function(fieldset) {
        $(fieldset).find('li.last').removeClass('last');
        return $(_.last($(fieldset).find('li.input:visible'))).addClass('last');
      });
    };

    EditAllView.prototype.remove = function() {
      var _this = this;
      _.each(this._editable_elements_views, function(view) {
        return view.remove();
      });
      this._editable_elements_views.length = 0;
      return EditAllView.__super__.remove.apply(this, arguments);
    };

    return EditAllView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).EditableElements || (_base.EditableElements = {});

  Locomotive.Views.EditableElements.FileView = (function(_super) {

    __extends(FileView, _super);

    function FileView() {
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.prototype.tagName = 'li';

    FileView.prototype.className = 'file input';

    FileView.prototype.states = {
      change: false,
      "delete": false
    };

    FileView.prototype.events = {
      'click a.change': 'toggle_change',
      'click a.delete': 'toggle_delete'
    };

    FileView.prototype.render = function() {
      var _this = this;
      $(this.el).html(ich.editable_file_input(this.model.toJSON()));
      this.$('input[type=file]').bind('change', function(event) {
        var input;
        input = $(event.target)[0];
        if (input.files != null) {
          return _this.model.set({
            source: input.files[0]
          });
        }
      });
      return this;
    };

    FileView.prototype.after_render = function() {};

    FileView.prototype.refresh = function() {
      this.$('input[type=file]').unbind('change');
      this.states = {
        'change': false,
        'delete': false
      };
      return this.render();
    };

    FileView.prototype.toggle_change = function(event) {
      var _this = this;
      return this._toggle(event, 'change', {
        on_change: function() {
          return _this.$('a:first').hide() & _this.$('input[type=file]').show() & _this.$('a.delete').hide();
        },
        on_cancel: function() {
          _this.model.set({
            source: null
          });
          return _this.$('a:first').show() & _this.$('input[type=file]').val('').hide() & _this.$('a.delete').show();
        }
      });
    };

    FileView.prototype.toggle_delete = function(event) {
      var _this = this;
      return this._toggle(event, 'delete', {
        on_change: function() {
          _this.$('a:first').addClass('deleted') & _this.$('a.change').hide();
          _this.$('input[type=hidden].remove-flag').val('1');
          return _this.model.set({
            'remove_source': true
          });
        },
        on_cancel: function() {
          _this.$('a:first').removeClass('deleted') & _this.$('a.change').show();
          _this.$('input[type=hidden].remove-flag').val('0');
          return _this.model.set({
            'remove_source': false
          });
        }
      });
    };

    FileView.prototype._toggle = function(event, state, options) {
      var button, label;
      event.stopPropagation() & event.preventDefault();
      button = $(event.target);
      label = button.attr('data-alt-label');
      if (!this.states[state]) {
        options.on_change();
      } else {
        options.on_cancel();
      }
      button.attr('data-alt-label', button.html());
      button.html(label);
      return this.states[state] = !this.states[state];
    };

    FileView.prototype.remove = function() {
      this.$('input[type=file]').unbind('change');
      return FileView.__super__.remove.apply(this, arguments);
    };

    return FileView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).EditableElements || (_base.EditableElements = {});

  Locomotive.Views.EditableElements.ShortTextView = (function(_super) {

    __extends(ShortTextView, _super);

    function ShortTextView() {
      return ShortTextView.__super__.constructor.apply(this, arguments);
    }

    ShortTextView.prototype.tagName = 'li';

    ShortTextView.prototype.className = 'text input short';

    ShortTextView.prototype.render = function() {
      var _this = this;
      $(this.el).html(ich.editable_text_input(this.model.toJSON()));
      this.$('textarea').bind('keyup', function(event) {
        var input;
        input = $(event.target);
        return _this.model.set({
          content: input.val()
        });
      });
      return this;
    };

    ShortTextView.prototype.after_render = function() {};

    ShortTextView.prototype.refresh = function() {};

    return ShortTextView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).EditableElements || (_base.EditableElements = {});

  Locomotive.Views.EditableElements.LongTextView = (function(_super) {

    __extends(LongTextView, _super);

    function LongTextView() {
      return LongTextView.__super__.constructor.apply(this, arguments);
    }

    LongTextView.prototype.tagName = 'li';

    LongTextView.prototype.className = 'text input html';

    LongTextView.prototype.render = function() {
      $(this.el).html(ich.editable_text_input(this.model.toJSON()));
      return this;
    };

    LongTextView.prototype.after_render = function() {
      var settings,
        _this = this;
      settings = _.extend({}, this.tinymce_settings(), {
        oninit: (function(editor) {
          return $.cmd('S', (function() {
            _this.model.set({
              content: editor.getBody().innerHTML
            });
            return $(_this.el).parents('form').trigger('submit');
          }), [], {
            ignoreCase: true,
            document: editor.dom.doc
          });
        }),
        onchange_callback: function(editor) {
          return _this.model.set({
            content: editor.getBody().innerHTML
          });
        }
      });
      return this.$('textarea').tinymce(settings);
    };

    LongTextView.prototype.tinymce_settings = function() {
      return window.Locomotive.tinyMCE.defaultSettings;
    };

    LongTextView.prototype.refresh = function() {};

    LongTextView.prototype.remove = function() {
      this.$('textarea').tinymce().destroy();
      return LongTextView.__super__.remove.apply(this, arguments);
    };

    return LongTextView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).InlineEditor || (_base.InlineEditor = {});

  Locomotive.Views.InlineEditor.ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.el = 'body';

    ApplicationView.prototype.initialize = function() {
      ApplicationView.__super__.initialize.apply(this, arguments);
      this.iframe = this.$('#page iframe');
      _.bindAll(this, '_$');
      this.toolbar_view = new Locomotive.Views.InlineEditor.ToolbarView({
        target: this.iframe
      });
      return this.content_assets_picker_view = new Locomotive.Views.ContentAssets.PickerView({
        collection: new Locomotive.Models.ContentAssetsCollection()
      });
    };

    ApplicationView.prototype.render = function() {
      ApplicationView.__super__.render.apply(this, arguments);
      this.enable_iframe_autoheight();
      this.toolbar_view.render();
      return this.content_assets_picker_view.render();
    };

    ApplicationView.prototype.enable_iframe_autoheight = function() {
      var iframe,
        _this = this;
      iframe = this.iframe;
      return iframe.load(function() {
        var iframe_content;
        if (_this._$('meta[name=inline-editor]').size() > 0) {
          iframe_content = iframe.contents();
          iframe_content.resize(function() {
            var elem;
            elem = $(this);
            if (elem.outerHeight(true) > iframe.outerHeight(true)) {
              return iframe.css({
                height: elem.outerHeight(true)
              });
            }
          });
          return iframe_content.resize();
        } else {
          _this.toolbar_view.show_status('disabled', true).hide_editing_mode_block();
          return _this.enhance_iframe_links();
        }
      });
    };

    ApplicationView.prototype.set_page = function(attributes) {
      this.page = new Locomotive.Models.Page(attributes);
      this.toolbar_view.model = this.page;
      this.enhance_iframe();
      return this.toolbar_view.refresh();
    };

    ApplicationView.prototype.enhance_iframe = function() {
      var _window,
        _this = this;
      _window = this.iframe[0].contentWindow;
      _window.Aloha.settings.locale = window.locale;
      window.document.title = _window.document.title;
      this.enhance_iframe_links(_window.Aloha.jQuery);
      return _window.Aloha.bind('aloha-editable-deactivated', function(event, editable) {
        return _this.toolbar_view.notify(editable.editable);
      });
    };

    ApplicationView.prototype.enhance_iframe_links = function(_jQuery) {
      var toolbar_view;
      toolbar_view = this.toolbar_view;
      _jQuery || (_jQuery = this._$);
      return _jQuery('a').each(function() {
        var link, url;
        link = _jQuery(this);
        url = link.attr('href');
        if ((url != null) && url.indexOf('#') !== 0 && /^(www|http)/.exec(url) === null && /(\/_edit)$/.exec(url) === null && /^\/sites\//.exec(url) === null) {
          if (url === '/') {
            url = '/index';
          }
          if (!(url.indexOf('_edit') > 0)) {
            if (url.indexOf('?') > 0) {
              link.attr('href', url.replace('?', '/_edit?'));
            } else {
              link.attr('href', "" + url + "/_edit");
            }
          }
          return link.bind('click', function() {
            toolbar_view.show_status('loading');
            return window.history.pushState('Object', 'Title', link.attr('href').replace('_edit', '_admin'));
          });
        }
      });
    };

    ApplicationView.prototype.unique_dialog_zindex = function() {
      var _base1;
      (_base1 = window.Locomotive).jQueryModals || (_base1.jQueryModals = 0);
      return 1050 + window.Locomotive.jQueryModals++;
    };

    ApplicationView.prototype._$ = function(selector) {
      return $(selector, this.iframe[0].contentWindow.document);
    };

    return ApplicationView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).InlineEditor || (_base.InlineEditor = {});

  Locomotive.Views.InlineEditor.ToolbarView = (function(_super) {

    __extends(ToolbarView, _super);

    function ToolbarView() {
      return ToolbarView.__super__.constructor.apply(this, arguments);
    }

    ToolbarView.prototype.el = '#toolbar .inner';

    ToolbarView.prototype.events = {
      'change .editing-mode input[type=checkbox]': 'toggle_editing_mode',
      'click  .back a': 'back',
      'click  .element-actions a.save': 'save_changes',
      'click  .element-actions a.cancel': 'cancel_changes'
    };

    ToolbarView.prototype.render = function() {
      ToolbarView.__super__.render.apply(this, arguments);
      this.enable_editing_mode_checkbox();
      this.enable_content_locale_picker();
      return this;
    };

    ToolbarView.prototype.notify = function(aloha_editable) {
      var element_id;
      element_id = aloha_editable.obj.attr('data-element-id');
      this.model.get('editable_elements').get(element_id).set({
        content: aloha_editable.getContents()
      });
      this.$('.element-actions').show();
      return this.hide_editing_mode_block();
    };

    ToolbarView.prototype.show_status = function(status, growl) {
      var message;
      growl || (growl = false);
      message = this.$('h1').attr("data-" + status + "-status");
      this.$('h1').html(message).removeClass().addClass(status);
      if (growl) {
        $.growl('error', message);
      }
      return this;
    };

    ToolbarView.prototype.save_changes = function(event) {
      var previous_attributes,
        _this = this;
      event.stopPropagation() & event.preventDefault();
      previous_attributes = _.clone(this.model.attributes);
      return this.model.save({}, {
        success: function(model, response, xhr) {
          model.attributes = previous_attributes;
          _this.$('.element-actions').hide();
          return _this.show_editing_mode_block();
        },
        error: function(model, xhr) {
          return _this.$('.element-actions').hide();
        }
      });
    };

    ToolbarView.prototype.cancel_changes = function(event) {
      event.stopPropagation() & event.preventDefault();
      return this.options.target[0].contentWindow.location.href = this.options.target[0].contentWindow.location.href;
    };

    ToolbarView.prototype.back = function(event) {
      event.stopPropagation() & event.preventDefault();
      if (this.model) {
        return window.location.href = this.model.get('edit_url');
      } else {
        return window.location.href = window.Locomotive.mounted_on + '/pages';
      }
    };

    ToolbarView.prototype.show_editing_mode_block = function() {
      return this.$('.editing-mode').show();
    };

    ToolbarView.prototype.hide_editing_mode_block = function() {
      return this.$('.editing-mode').hide();
    };

    ToolbarView.prototype.toggle_editing_mode = function(event) {
      if (this.editable_elements() === null) {
        return;
      }
      if ($(event.target).is(':checked')) {
        return this.editable_elements().aloha();
      } else {
        return this.editable_elements().removeClass('aloha-editable-highlight').mahalo();
      }
    };

    ToolbarView.prototype.editable_elements = function() {
      if (this.options.target[0].contentWindow.Aloha) {
        return this.options.target[0].contentWindow.Aloha.jQuery('.editable-long-text, .editable-short-text');
      } else {
        return null;
      }
    };

    ToolbarView.prototype.enable_editing_mode_checkbox = function() {
      return this.$('.editing-mode input[type=checkbox]').checkToggle({
        on_label_color: '#fff',
        off_label_color: '#bbb'
      });
    };

    ToolbarView.prototype.enable_content_locale_picker = function() {
      var link, picker, _window,
        _this = this;
      _window = this.options.target[0].contentWindow;
      link = this.$('#content-locale-picker-link');
      picker = $('#content-locale-picker');
      if (picker.size() === 0) {
        return;
      }
      link.bind('click', function(event) {
        event.stopPropagation() & event.preventDefault();
        return picker.toggle();
      });
      return picker.find('li').bind('click', function(event) {
        var current, selected;
        current = _this.get_locale_attributes(link);
        selected = _this.get_locale_attributes($(event.target).closest('li'));
        _this.set_locale_attributes(link, selected);
        _this.set_locale_attributes($(event.target).closest('li'), current);
        picker.toggle();
        window.content_locale = selected[1];
        return _window.location.href = '/' + _this.model.get('localized_fullpaths')[selected[1]] + '/_edit';
      });
    };

    ToolbarView.prototype.get_locale_attributes = function(context) {
      return [context.find('img').attr('src'), context.find('span.text').html()];
    };

    ToolbarView.prototype.set_locale_attributes = function(context, values) {
      context.find('img').attr('src', values[0]);
      return context.find('span.text').html(values[1]);
    };

    ToolbarView.prototype.refresh = function() {
      this.$('h1').html(this.model.get('title')).removeClass();
      if (this.$('.editing-mode input[type=checkbox]').is(':checked')) {
        this.$('.editing-mode div.switchArea').trigger('click');
      }
      this.$('.element-actions').hide();
      return this.show_editing_mode_block();
    };

    return ToolbarView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).MyAccount || (_base.MyAccount = {});

  Locomotive.Views.MyAccount.EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      return EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.el = '#content';

    EditView.prototype.events = {
      'submit': 'save'
    };

    EditView.prototype.initialize = function() {
      this.model = new Locomotive.Models.CurrentAccount(this.options.account);
      return Backbone.ModelBinding.bind(this);
    };

    EditView.prototype.render = function() {
      return EditView.__super__.render.call(this);
    };

    EditView.prototype.save = function(event) {
      if (this.model.get('locale') === window.locale) {
        return this.save_in_ajax(event);
      }
    };

    return EditView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Pages || (_base.Pages = {});

  Locomotive.Views.Pages.FormView = (function(_super) {

    __extends(FormView, _super);

    function FormView() {
      return FormView.__super__.constructor.apply(this, arguments);
    }

    FormView.prototype.el = '#content';

    FormView.prototype.events = {
      'change   #page_parent_id': 'change_page_url',
      'click    a#image-picker-link': 'open_image_picker',
      'submit': 'save'
    };

    FormView.prototype.initialize = function() {
      _.bindAll(this, 'insert_image');
      this.model = new Locomotive.Models.Page(this.options.page);
      this.touched_url = false;
      this.image_picker_view = new Locomotive.Views.ThemeAssets.ImagePickerView({
        collection: new Locomotive.Models.ThemeAssetsCollection(),
        on_select: this.insert_image
      });
      this.image_picker_view.render();
      Backbone.ModelBinding.bind(this);
      return this.editable_elements_view = new Locomotive.Views.EditableElements.EditAllView({
        collection: this.model.get('editable_elements')
      });
    };

    FormView.prototype.render = function() {
      FormView.__super__.render.call(this);
      this.slugify_title();
      this.listen_for_url_changes();
      this.enable_response_type_select();
      this.enable_templatized_checkbox();
      this.enable_redirect_checkbox();
      this.enable_other_checkboxes();
      this.enable_liquid_editing();
      this.render_editable_elements();
      return this;
    };

    FormView.prototype.open_image_picker = function(event) {
      event.stopPropagation() & event.preventDefault();
      this.image_picker_view.editor = this.editor;
      return this.image_picker_view.fetch_assets();
    };

    FormView.prototype.insert_image = function(path) {
      var text;
      text = "{{ '" + path + "' | theme_image_url }}";
      this.editor.replaceSelection(text);
      return this.image_picker_view.close();
    };

    FormView.prototype.enable_liquid_editing = function() {
      var input,
        _this = this;
      input = this.$('#page_raw_template');
      if (input.size() > 0) {
        return this.editor = CodeMirror.fromTextArea(input.get()[0], {
          mode: 'liquid',
          autoMatchParens: false,
          lineNumbers: false,
          passDelay: 50,
          tabMode: 'shift',
          theme: 'default',
          onChange: function(editor) {
            return _this.model.set({
              raw_template: editor.getValue()
            });
          }
        });
      }
    };

    FormView.prototype.after_inputs_fold = function() {
      return this.editor.refresh();
    };

    FormView.prototype.render_editable_elements = function() {
      this.$('.formtastic fieldset.inputs:first').before(this.editable_elements_view.render().el);
      return this.editable_elements_view.after_render();
    };

    FormView.prototype.reset_editable_elements = function() {
      this.editable_elements_view.remove();
      this.editable_elements_view.collection = this.model.get('editable_elements');
      return this.render_editable_elements();
    };

    FormView.prototype.refresh_editable_elements = function() {
      this.editable_elements_view.unbind_model();
      this.editable_elements_view.collection = this.model.get('editable_elements');
      return this.editable_elements_view.refresh();
    };

    FormView.prototype.slugify_title = function() {
      var _this = this;
      this.$('#page_title').slugify({
        target: this.$('#page_slug')
      });
      return this.$('#page_slug').bind('change', (function(event) {
        return _this.touched_url = true;
      }));
    };

    FormView.prototype.listen_for_url_changes = function() {
      var _this = this;
      return setInterval((function() {
        if (_this.touched_url) {
          return _this.change_page_url() & (_this.touched_url = false);
        }
      }), 2000);
    };

    FormView.prototype.change_page_url = function() {
      var _this = this;
      return $.rails.ajax({
        url: this.$('#page_slug').attr('data-url'),
        type: 'get',
        dataType: 'json',
        data: {
          parent_id: this.$('#page_parent_id').val(),
          slug: this.$('#page_slug').val()
        },
        success: function(data) {
          _this.$('#page_slug_input .inline-hints').html(data.url).effect('highlight');
          if (data.templatized_parent) {
            _this.$('li#page_slug_input').show();
            return _this.$('li#page_templatized_input, li#page_target_klass_name_input').hide();
          } else {
            if (!_this.model.get('redirect')) {
              return _this.$('li#page_templatized_input').show();
            }
          }
        }
      });
    };

    FormView.prototype.enable_response_type_select = function() {
      var _this = this;
      return this.$('li#page_response_type_input').change(function(event) {
        if ($(event.target).val() === 'text/html') {
          return _this.$('li#page_redirect_input, li#page_redirect_url_input').show();
        } else {
          _this.model.set({
            redirect: false
          });
          return _this.$('li#page_redirect_input, li#page_redirect_url_input').hide();
        }
      });
    };

    FormView.prototype.enable_templatized_checkbox = function() {
      var _this = this;
      this._enable_checkbox('templatized', {
        features: ['slug', 'redirect', 'listed'],
        on_callback: function() {
          return _this.$('li#page_target_klass_name_input').show();
        },
        off_callback: function() {
          return _this.$('li#page_target_klass_name_input').hide();
        }
      });
      if (this.model.get('templatized_from_parent') === true) {
        return this.$('li#page_templatized_input').hide();
      }
    };

    FormView.prototype.enable_redirect_checkbox = function() {
      var _this = this;
      return this._enable_checkbox('redirect', {
        features: ['templatized', 'cache_strategy'],
        on_callback: function() {
          return _this.$('li#page_redirect_url_input').show();
        },
        off_callback: function() {
          return _this.$('li#page_redirect_url_input').hide();
        }
      });
    };

    FormView.prototype.enable_other_checkboxes = function() {
      var _this = this;
      return _.each(['published', 'listed'], function(exp) {
        return _this.$('li#page_' + exp + '_input input[type=checkbox]').checkToggle();
      });
    };

    return FormView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Pages || (_base.Pages = {});

  Locomotive.Views.Pages.EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      return EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.save = function(event) {
      var form,
        _this = this;
      event.stopPropagation() & event.preventDefault();
      form = $(event.target).trigger('ajax:beforeSend');
      this.clear_errors();
      return this.model.save({}, {
        success: function(model, response, xhr) {
          form.trigger('ajax:complete');
          model._normalize();
          if (model.get('template_changed') === true) {
            _this.reset_editable_elements();
          } else {
            _this.refresh_editable_elements();
          }
          return _this.$('#local-actions-bar > a.show').attr('href', "/" + (_this.model.get('fullpath')));
        },
        error: function(model, xhr) {
          var errors;
          form.trigger('ajax:complete');
          errors = JSON.parse(xhr.responseText);
          return _this.show_errors(errors);
        }
      });
    };

    return EditView;

  })(Locomotive.Views.Pages.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Pages || (_base.Pages = {});

  Locomotive.Views.Pages.IndexView = (function(_super) {

    __extends(IndexView, _super);

    function IndexView() {
      return IndexView.__super__.constructor.apply(this, arguments);
    }

    IndexView.prototype.el = '#content';

    IndexView.prototype.render = function() {
      this.index_view = new Locomotive.Views.Pages.ListView();
      this.index_view.render();
      return this;
    };

    return IndexView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Pages || (_base.Pages = {});

  Locomotive.Views.Pages.ListView = (function(_super) {

    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.el = '#pages-list';

    ListView.prototype.render = function() {
      this.make_foldable();
      this.make_sortable();
      return this;
    };

    ListView.prototype.make_foldable = function() {
      return this.$('ul.folder img.toggler').toggleMe();
    };

    ListView.prototype.make_sortable = function() {
      var self;
      self = this;
      return this.$('ul.folder').sortable({
        handle: 'em',
        axis: 'y',
        update: function(event, ui) {
          return self.call_sort($(this));
        }
      });
    };

    ListView.prototype.call_sort = function(folder) {
      return $.rails.ajax({
        url: folder.attr('data-url'),
        type: 'post',
        dataType: 'json',
        data: {
          children: _.map(folder.sortable('toArray'), function(el) {
            return el.replace('item-', '');
          }),
          _method: 'put'
        },
        success: this.on_successful_sort,
        error: this.on_failed_sort
      });
    };

    ListView.prototype.on_successful_sort = function(data, status, xhr) {
      return $.growl('success', xhr.getResponseHeader('X-Message'));
    };

    ListView.prototype.on_failed_sort = function(data, status, xhr) {
      return $.growl('error', xhr.getResponseHeader('X-Message'));
    };

    return ListView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Pages || (_base.Pages = {});

  Locomotive.Views.Pages.NewView = (function(_super) {

    __extends(NewView, _super);

    function NewView() {
      return NewView.__super__.constructor.apply(this, arguments);
    }

    NewView.prototype.save = function(event) {
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          return window.location.href = xhr.getResponseHeader('location');
        }
      });
    };

    return NewView;

  })(Locomotive.Views.Pages.FormView);

}).call(this);
(function() {
  var _base, _base1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  (_base1 = Locomotive.Views.Shared).Fields || (_base1.Fields = {});

  Locomotive.Views.Shared.Fields.FileView = (function(_super) {

    __extends(FileView, _super);

    function FileView() {
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.prototype.tagName = 'span';

    FileView.prototype.className = 'file';

    FileView.prototype.states = {
      change: false,
      "delete": false
    };

    FileView.prototype.events = {
      'click a.change': 'toggle_change',
      'click a.delete': 'toggle_delete'
    };

    FileView.prototype.template = function() {
      return ich["" + this.options.name + "_file_input"];
    };

    FileView.prototype.render = function() {
      var data, url,
        _this = this;
      url = this.model.get("" + this.options.name + "_url") || '';
      data = {
        filename: url.split('/').pop(),
        url: url
      };
      $(this.el).html(this.template()(data));
      this.$('input[type=file]').bind('change', function(event) {
        var hash, input, name;
        input = $(event.target)[0];
        if (input.files != null) {
          name = $(input).attr('name');
          hash = {};
          hash[name.replace("" + _this.model.paramRoot + "[", '').replace(/]$/, '')] = input.files[0];
          return _this.model.set(hash);
        }
      });
      return this;
    };

    FileView.prototype.refresh = function() {
      this.$('input[type=file]').unbind('change');
      this.states = {
        'change': false,
        'delete': false
      };
      return this.render();
    };

    FileView.prototype.reset = function() {
      this.model.set_attribute(this.options.name, null);
      this.model.set_attribute("" + this.options.name + "_url", null);
      return this.refresh();
    };

    FileView.prototype.toggle_change = function(event) {
      var _this = this;
      return this._toggle(event, 'change', {
        on_change: function() {
          return _this.$('a:first').hide() & _this.$('input[type=file]').show() & _this.$('a.delete').hide();
        },
        on_cancel: function() {
          return _this.$('a:first').show() & _this.$('input[type=file]').hide() & _this.$('a.delete').show();
        }
      });
    };

    FileView.prototype.toggle_delete = function(event) {
      var _this = this;
      return this._toggle(event, 'delete', {
        on_change: function() {
          _this.$('a:first').addClass('deleted') & _this.$('a.change').hide();
          _this.$('input[type=hidden].remove-flag').val('1');
          return _this.model.set_attribute("remove_" + _this.options.name, true);
        },
        on_cancel: function() {
          _this.$('a:first').removeClass('deleted') & _this.$('a.change').show();
          _this.$('input[type=hidden].remove-flag').val('0');
          return _this.model.set_attribute("remove_" + _this.options.name, false);
        }
      });
    };

    FileView.prototype._toggle = function(event, state, options) {
      var button, label;
      event.stopPropagation() & event.preventDefault();
      button = $(event.target);
      label = button.attr('data-alt-label');
      if (!this.states[state]) {
        options.on_change();
      } else {
        options.on_cancel();
      }
      button.attr('data-alt-label', button.html());
      button.html(label);
      return this.states[state] = !this.states[state];
    };

    FileView.prototype.remove = function() {
      this.$('input[type=file]').unbind('change');
      return FileView.__super__.remove.apply(this, arguments);
    };

    return FileView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base, _base1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  (_base1 = Locomotive.Views.Shared).Fields || (_base1.Fields = {});

  Locomotive.Views.Shared.Fields.HasManyView = (function(_super) {

    __extends(HasManyView, _super);

    function HasManyView() {
      this.get_entry_from_element = __bind(this.get_entry_from_element, this);
      return HasManyView.__super__.constructor.apply(this, arguments);
    }

    HasManyView.prototype.tagName = 'div';

    HasManyView.prototype.className = 'list';

    HasManyView.prototype.events = {
      'click p.actions a.add': 'open_new_entry_view',
      'click ul span.actions a.edit': 'edit_entry',
      'click ul span.actions a.remove': 'remove_entry'
    };

    HasManyView.prototype.template = function() {
      return ich["" + this.options.name + "_list"];
    };

    HasManyView.prototype.entry_template = function() {
      return ich["" + this.options.name + "_entry"];
    };

    HasManyView.prototype.initialize = function() {
      _.bindAll(this, 'refresh_position_entries');
      this.collection = this.model.get(this.options.name);
      return this.build_target_entry_view();
    };

    HasManyView.prototype.render = function() {
      $(this.el).html(this.template()());
      this.insert_entries();
      this.make_entries_sortable();
      return this;
    };

    HasManyView.prototype.ui_enabled = function() {
      return this.template() != null;
    };

    HasManyView.prototype.insert_entries = function() {
      var _this = this;
      if (this.collection.length > 0) {
        return this.collection.each(function(entry) {
          return _this.insert_entry(entry);
        });
      } else {
        return this.$('.empty').show();
      }
    };

    HasManyView.prototype.insert_entry = function(entry) {
      var entry_html;
      if (this.collection.get(entry.get('_id')) == null) {
        this.collection.add(entry);
      }
      this.$('.empty').hide();
      entry_html = $(this.entry_template()({
        label: entry.get('_label')
      }));
      entry_html.data('data-entry-id', entry.id);
      return this.$('> ul').append(entry_html);
    };

    HasManyView.prototype.make_entries_sortable = function() {
      return this.sortable_list = this.$('> ul').sortable({
        handle: '.handle',
        items: 'li',
        axis: 'y',
        update: this.refresh_position_entries
      });
    };

    HasManyView.prototype.refresh_position_entries = function() {
      var _this = this;
      return this.$('> ul > li').each(function(index, entry_html) {
        var entry, id;
        id = $(entry_html).data('data-entry-id');
        entry = _this.collection.get(id);
        return entry.set_attribute("position_in_" + _this.options.inverse_of, index);
      });
    };

    HasManyView.prototype.build_target_entry_view = function() {
      this.target_entry_view = new Locomotive.Views.ContentEntries.PopupFormView({
        el: $("#" + this.options.name + "-template-entry"),
        parent_view: this,
        model: this.options.new_entry.clone()
      });
      return this.target_entry_view.render();
    };

    HasManyView.prototype.edit_entry = function(event) {
      var entry;
      event.stopPropagation() & event.preventDefault();
      entry = this.get_entry_from_element($(event.target));
      this.target_entry_view.reset(entry);
      return this.target_entry_view.open();
    };

    HasManyView.prototype.update_entry = function(entry) {
      var entry_html, new_entry_html;
      entry_html = $(_.detect(this.$('> ul > li'), function(_entry_html) {
        return $(_entry_html).data('data-entry-id') === entry.id;
      }));
      this.collection.get(entry.id).set(entry.attributes);
      new_entry_html = $(this.entry_template()({
        label: entry.get('_label')
      }));
      new_entry_html.data('data-entry-id', entry.id);
      return entry_html.replaceWith(new_entry_html);
    };

    HasManyView.prototype.insert_or_update_entry = function(entry) {
      if (this.collection.get(entry.id) != null) {
        return this.update_entry(entry);
      } else {
        return this.insert_entry(entry);
      }
    };

    HasManyView.prototype.remove_entry = function(event) {
      var entry;
      event.stopPropagation() & event.preventDefault();
      if (confirm($(event.target).attr('data-confirm'))) {
        entry = this.get_entry_from_element($(event.target));
        entry.set({
          _destroy: true
        });
        $(event.target).closest('li').remove();
        if (this.$('> ul > li').size() === 0) {
          this.$('.empty').show();
        }
        return this.refresh_position_entries();
      }
    };

    HasManyView.prototype.open_new_entry_view = function(event) {
      event.stopPropagation() & event.preventDefault();
      this.target_entry_view.reset(this.options.new_entry.clone());
      return this.target_entry_view.open();
    };

    HasManyView.prototype.get_entry_from_element = function(element) {
      var entry_html, id;
      entry_html = $(element).closest('li');
      id = $(entry_html).data('data-entry-id');
      return this.collection.get(id);
    };

    return HasManyView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base, _base1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  (_base1 = Locomotive.Views.Shared).Fields || (_base1.Fields = {});

  Locomotive.Views.Shared.Fields.ManyToManyView = (function(_super) {

    __extends(ManyToManyView, _super);

    function ManyToManyView() {
      return ManyToManyView.__super__.constructor.apply(this, arguments);
    }

    ManyToManyView.prototype.tagName = 'div';

    ManyToManyView.prototype.className = 'list';

    ManyToManyView.prototype.events = {
      'click .new-entry a.add': 'add_entry',
      'keypress .new-entry select': 'add_entry',
      'click ul span.actions a.remove': 'remove_entry'
    };

    ManyToManyView.prototype.template = function() {
      return ich["" + this.options.name + "_list"];
    };

    ManyToManyView.prototype.entry_template = function() {
      return ich["" + this.options.name + "_entry"];
    };

    ManyToManyView.prototype.initialize = function() {
      _.bindAll(this, 'refresh_position_entries');
      this.collection = this.model.get(this.options.name);
      return this.all_entries = this.options.all_entries;
    };

    ManyToManyView.prototype.render = function() {
      $(this.el).html(this.template()());
      this.insert_entries();
      this.make_entries_sortable();
      this.refresh_select_field();
      return this;
    };

    ManyToManyView.prototype.ui_enabled = function() {
      return this.template() != null;
    };

    ManyToManyView.prototype.insert_entries = function() {
      var _this = this;
      if (this.collection.length > 0) {
        return this.collection.each(function(entry) {
          return _this.insert_entry(entry);
        });
      } else {
        return this.$('.empty').show();
      }
    };

    ManyToManyView.prototype.insert_entry = function(entry) {
      var entry_html;
      if (this.collection.get(entry.get('_id')) == null) {
        this.collection.add(entry);
      }
      this.$('.empty').hide();
      entry_html = $(this.entry_template()({
        label: entry.get('_label')
      }));
      entry_html.data('data-entry-id', entry.id);
      return this.$('> ul').append(entry_html);
    };

    ManyToManyView.prototype.make_entries_sortable = function() {
      return this.sortable_list = this.$('> ul').sortable({
        handle: '.handle',
        items: 'li',
        axis: 'y',
        update: this.refresh_position_entries
      });
    };

    ManyToManyView.prototype.refresh_position_entries = function() {
      var _this = this;
      return this.$('> ul > li').each(function(index, entry_html) {
        var entry, id;
        id = $(entry_html).data('data-entry-id');
        entry = _this.collection.get(id);
        return entry.set_attribute("__position", index);
      });
    };

    ManyToManyView.prototype.add_entry = function(event) {
      var entry, entry_id;
      event.stopPropagation() & event.preventDefault();
      entry_id = this.$('.new-entry select').val();
      entry = this.get_entry_from_id(entry_id);
      if (entry == null) {
        return;
      }
      this.insert_entry(entry);
      return this.refresh_select_field();
    };

    ManyToManyView.prototype.remove_entry = function(event) {
      var entry;
      event.stopPropagation() & event.preventDefault();
      if (confirm($(event.target).attr('data-confirm'))) {
        entry = this.get_entry_from_element($(event.target));
        this.collection.remove(entry);
        $(event.target).closest('li').remove();
        if (this.$('> ul > li').size() === 0) {
          this.$('.empty').show();
        }
        return this.refresh_position_entries() & this.refresh_select_field();
      }
    };

    ManyToManyView.prototype.refresh_select_field = function() {
      var _this = this;
      this.$('.new-entry select optgroup, .new-entry select option').remove();
      return _.each(this.all_entries, function(entry_or_group) {
        var group_html, option;
        if (_.isArray(entry_or_group.entries)) {
          group_html = $('<optgroup/>').attr('label', entry_or_group.name);
          _.each(entry_or_group.entries, function(entry) {
            var option;
            if (_this.collection.get(entry._id) == null) {
              option = new Option(entry._label, entry._id, false);
              return group_html.append(option);
            }
          });
          return _this.$('.new-entry select').append(group_html);
        } else {
          if (_this.collection.get(entry_or_group._id) == null) {
            option = new Option(entry_or_group._label, entry_or_group._id, false);
            return _this.$('.new-entry select').append(option);
          }
        }
      });
    };

    ManyToManyView.prototype.get_entry_from_element = function(element) {
      var entry_html, id;
      entry_html = $(element).closest('li');
      id = $(entry_html).data('data-entry-id');
      return this.collection.get(id);
    };

    ManyToManyView.prototype.get_entry_from_id = function(id) {
      var entry,
        _this = this;
      entry = null;
      _.each(this.all_entries, function(entry_or_group) {
        if (_.isArray(entry_or_group.entries)) {
          return entry || (entry = _.detect(entry_or_group.entries, function(_entry) {
            return _entry._id === id;
          }));
        } else {
          if (entry_or_group._id === id) {
            return entry = entry_or_group;
          }
        }
      });
      if (entry != null) {
        return new Locomotive.Models.ContentEntry(entry);
      } else {
        return null;
      }
    };

    return ManyToManyView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base, _base1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  (_base1 = Locomotive.Views.Shared).Fields || (_base1.Fields = {});

  Locomotive.Views.Shared.Fields.SelectView = (function(_super) {

    __extends(SelectView, _super);

    function SelectView() {
      this.on_save = __bind(this.on_save, this);
      return SelectView.__super__.constructor.apply(this, arguments);
    }

    SelectView.prototype.el = '#edit-select-option-entries';

    SelectView.prototype.select_options_view = null;

    SelectView.prototype.initialize = function() {
      _.bindAll(this, 'save', 'on_save');
      this.create_dialog();
      return SelectView.__super__.initialize.call(this);
    };

    SelectView.prototype.render = function() {
      this.render_select_options_view();
      return this.open();
    };

    SelectView.prototype.render_for = function(name, callback) {
      var _this = this;
      this.name = name;
      this.on_save_callback = callback;
      this.custom_field = this.model.get('entries_custom_fields').find(function(field) {
        return field.get('name') === _this.name;
      });
      return this.render();
    };

    SelectView.prototype.create_dialog = function() {
      var _this = this;
      return this.dialog = $(this.el).dialog({
        autoOpen: false,
        modal: true,
        zIndex: window.application_view.unique_dialog_zindex(),
        width: 770,
        create: function(event, ui) {
          $(_this.el).prev().find('.ui-dialog-title').html(_this.$('h2').html());
          _this.$('h2').remove();
          _this.$form = _this.$('.placeholder').formSubmitNotification();
          _this.$buttons_pane = _this.$('.dialog-actions').appendTo($(_this.el).parent()).addClass('ui-dialog-buttonpane ui-widget-content ui-helper-clearfix');
          _this.$buttons_pane.find('#close-link').click(function(event) {
            return _this.close(event);
          });
          return _this.$buttons_pane.find('input[type=submit]').click(_this.save);
        },
        open: function(event, ui, extra) {
          return $(_this.el).dialog('overlayEl').bind('click', function() {
            return _this.close();
          });
        }
      });
    };

    SelectView.prototype.save = function(event) {
      event.stopPropagation() & event.preventDefault();
      this.$form.trigger('ajax:beforeSend');
      $.rails.disableFormElements(this.$buttons_pane);
      return this.model.save({}, {
        success: this.on_save,
        error: this.on_save
      });
    };

    SelectView.prototype.on_save = function(model, response, xhr) {
      $.rails.enableFormElements(this.$buttons_pane);
      model._normalize();
      this.$form.trigger('ajax:complete');
      if (this.on_save_callback != null) {
        this.on_save_callback(this.custom_field.get('select_options').sortBy(function(option) {
          return option.get('position');
        }));
      }
      return this.close();
    };

    SelectView.prototype.render_select_options_view = function() {
      if (this.select_options_view != null) {
        this.select_options_view.remove();
      }
      this.select_options_view = new Locomotive.Views.ContentTypes.SelectOptionsView({
        model: this.custom_field,
        collection: this.custom_field.get('select_options')
      });
      return this.$('.placeholder').append(this.select_options_view.render().el);
    };

    SelectView.prototype.open = function() {
      return $(this.el).dialog('open');
    };

    SelectView.prototype.close = function(event) {
      if (event != null) {
        event.stopPropagation() & event.preventDefault();
      }
      $(this.el).dialog('overlayEl').unbind('click');
      return $(this.el).dialog('close');
    };

    SelectView.prototype.center = function() {
      return $(this.el).dialog('option', 'position', 'center');
    };

    return SelectView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  Locomotive.Views.Shared.ListItemView = (function(_super) {

    __extends(ListItemView, _super);

    function ListItemView() {
      return ListItemView.__super__.constructor.apply(this, arguments);
    }

    ListItemView.prototype.tagName = 'li';

    ListItemView.prototype.events = {
      'click a.remove': 'remove_item'
    };

    ListItemView.prototype.template = function() {};

    ListItemView.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    ListItemView.prototype.remove_item = function(event) {
      event.stopPropagation() & event.preventDefault();
      if (confirm($(event.target).attr('data-confirm'))) {
        return this.model.destroy();
      }
    };

    return ListItemView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Shared || (_base.Shared = {});

  Locomotive.Views.Shared.ListView = (function(_super) {
    var _item_views;

    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.tagName = 'div';

    _item_views = [];

    ListView.prototype.initialize = function() {
      _.bindAll(this, 'insert_item', 'remove_item');
      this.collection.bind('add', this.insert_item);
      return this.collection.bind('remove', this.remove_item);
    };

    ListView.prototype.template = function() {};

    ListView.prototype.item_view_class = function() {};

    ListView.prototype.render = function() {
      $(this.el).html(this.template()());
      this.render_items();
      return this;
    };

    ListView.prototype.render_items = function() {
      var _this = this;
      if (this.collection.length === 0) {
        return this.$('.no-items').show();
      } else {
        return this.collection.each(function(item) {
          return _this.insert_item(item);
        });
      }
    };

    ListView.prototype.insert_item = function(item) {
      var klass, view;
      klass = this.item_view_class();
      view = new klass({
        model: item,
        parent_view: this
      });
      (this._item_views || (this._item_views = [])).push(view);
      this.$('.no-items').hide();
      return this.$('ul').append(view.render().el);
    };

    ListView.prototype.remove_item = function(item) {
      var view;
      if (this.collection.length === 0) {
        this.$('.no-items').show();
      }
      view = _.find(this._item_views, function(tmp) {
        return tmp.model === item;
      });
      if (view != null) {
        return view.remove();
      }
    };

    ListView.prototype.remove = function() {
      var _this = this;
      _.each(this._item_views, function(view) {
        return view.remove();
      });
      return ListView.__super__.remove.apply(this, arguments);
    };

    return ListView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Sites || (_base.Sites = {});

  Locomotive.Views.Sites.DomainEntryView = (function(_super) {

    __extends(DomainEntryView, _super);

    function DomainEntryView() {
      return DomainEntryView.__super__.constructor.apply(this, arguments);
    }

    DomainEntryView.prototype.tagName = 'li';

    DomainEntryView.prototype.className = 'domain';

    DomainEntryView.prototype.events = {
      'change input[type=text]': 'change',
      'click a.remove': 'remove'
    };

    DomainEntryView.prototype.render = function() {
      $(this.el).html(ich.domain_entry(this.model.toJSON()));
      return this;
    };

    DomainEntryView.prototype.change = function(event) {
      var value;
      value = $(event.target).val();
      return this.options.parent_view.change_entry(this.model, value);
    };

    DomainEntryView.prototype.remove = function(event) {
      event.stopPropagation() & event.preventDefault();
      this.$('input[type=text]').editableField('destroy');
      this.options.parent_view.remove_entry(this.model);
      return DomainEntryView.__super__.remove.call(this);
    };

    return DomainEntryView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Sites || (_base.Sites = {});

  Locomotive.Views.Sites.MembershipEntryView = (function(_super) {

    __extends(MembershipEntryView, _super);

    function MembershipEntryView() {
      return MembershipEntryView.__super__.constructor.apply(this, arguments);
    }

    MembershipEntryView.prototype.className = 'entry';

    MembershipEntryView.prototype.events = {
      'change select': 'change',
      'click a.remove': 'remove'
    };

    MembershipEntryView.prototype.render = function() {
      var data;
      data = this.model.toJSON();
      data.index = this.options.index;
      $(this.el).html(ich.membership_entry(data));
      $(this.el).attr('data-role', this.model.get('role'));
      this.$('select').val(this.model.get('role'));
      return this;
    };

    MembershipEntryView.prototype.change = function(event) {
      var value;
      value = $(event.target).val();
      return this.options.parent_view.change_entry(this.model, value);
    };

    MembershipEntryView.prototype.remove = function(event) {
      event.stopPropagation() & event.preventDefault();
      this.$('select').editableField('destroy');
      this.options.parent_view.remove_entry(this.model);
      return MembershipEntryView.__super__.remove.call(this);
    };

    return MembershipEntryView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Sites || (_base.Sites = {});

  Locomotive.Views.Sites.MembershipsView = (function(_super) {
    var _entry_views;

    __extends(MembershipsView, _super);

    function MembershipsView() {
      return MembershipsView.__super__.constructor.apply(this, arguments);
    }

    MembershipsView.prototype.tagName = 'div';

    MembershipsView.prototype.className = 'list';

    _entry_views = [];

    MembershipsView.prototype.render = function() {
      this.render_entries();
      this.enable_ui_effects();
      return this;
    };

    MembershipsView.prototype.change_entry = function(membership, value) {
      return membership.set({
        role: value
      });
    };

    MembershipsView.prototype.remove_entry = function(membership) {
      return membership.set({
        _destroy: true
      });
    };

    MembershipsView.prototype.render_entries = function() {
      var _this = this;
      return this.model.get('memberships').each(function(membership, index) {
        return _this._insert_entry(membership, index);
      });
    };

    MembershipsView.prototype.enable_ui_effects = function() {
      return this.$('.entry select').editableField();
    };

    MembershipsView.prototype._insert_entry = function(membership, index) {
      var view;
      view = new Locomotive.Views.Sites.MembershipEntryView({
        model: membership,
        parent_view: this,
        index: index
      });
      (this._entry_views || (this._entry_views = [])).push(view);
      return $(this.el).append(view.render().el);
    };

    return MembershipsView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Sites || (_base.Sites = {});

  Locomotive.Views.Sites.NewView = (function(_super) {

    __extends(NewView, _super);

    function NewView() {
      return NewView.__super__.constructor.apply(this, arguments);
    }

    NewView.prototype.el = '#content';

    NewView.prototype.events = {
      'submit': 'save'
    };

    NewView.prototype.initialize = function() {
      this.model = new Locomotive.Models.Site();
      return Backbone.ModelBinding.bind(this);
    };

    NewView.prototype.render = function() {
      NewView.__super__.render.call(this);
      return this.render_domains();
    };

    NewView.prototype.render_domains = function() {
      this.domains_view = new Locomotive.Views.Sites.DomainsView({
        model: this.model,
        errors: this.options.errors
      });
      return this.$('#site_domains_input label').after(this.domains_view.render().el);
    };

    NewView.prototype.save = function(event) {
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          return window.location.href = xhr.getResponseHeader('location');
        }
      });
    };

    NewView.prototype.show_error = function(attribute, message, html) {
      if (attribute === 'domains') {
        return this.domains_view.show_error(message);
      } else {
        return NewView.__super__.show_error.apply(this, arguments);
      }
    };

    NewView.prototype.remove = function() {
      this.domains_view.remove();
      return NewView.__super__.remove.apply(this, arguments);
    };

    return NewView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Snippets || (_base.Snippets = {});

  Locomotive.Views.Snippets.FormView = (function(_super) {

    __extends(FormView, _super);

    function FormView() {
      return FormView.__super__.constructor.apply(this, arguments);
    }

    FormView.prototype.el = '#content';

    FormView.prototype.events = {
      'click    a#image-picker-link': 'open_image_picker',
      'submit': 'save'
    };

    FormView.prototype.initialize = function() {
      _.bindAll(this, 'insert_image');
      this.model = new Locomotive.Models.Snippet(this.options.snippet);
      this.image_picker_view = new Locomotive.Views.ThemeAssets.ImagePickerView({
        collection: new Locomotive.Models.ThemeAssetsCollection(),
        on_select: this.insert_image
      });
      this.image_picker_view.render();
      return Backbone.ModelBinding.bind(this);
    };

    FormView.prototype.render = function() {
      FormView.__super__.render.call(this);
      this.slugify_name();
      this.enable_liquid_editing();
      return this;
    };

    FormView.prototype.slugify_name = function() {
      return this.$('#snippet_name').slugify({
        target: this.$('#snippet_slug')
      });
    };

    FormView.prototype.open_image_picker = function(event) {
      event.stopPropagation() & event.preventDefault();
      this.image_picker_view.editor = this.editor;
      return this.image_picker_view.fetch_assets();
    };

    FormView.prototype.insert_image = function(path) {
      var text;
      text = "{{ '" + path + "' | theme_image_url }}";
      this.editor.replaceSelection(text);
      return this.image_picker_view.close();
    };

    FormView.prototype.enable_liquid_editing = function() {
      var input,
        _this = this;
      input = this.$('#snippet_template');
      return this.editor = CodeMirror.fromTextArea(input.get()[0], {
        mode: 'liquid',
        autoMatchParens: false,
        lineNumbers: false,
        passDelay: 50,
        tabMode: 'shift',
        theme: 'default medium',
        onChange: function(editor) {
          return _this.model.set({
            template: editor.getValue()
          });
        }
      });
    };

    FormView.prototype.after_inputs_fold = function() {
      return this.editor.refresh();
    };

    return FormView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Snippets || (_base.Snippets = {});

  Locomotive.Views.Snippets.EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      return EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.save = function(event) {
      return this.save_in_ajax(event);
    };

    return EditView;

  })(Locomotive.Views.Snippets.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Snippets || (_base.Snippets = {});

  Locomotive.Views.Snippets.ListItemView = (function(_super) {

    __extends(ListItemView, _super);

    function ListItemView() {
      return ListItemView.__super__.constructor.apply(this, arguments);
    }

    ListItemView.prototype.template = function() {
      return ich.snippet_item;
    };

    return ListItemView;

  })(Locomotive.Views.Shared.ListItemView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Snippets || (_base.Snippets = {});

  Locomotive.Views.Snippets.ListView = (function(_super) {

    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.className = 'box';

    ListView.prototype.initialize = function() {
      this.collection = new Locomotive.Models.SnippetsCollection(this.options.collection);
      return ListView.__super__.initialize.apply(this, arguments);
    };

    ListView.prototype.template = function() {
      return ich.snippets_list;
    };

    ListView.prototype.item_view_class = function() {
      return Locomotive.Views.Snippets.ListItemView;
    };

    return ListView;

  })(Locomotive.Views.Shared.ListView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).Snippets || (_base.Snippets = {});

  Locomotive.Views.Snippets.NewView = (function(_super) {

    __extends(NewView, _super);

    function NewView() {
      return NewView.__super__.constructor.apply(this, arguments);
    }

    NewView.prototype.save = function(event) {
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          return window.location.href = xhr.getResponseHeader('location');
        }
      });
    };

    return NewView;

  })(Locomotive.Views.Snippets.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ThemeAssets || (_base.ThemeAssets = {});

  Locomotive.Views.ThemeAssets.FormView = (function(_super) {

    __extends(FormView, _super);

    function FormView() {
      return FormView.__super__.constructor.apply(this, arguments);
    }

    FormView.prototype.el = '#content';

    FormView.prototype.events = {
      'click    a#image-picker-link': 'open_image_picker',
      'submit': 'save'
    };

    FormView.prototype.initialize = function() {
      _.bindAll(this, 'insert_image');
      this.model = new Locomotive.Models.ThemeAsset(this.options.theme_asset);
      this.image_picker_view = new Locomotive.Views.ThemeAssets.ImagePickerView({
        on_select: this.insert_image
      });
      this.image_picker_view.render();
      return Backbone.ModelBinding.bind(this);
    };

    FormView.prototype.render = function() {
      FormView.__super__.render.call(this);
      this.enable_toggle_between_file_and_text();
      this.enable_source_editing();
      this.bind_source_mode();
      this.enable_source_file();
      return this;
    };

    FormView.prototype.enable_toggle_between_file_and_text = function() {
      var _this = this;
      this.$('div.hidden').hide();
      this.model.set({
        performing_plain_text: this.$('#theme_asset_performing_plain_text').val()
      });
      return this.$('.selector > a.alt').click(function(event) {
        event.stopPropagation() & event.preventDefault();
        if (_this.$('#file-selector').is(':hidden')) {
          return _this.$('#text-selector').slideUp('normal', function() {
            _this.$('#file-selector').slideDown();
            _this.model.set({
              performing_plain_text: false
            });
            return _this.$('input#theme_asset_performing_plain_text').val(false);
          });
        } else {
          return _this.$('#file-selector').slideUp('normal', function() {
            _this.$('#text-selector').slideDown('normal', function() {
              return _this.editor.refresh();
            });
            _this.model.set({
              performing_plain_text: true
            });
            return _this.$('#theme_asset_performing_plain_text').val(true);
          });
        }
      });
    };

    FormView.prototype.enable_source_file = function() {
      var _this = this;
      return this.$('.formtastic #theme_asset_source').bind('change', function(event) {
        var input;
        input = $(event.target)[0];
        if (input.files != null) {
          return _this.model.set({
            source: input.files[0]
          });
        }
      });
    };

    FormView.prototype.show_error = function(attribute, message, html) {
      switch (attribute) {
        case 'source':
          return this.$(this.model.get('performing_plain_text') ? '#theme_asset_plain_text_input .CodeMirror' : '#theme_asset_source').after(html);
        default:
          return FormView.__super__.show_error.apply(this, arguments);
      }
    };

    FormView.prototype.open_image_picker = function(event) {
      event.stopPropagation() & event.preventDefault();
      this.image_picker_view.editor = this.editor;
      return this.image_picker_view.fetch_assets();
    };

    FormView.prototype.insert_image = function(path) {
      var text;
      text = "'" + path + "'";
      this.editor.replaceSelection(text);
      return this.image_picker_view.close();
    };

    FormView.prototype.source_mode = function() {
      if (this.model.get('plain_text_type') === 'javascript') {
        return 'javascript';
      } else {
        return 'css';
      }
    };

    FormView.prototype.enable_source_editing = function() {
      var input,
        _this = this;
      input = this.$('#theme_asset_plain_text');
      if (input.size() === 0) {
        return;
      }
      return this.editor = CodeMirror.fromTextArea(input.get()[0], {
        mode: this.source_mode(),
        autoMatchParens: false,
        lineNumbers: false,
        passDelay: 50,
        tabMode: 'shift',
        theme: 'default',
        onChange: function(editor) {
          return _this.model.set({
            plain_text: editor.getValue()
          });
        }
      });
    };

    FormView.prototype.bind_source_mode = function() {
      var _this = this;
      return this.$('#theme_asset_plain_text_type').bind('change', function(event) {
        return _this.editor.setOption('mode', _this.source_mode());
      });
    };

    FormView.prototype.after_inputs_fold = function() {
      if (this.editor != null) {
        return this.editor.refresh();
      }
    };

    return FormView;

  })(Locomotive.Views.Shared.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ThemeAssets || (_base.ThemeAssets = {});

  Locomotive.Views.ThemeAssets.EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      return EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.save = function(event) {
      var _this = this;
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          var help;
          window.response = response;
          window.xhr = xhr;
          help = _this.$('.inner > p.help');
          help.find('b').html(response.dimensions);
          help.find('a').html(response.url).attr('href', response.url);
          window.editor = _this.editor;
          if (response.plain_text != null) {
            return _this.editor.setValue(response.plain_text);
          }
        }
      });
    };

    return EditView;

  })(Locomotive.Views.ThemeAssets.FormView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ThemeAssets || (_base.ThemeAssets = {});

  Locomotive.Views.ThemeAssets.ImagePickerView = (function(_super) {

    __extends(ImagePickerView, _super);

    function ImagePickerView() {
      return ImagePickerView.__super__.constructor.apply(this, arguments);
    }

    ImagePickerView.prototype.events = {
      'click ul.list a': 'select_asset'
    };

    ImagePickerView.prototype.initialize = function() {
      this.collection || (this.collection = new Locomotive.Models.ThemeAssetsCollection());
      return ImagePickerView.__super__.initialize.apply(this, arguments);
    };

    ImagePickerView.prototype.template = function() {
      return ich.theme_image_picker;
    };

    ImagePickerView.prototype.fetch_assets = function() {
      var _this = this;
      this._reset();
      return this.collection.fetch({
        data: {
          content_type: 'image'
        },
        success: function() {
          return _this.open();
        }
      });
    };

    ImagePickerView.prototype.build_uploader = function(el, link) {
      var _this = this;
      link.bind('click', function(event) {
        event.stopPropagation() & event.preventDefault();
        return el.click();
      });
      return el.bind('change', function(event) {
        return _.each(event.target.files, function(file) {
          var asset;
          asset = new Locomotive.Models.ThemeAsset({
            source: file
          });
          return asset.save({}, {
            headers: {
              'X-Flash': true
            },
            success: function(model) {
              return _this.collection.add(model);
            },
            error: function() {
              return _this.shake();
            }
          });
        });
      });
    };

    ImagePickerView.prototype.select_asset = function(event) {
      event.stopPropagation() & event.preventDefault();
      if (this.options.on_select) {
        return this.options.on_select($(event.target).html());
      }
    };

    ImagePickerView.prototype.add_asset = function(asset) {
      this.$('ul.list').append(ich.theme_asset(asset.toJSON()));
      return this._refresh();
    };

    ImagePickerView.prototype._reset = function() {
      return this.$('ul.list').empty();
    };

    return ImagePickerView;

  })(Locomotive.Views.Shared.AssetPickerView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ThemeAssets || (_base.ThemeAssets = {});

  Locomotive.Views.ThemeAssets.IndexView = (function(_super) {

    __extends(IndexView, _super);

    function IndexView() {
      return IndexView.__super__.constructor.apply(this, arguments);
    }

    IndexView.prototype.el = '#content';

    IndexView.prototype._lists_views = [];

    IndexView.prototype.initialize = function() {
      return _.bindAll(this, 'insert_asset');
    };

    IndexView.prototype.render = function() {
      this.build_uploader();
      this.render_snippets();
      this.render_images();
      this.render_js_and_css();
      this.render_fonts();
      this.render_media();
      return this;
    };

    IndexView.prototype.build_uploader = function() {
      var form, input, link,
        _this = this;
      form = this.$('#theme-assets-quick-upload');
      input = form.find('input[type=file]');
      link = form.find('a.new');
      form.formSubmitNotification();
      link.bind('click', function(event) {
        event.stopPropagation() & event.preventDefault();
        return input.click();
      });
      return input.bind('change', function(event) {
        form.trigger('ajax:beforeSend');
        return _.each(event.target.files, function(file) {
          var asset;
          asset = new Locomotive.Models.ThemeAsset({
            source: file
          });
          return asset.save({}, {
            success: function(model, response, xhr) {
              form.trigger('ajax:complete');
              return _this.insert_asset(model);
            },
            error: (function() {
              return form.trigger('ajax:complete');
            }),
            headers: {
              'X-Flash': true
            }
          });
        });
      });
    };

    IndexView.prototype.insert_asset = function(model) {
      var list_view;
      list_view = this.pick_list_view(model.get('content_type'));
      return list_view.collection.add(model);
    };

    IndexView.prototype.render_snippets = function() {
      return this.render_list('snippets', this.options.snippets, Locomotive.Views.Snippets.ListView);
    };

    IndexView.prototype.render_images = function() {
      return this.render_list('images', this.options.images);
    };

    IndexView.prototype.render_js_and_css = function() {
      return this.render_list('js-and-css', this.options.js_and_css_assets, Locomotive.Views.ThemeAssets.ListView, ich.js_and_css_list);
    };

    IndexView.prototype.render_fonts = function() {
      return this.render_list('fonts', this.options.fonts, Locomotive.Views.ThemeAssets.ListView, ich.fonts_list);
    };

    IndexView.prototype.render_media = function() {
      return this.render_list('media', this.options.media, Locomotive.Views.ThemeAssets.ListView, ich.media_list);
    };

    IndexView.prototype.render_list = function(type, collection, view_klass, template) {
      var view;
      if (this.$("#" + type + "-anchor").size() === 0) {
        return;
      }
      view_klass || (view_klass = Locomotive.Views.ThemeAssets.ListView);
      view = new view_klass({
        collection: collection,
        type: type
      });
      if (template != null) {
        view.template = function() {
          return template;
        };
      }
      this.$("#" + type + "-anchor").replaceWith(view.render().el);
      return (this._lists_views || (this._lists_views = [])).push(view);
    };

    IndexView.prototype.pick_list_view = function(content_type) {
      var type,
        _this = this;
      type = (function() {
        switch (content_type) {
          case 'image':
            return 'images';
          case 'javascript':
          case 'stylesheet':
            return 'js-and-css';
          case 'media':
            return 'media';
          case 'font':
            return 'fonts';
        }
      })();
      return _.find(this._lists_views, function(view) {
        return view.options.type === type;
      });
    };

    IndexView.prototype.remove = function() {
      var _this = this;
      _.each(this._lists_views, function(view) {
        return view.remove();
      });
      return IndexView.__super__.remove.apply(this, arguments);
    };

    return IndexView;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ThemeAssets || (_base.ThemeAssets = {});

  Locomotive.Views.ThemeAssets.ListItemView = (function(_super) {

    __extends(ListItemView, _super);

    function ListItemView() {
      return ListItemView.__super__.constructor.apply(this, arguments);
    }

    ListItemView.prototype.template = function() {
      return ich.editable_theme_asset_item;
    };

    return ListItemView;

  })(Locomotive.Views.Shared.ListItemView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ThemeAssets || (_base.ThemeAssets = {});

  Locomotive.Views.ThemeAssets.ListView = (function(_super) {

    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.className = 'box';

    ListView.prototype.initialize = function() {
      this.collection = new Locomotive.Models.ThemeAssetsCollection(this.options.collection);
      return ListView.__super__.initialize.apply(this, arguments);
    };

    ListView.prototype.template = function() {
      return ich.images_list;
    };

    ListView.prototype.item_view_class = function() {
      return Locomotive.Views.ThemeAssets.ListItemView;
    };

    return ListView;

  })(Locomotive.Views.Shared.ListView);

}).call(this);
(function() {
  var _base,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = Locomotive.Views).ThemeAssets || (_base.ThemeAssets = {});

  Locomotive.Views.ThemeAssets.NewView = (function(_super) {

    __extends(NewView, _super);

    function NewView() {
      return NewView.__super__.constructor.apply(this, arguments);
    }

    NewView.prototype.save = function(event) {
      return this.save_in_ajax(event, {
        on_success: function(response, xhr) {
          return window.location.href = xhr.getResponseHeader('location');
        }
      });
    };

    return NewView;

  })(Locomotive.Views.ThemeAssets.FormView);

}).call(this);

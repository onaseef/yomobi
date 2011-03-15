var util = {
  
  debug: true,
  
  // UI event blocking statuses
  busy: {},

  /**
   *  reserve
   *    This function checks if a key is vacant or occupied. Useful
   *  for UI blocking.
   *  If the key is occupied, it returns false.
   *  If the key is vacant, it sets it as occupied and returns true.
   *  Example usage:
      function submitForm() {
        if(!util.reserve('form-submit')) return;
        // do important submitting stuff
      }
   */
  reserve: function (key) {
    if(this.busy[key] === undefined || this.busy[key] === false) {
      this.busy[key] = true;
      return true;
    }
    else if(this.busy[key] === true) {
      return false;
    }
  },

  release: function (key) {
    this.busy[key] = false;
  },
  
  capitalize: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  },
  
  prettify: function (word) {
    switch (word.toLowerCase()) {
      case 'and':       word = '&'; break;
      default: break;
    }
    return this.capitalize(word);
  },
  
  uglify: function (word) {
    switch (word) {
      case '&':       word = 'and'; break;
      default: break;
    }
    return word.toLowerCase();
  },
  
  prettifyName: function (name) {
    var prettyName = _(name.split('-')).chain()
        .map(function (word) { return util.prettify(word); })
        .value()
        .join(' ')
    ;
    return prettyName;
  },
  
  uglifyName: function (name) {
    var uglyName = _(name.split(' ')).chain()
        .map(function (word) { return util.uglify(word); })
        .value()
        .join('-')
    ;
    return uglyName;
  },
  
  getTemplate: function (name) {
    return _.template($('#templates .'+name).html());
  },
  
  getInputElements: function (elem,selector) {
    selector = selector || '';
    return elem.find(selector + ' input,textarea');
  },
  
  newWidget: function (wtype,data) {
    return new window.widgetClasses[wtype](data);
  },
  
  showLoading: function (element) {
    element.find('.checkmark').hide();
    element.find('.loader').show();
  },
  
  showSuccess: function (element) {
    element.find('.loader').hide();
    element.find('.checkmark').show();
  },
  
  log: function () {
    if(!this.debug) return;
    if(!window.console || !window.console.log) return;
    
    console.log.apply(console,arguments);
  },
  
  couchSync: function (method,model,success,error) {
    if(method == 'read') {
      $.ajax({
        url: model.url,
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
          if(!data) statusbar.append('not defined data '+JSON.stringify(data));
          success(data);
        },
        error: function(jqXHR,textStatus,errorThrown) {
          error(jqXHR,textStatus,errorThrown);
        }
      });
    }
    else {
      alert(method+' method not implemented.');
    }
  }
}


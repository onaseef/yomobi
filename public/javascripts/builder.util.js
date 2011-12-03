(function () {

if (!window.util) {
  console.log('This file requires util.js!');
  return;
}

var imageDialogTemplate = util.getTemplate('jeditor-image-dialog');
var youtubeDialogTemplate = util.getTemplate('jeditor-youtube-dialog');
var dialogCloseFunc = function () {
  if (!util.isUIFree()) return;
  $(this).dialog('close');
};
var youtubeEmbedTemplate = util.getTemplate('youtube-embed-html');

var ytRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
var getYoutubeVideoId = function (url) {
  var match = url.match(ytRegex);
  if (match && match[7].length == 11) {
    return match[7];
  } else {
    return undefined;
  }
}

var builderUtil = {

  dialog: function (html,buttons,title) {
    return $(html).dialog({
      resizable: false,
      modal: true,
      draggable: false,
      closeOnEscape: false,
      buttons: buttons,
      title: title
    });
  },

  spawnJEditor: function () {
    $('#jeditor').wysiwyg({
      css: '/stylesheets/jwysiwyg.css?_=' + Math.random(),
      removeHeadings: true,
      formHeight: 400,
      formWidth: 320,
      events: {
        save: function () { bapp.currentEditor.trigger('wysiwyg-change'); },
        paste: function () { bapp.currentEditor.trigger('wysiwyg-paste'); return false; },
        click: function (e,b,c) {

          if (e.target.tagName.toLowerCase() === 'img') {

            util.jeditorImageDialog(e.target);
            return false;
          }
        }
      },
      controls: {
        insertImage: { visible:false },
        insertTable: { visible:false },
        subscript: { visible:false },
        superscript: { visible:false },
        uploadImage: {
          visible: true,
          groupIndex: 9,
          exec: util.jeditorImageDialog,
          className: 'uploadImage',
          tooltip: "Add a Picture"
        },
        embedYoutube: {
          visible: true,
          groupIndex: 9,
          exec: util.jeditorYoutubeDialog,
          className: 'embedYoutube',
          tooltip: 'Add a YouTube video'
        }
      }
    });
    // $('.wysiwyg iframe').css('height',250).css('width',320);
  },

  _createDummyImage: function () {
    return $('<img class="yo">').css({
      float: 'left',
      width: 'auto',
      maxWidth: '100%'
    }).attr('data-size',1);
  },

  jeditorImageDialog: function (img, options) {
    var $img, currentThumb
      , widget = bapp.currentEditor.widget
      , isNew = !img
      , $parent = $(img).parent()
    ;
    if (isNew) {
      $img = util._createDummyImage();
    }
    else $img = $(img);

    if (widget.get('wtype') === 'page_tree') {
      currentThumb = widget.getCurrentNode()._data.wphotoUrl
    }

    var isDefault = util.thumbWphoto($img.attr('src')) === currentThumb;
    var templateData = {
      src: $img.attr('src'),
      float: $img.css('float'),
      size: $img.data('size') || 100,
      isThumbEnabled: widget.get('wtype') === 'page_tree',
      isDefault: isDefault,
      thumb: currentThumb
    };

    if ( $parent.is('a') ) {
      templateData.href = $parent.attr('href');
    }

    var dialog = util.dialog(imageDialogTemplate(templateData), {
      'Save': function () {
        if (!util.isUIFree()) return;

        var imgAttrs = util.getFormValueHash( $(this) );

        if (isNew) {
          $('#jeditor').data('wysiwyg').ui.focus();
          $('#jeditor').wysiwyg('insertImage', imgAttrs.src, {
            src: imgAttrs.src,
            style:'float:left'
          });
          util.jeditorImageDialog( $('#jeditor').data('wysiwyg').lastInsertedImage );
        }
        else {
          var origImg = dialog.find('img.hide')[0];
          var newSize = parseInt(imgAttrs.size)
                         || ( Math.round($img[0].width / origImg.width * 100) );
          newSize = util.bound(newSize, 1, 100);

          $img.addClass('yo')
              .removeClass( 'yo-' + $img.css('float') )
              .addClass('yo-' + imgAttrs.float)
              .data('size', newSize)
              .attr('data-size', newSize)
              .css({
                float: imgAttrs.float,
                maxWidth:'100%',
                width: Math.round(newSize * origImg.width / 100) + 'px',
                height: Math.round(newSize * origImg.height / 100) + 'px'
              })
          ;

          if ($parent.is('a') && imgAttrs.href)
            $parent.attr('href', util.ensureUrl(imgAttrs.href));
          else if (imgAttrs.href)
            $img.wrap('<a href="'+util.ensureUrl(imgAttrs.href)+'" />');
          else if ($parent.is('a'))
            $img.unwrap();

          if (dialog.find('[name=is_default]').prop('checked') === true
              && util.thumbWphoto($img.attr('src')) !== currentThumb)
          {
            widget.getCurrentNode()._data.wphotoUrl = util.thumbWphoto($img.attr('src'));
            bapp.currentEditor.setChanged('thumb', true);
          }
          else if (util.thumbWphoto($img.attr('src')) === currentThumb
              && dialog.find('[name=is_default]').prop('checked') === false)
          {
            delete widget.getCurrentNode()._data.wphotoUrl;
            bapp.currentEditor.setChanged('thumb', true);
          }

          $( $('#jeditor').data('wysiwyg').editorDoc ).trigger('save');
        }
        $(this).dialog('close');
      },
      'Cancel': dialogCloseFunc
    }, isNew ? 'Upload Image' : 'Edit Image');

    dialog.find('[name=size]').change(function () {
      var isCustom = !!$(this).find('option:selected').data('custom');
      dialog.find('.custom-size').toggle(isCustom);
    });

    dialog.find('[name=delete]').click(function () {
      $img.remove();
      $( $('#jeditor').data('wysiwyg').editorDoc ).trigger('save');
      // click the cancel button
      dialog.parent().find('.ui-dialog-buttonset button:last').click();
    });

    dialog.find('[name=is_default]').prop('checked', isDefault);

    // set selects to current values
    dialog.find('[name=float]').val( $img.css('float') );

    dialog.find('.help-bubble').simpletooltip(undefined,'help');

    if (!$img.data('size')) {
      var origImg = dialog.find('img.hide')[0];
      var updateSize = function () {
        var size = Math.round($img[0].width / origImg.width * 100);
        dialog.find('[name=size]').val(size);
      };
      if (origImg.width) updateSize();
      else origImg.onLoad = updateSize;
    }

    if (isNew) {
      util.initUploader( dialog.find('.wphoto-wrap'), {
        instanceId: 'dialog',
        alwaysOnTop: true,
        onDone: util.createUploaderCallback(function (data) {
          dialog.find('input[name=src]').val( util.largerWphoto(data.wphotoUrl) );
          util.releaseUI();
          // click the save button
          dialog.parent().find('.ui-dialog-buttonset button:first').click();
        }),
        emptyQueue: true,
        wid: bapp.currentEditor.widget.id
      });
    }
  },

  jeditorYoutubeDialog: function () {
    var dialog = util.dialog(youtubeDialogTemplate(), {
      'Save': function () {

        var vid = getYoutubeVideoId( dialog.find('[name=url]').val() )
          , html = youtubeEmbedTemplate({
              vid: vid || 'GGT8ZCTBoBA'
            })
        ;
        if (!vid) {
          dialog.find('.error').show('pulsate', { times:3 });
          return;
        }
        else {
          $('#jeditor').data('wysiwyg').ui.focus();

          // insert temporary image to get around execCommand's insertHtml limitations
          var Wysiwyg = $('#jeditor').data('wysiwyg');
          Wysiwyg.editorDoc.execCommand("insertImage", false, "#jwysiwyg#");
          var temp = Wysiwyg.getElementByAttributeValue("img", "src", "#jwysiwyg#");
          $(temp).replaceWith(html);

          $(this).dialog('close');
        }
      },
      'Cancel': dialogCloseFunc
    });
    dialog.find('.help-bubble').simpletooltip(undefined,'help');
  },

  toHtml: function (jqueryObject) {
    return $('<div>').html( jqueryObject ).html();
  },

  stripAllStyles: function (html) {
    var $html = $(html);
    util._stripAllStyles( $html );
    return util.toHtml( $html );
  },

  attributesToStrip: [
    'style', 'width', 'height',
    'border', 'cellpadding', 'frame', 'bgcolor',
    'color', 'size'
  ],
  tagsToStrip: [
    'table', 'tr', 'td', 'tbody', 'th',
    'font'
  ],
  tagsToIgnore: [
    'object'
  ],

  // expects a jquery object
  _stripAllStyles: function ($group) {
    var elemIdxsToStrip = [];

    $group.each(function (idx,elem) {
      if (elem.className === 'yo') return;

      if ( elem.tagName && _.include(util.tagsToStrip,elem.tagName.toLowerCase()) ) {
        elemIdxsToStrip.push(idx);
        return;
      }

      if (elem.removeAttribute &&
        !_.include(util.tagsToIgnore,elem.tagName.toLowerCase()) )
      {
        for (var i = util.attributesToStrip.length - 1; i >= 0; i--) {
          elem.removeAttribute(util.attributesToStrip[i]);
        }
      }
      // quick and easy non-perfect way of checking for children
      if (elem.innerHTML)
        util._stripAllStyles( $(elem).children() );
    });

    _.each(elemIdxsToStrip, function (idx) {
      $group[idx] = $('<p>' + $( $group[idx] ).text() + '</p>')[0];
    });
  },

  enableFileUploadButton: function () {
    if ($.browser.msie) {
      setTimeout(util._enableFileUploadButton, 0);
    }
    else {
      util._enableFileUploadButton();
    }
  },
  _enableFileUploadButton: function () {
    var fileInput = $('input[type=file]')
      , file = fileInput.val()
    ;
    if (file && file.length > 0) {
      $('input[value=Upload]').prop('disabled',false);
    }
  },

  _uploaders: {},
  getOrCreateUploader: function (extraData, options) {
    var defaults = {
      instanceId: 'default',
      extraParams: {},
      onDone: _.identity
    }
    options = _.extend(defaults, options);

    var uploader = this._uploaders[options.instanceId];

    if (uploader && options.emptyQueue && uploader.files.length > 0) {
      while (uploader.files.length > 0) {
        uploader.removeFile(uploader.files[0]);
      }
    }

    if (uploader && uploader.runtime === 'flash') {
      this.destroyUploader(options.instanceId);
    }
    else if (uploader) {
      _.extend(uploader.settings, extraData);
      _.extend(uploader.settings.multipart_params, options.extraParams);
      uploader.yomobiOptions = options;
      return uploader;
    }

    uploader = this._uploaders[options.instanceId] = new plupload.Uploader(_.extend({
      runtimes: 'html5,flash,html4',
      url: g.wphotoUploadPath,
      max_file_size: '10mb',
      multiple_queues: false,
      multi_selection: false,
      filters: [
        { title:'Image Files', extensions:'jpg,jpeg,gif,png' }
      ],

      flash_swf_url: '/javascripts/plupload/plupload.flash.swf',
      multipart: true,
      multipart_params: _.extend(g.uploadifyScriptData, options.extraParams),
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
    }, extraData));

    uploader.instanceId = options.instanceId;
    uploader.yomobiOptions = options;

    return uploader;
  },

  destroyUploader: function (instanceId) {
    this._uploaders[instanceId].destroy();
    delete this._uploaders[instanceId];
  },

  initUploader: function (context, options) {
    options || (options = {});
    options.context = context;

    var pickerId = util.generateId()
      , uploader = util.getOrCreateUploader({ browse_button:pickerId }, options)
    ;
    util.uploaderContext = context;

    uploader.unbindAll();

    uploader.bind('Init', function (up, params) {
      if (uploader.files.length > 0 && uploader.files[0].status === plupload.DONE) {
        uploader.removeFile(uploader.files[0]);
      }
      else if (uploader.files.length > 0) {
        file = uploader.files[0];
        context.find('.selected-file').empty().append(
          '<div id="' + file.id + '">' +
          file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
        '</div>');
      }
    });

    context.find('[name=pick_files]').attr('id', pickerId);

    uploader.init();

    uploader.reposition = function () {
      uploader.refresh(); // Reposition Flash/Silverlight
      if (uploader.yomobiOptions.alwaysOnTop === true) {
        uploader.bringToFront();
      }
    };
    context.find('img').load(function () { uploader.reposition(); });
    // fix bug with flash runtime
    var resizeTimeout;
    $(window).unbind('resize.yo-up').bind('resize.yo-up', function () {
      if (uploader.runtime !== 'flash') return;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () { uploader.reposition(); }, 300);
    });
    
    // because we're in a dialog, sometimes we need to set the uploader to be
    // on top of everything else, as well as send it back
    uploader.layover = $('#' + uploader.id + '_' + uploader.runtime + '_container');
    if (uploader.layover.length === 0) {
      // layover for html4 runtime
      uploader.layover = $('form[target=' + uploader.id + '_iframe]');
    }

    uploader.bringToFront = function () {
      if ($.browser.mozilla && $.browser.version.slice(0,3) !== "1.9")
        return;
      this.layover.css('z-index', 10000);
    };
    uploader.sendToBack = function () {
      $('#'+pickerId).hide();
      uploader.refresh();
    };
    uploader.disableBrowseButton = function () {
      $('#'+pickerId).hide();
      $('<button>').text('Browse...')
        .prop('disabled',true)
        .insertAfter('#'+pickerId)
        .after('<img class="ajax" src="/images/ui/ajax-loader-small.gif">')
      ;
      uploader.refresh();
    };

    uploader.bind('FilesAdded', function (up, files) {
      if (!util.isUIFree()) return;

      var isAutoEnabled = uploader.yomobiOptions.auto !== false;

      while (uploader.files.length > 1) {
        uploader.removeFile(uploader.files[0]);
      }
      if (isAutoEnabled && !util.reserveUI()) {
        return;
      }

      $.each(files, function (i, file) {
        context.find('.selected-file').empty().append(
          '<div id="' + file.id + '">' +
          file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
        '</div>');
      });
      
      if (isAutoEnabled) {
        util.log('starting uploader');
        uploader.start();
      }

      uploader.reposition();
    });

    uploader.bind('BeforeUpload', function () {
      context.find('.selected-file').text('Uploading...');
      uploader.disableBrowseButton();
      uploader.startTimestamp = util.now();
    });

    uploader.bind('UploadProgress', function (up, file) {
      var width = context.find('.selected-file').outerWidth();
      var offset = parseInt(-500 + file.percent * width / 100) + 'px 0';
      context.find('.selected-file').css('background-position', offset);
      if (file.percent === 100) {
        var delay = Math.max(uploader.startTimestamp + 2000 - util.now(), 0);
        setTimeout(function () {
          if (!uploader.startTimestamp) return;
          context.find('.selected-file').text('Processing...');
        }, delay);
      }
    });

    uploader.bind('Error', function (up, err) {
      context.find('.error').append("<div>Error: " + err.code +
        ", Message: " + err.message +
        (err.file ? ", File: " + err.file.name : "") +
        "</div>"
      );

      up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('FileUploaded', function (up, file, response) {
      context.find('.selected-file').text('Saving widget...');
      uploader.layover.find('input').show();

      var resData = $.parseJSON(response.response);
      util.log('Upload, complete.', up, file, response, resData);
      delete uploader.startTimestamp;

      callback = uploader.yomobiOptions.onDone;
      callback(resData);
    });
  },

  createUploaderCallback: function (onSuccess) {
    return function (data) {
      util.log('wut wut',data);
      if (data.result !== 'success' && data.result !== 'noupload') {
        alert('Photo upload failed ('+ data.result +')');
        util.releaseUI();
        return;
      }
      onSuccess(data);
    }
  }
};

_.extend(util, builderUtil);

})();

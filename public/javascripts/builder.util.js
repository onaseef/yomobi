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

var vimeoEmbedTemplate = util.getTemplate('vimeo-embed-html');

var vmRegex = /^.*((vimeo.com\/)|(v\/)|(\/u\/\w\/)|(video\/))([^#\&\?]*).*/;
var getVimeoVideoId = function (url) {
  var match = url.match(vmRegex);
  if (match && match[6].length > 0) {
    return match[6];
  } else {
    return undefined;
  }
}


var _blank = {};

var builderUtil = {

  // namespace for shared widget editor functions
  widgetEditor: {},

  // WARNING: If there are multiple values with the same name,
  // values will be overwritten.
  serializedArrayToHash: function (array) {
    var hash = {};
    _.each(array, function (param) {
      hash[param.name] = param.value;
    });
    return hash;
  },

  dialog: function (html,buttons,title,options) {
    options || (options = _blank);
    return $(html).dialog({
      resizable: false,
      modal: true,
      draggable: false,
      closeOnEscape: false,
      buttons: buttons,
      title: title,
      width: options.width || 360
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
          $(this).find('img').removeClass('jwysiwyg-selected');

          if (e.target.tagName.toLowerCase() === 'img') {
            $(e.target).addClass('jwysiwyg-selected');
            return false;
          }
        }
      },
      controls: {
        insertImage: { visible:false },
        insertTable: { visible:false },
        subscript: { visible:false },
        superscript: { visible:false },
        html: { visible:true },
        uploadImage: {
          visible: true,
          groupIndex: 9,
          exec: util.jeditorImageDialog,
          className: 'uploadImage',
          tooltip: g.i18n.wysiwyg.add_picture
        },
        embedYoutube: {
          visible: true,
          groupIndex: 9,
          exec: util.jeditorYoutubeDialog,
          className: 'embedYoutube',
          tooltip: g.i18n.wysiwyg.add_video
        }
      },

      plugins: {
        i18n: { lang:g.i18n_locale }
      }

    });
    // $('.wysiwyg iframe').css('height',250).css('width',320);
  },

  _createDummyImage: function () {
    return $('<img class="yo">').css({
      float: 'none',
      width: 'auto',
      maxWidth: '100%'
    }).attr('data-size',1);
  },

  jeditorImageDialog: function (img, options) {
    var $img, currentThumb, uploader
      , widget = bapp.currentEditor.widget
      , isNew = !img
      , $parent = $(img).parent()
    ;

    if (isNew) {
      // Check for selected image
      $img = $(this.editorDoc).find('.jwysiwyg-selected');
      if ($img.length == 0) {
        $img = util._createDummyImage();
      }
      else {
        $parent = $img.parent();
        util.log('PARENT', $parent);
        isNew = false;
      }
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
          if (!imgAttrs.src) return $(this).dialog('close');
          $('#jeditor').data('wysiwyg').ui.focus();
          $('#jeditor').wysiwyg('insertImage', imgAttrs.src, {
            src: imgAttrs.src,
            style:'float:none'
          });
          util.jeditorImageDialog( $('#jeditor').data('wysiwyg').lastInsertedImage );

          if (uploader && uploader.instanceId !== 'dialog') {
            // temp uploader to workaround cancelling; destroy
            uploader.destroy();
          }
        }
        else {
          var origImg = dialog.find('img.hide')[0];
          if ($.browser.msie) {
            $(origImg).css({
              position: 'absolute', top: -1000, left: -1000,
              display: 'block', visibility: 'hidden'
            });
          }

          if (origImg.width === 0) {
            // image not loaded yet. Wait until it does
            var retry = arguments.callee;
            $(origImg).load(function () {
              util.releaseUI();
              retry();
            });
            return;
          }

          var newSize = parseInt(imgAttrs.size)
                         || ( Math.round($img[0].width / origImg.width * 100) )
            , newSize = util.bound(newSize, 1, 100)
            , width = Math.round(newSize * origImg.width / 100)
            , height = Math.round(newSize * origImg.height / 100)
          ;
          if (width < 16 || height < 16) {
            newSize = Math.round(100 * 16 / Math.min(origImg.width, origImg.height));
            width = Math.round(newSize * origImg.width / 100);
            height = Math.round(newSize * origImg.height / 100);
          }

          $img.addClass('yo')
              .removeClass( 'yo-' + $img.css('float') )
              .addClass('yo-' + imgAttrs.float)
              .data('size', newSize)
              .attr('data-size', newSize)
              .css({
                float: imgAttrs.float,
                maxWidth:'100%',
                width: width + 'px',
                height: height + 'px'
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
      'Cancel': function (e) {
        if (uploader && uploader.state === plupload.STARTED) {
          uploader.stop();
          uploader.yoIsCancelled = true;
          util.releaseUI();
        }
        else if (uploader && uploader.instanceId !== 'dialog') {
          // temp uploader to workaround cancelling; destroy
          uploader.destroy();
        }
        dialogCloseFunc.call(this, e);
      }
    }, isNew ? g.i18n.category.dialog.upload_image : g.i18n.category.dialog.edit_image);

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

    setTimeout(function () {
      dialog.find('.focus').focus();
    }, 200);

    if (!$img.data('size')) {
      var origImg = dialog.find('img.hide')[0];
      var updateSize = function () {
        var size = Math.round($img[0].width / origImg.width * 100);
        size = Math.round(size / 10) * 10;
        dialog.find('[name=size]').val(size);
      };
      if (origImg.width) updateSize();
      else origImg.onLoad = updateSize;
      dialog.find('[name=size]').val('100');
    }
    else {
      dialog.find('[name=size]').val( $img.data('size') );
    }

    if (isNew) {
      var currentUploader = util._uploaders['dialog']
        , uploader_id = 'dialog'
      ;
      if (currentUploader && currentUploader.yoIsCancelled === true) {
        uploader_id = util.generateId();
      }

      uploader = util.initUploader( dialog.find('.wphoto-wrap'), {
        instanceId: uploader_id,
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
        
        var vurl = dialog.find('[name=url]').val();
        var html = null;

        // First check if the video URL is a YouTube video URL
        var vid = getYoutubeVideoId( vurl );
        
        // If the vid is valid, it is a YouTube video. Handle it as such
        if (vid) {
          html = youtubeEmbedTemplate({ vid: vid || 'GGT8ZCTBoBA' });
        }
        else {
          // Check if the video is a Vimeo URL
          vid = getVimeoVideoId( vurl );
          if (vid) {
            html = vimeoEmbedTemplate( { vid: vid || '17853047' } );
          }
        }

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
    setTimeout(function () {
      dialog.find('.focus').focus();
    }, 200);
  },

  toHtml: function (jqueryObject) {
    return $('<div>').html( jqueryObject ).html();
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
  stripAllStyles: function ($group) {
    $group.jquery || ($group = $($group));

    $group.each(function (idx,elem) {
      if ( $(elem).hasClass('yo') ) return;

      if ( elem.tagName && _.include(util.tagsToStrip,elem.tagName.toLowerCase()) ) {
        var plainText = $('<p>' + $(elem).text() + '</p>');
        $(elem).replaceWith(plainText);
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
        util.stripAllStyles( $(elem).children() );
    });
  },

  stripMeta: function (str) {
    return str.replace(/jwysiwyg-selected/g, '');
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
      $('[name=upload_submit]').prop('disabled',false);
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

    if (uploader && uploader.runtime === 'flash' && options.emptyQueue) {
      $('#' + uploader.id + '_' + uploader.runtime + '_container').remove();
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

  initUploader: function (context, options) {
    options || (options = {});
    options.context = context;

    var pickerId = util.generateId()
      , uploader = util.getOrCreateUploader({ browse_button:pickerId }, options)
    ;
    uploader.ctx = context;

    if (!options.emptyQueue && uploader.runtime === 'flash') {
      if (uploader.files.length > 0) {
        file = uploader.files[0];
        uploader.ctx.find('.selected-file').empty().append(
          '<div id="' + file.id + '">' +
          file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
        '</div>').trigger('change');
      }
      return uploader;
    }

    uploader.unbindAll();

    uploader.bind('Init', function (up, params) {
      if (uploader.files.length > 0 && uploader.files[0].status === plupload.DONE) {
        uploader.removeFile(uploader.files[0]);
      }
      else if (uploader.files.length > 0) {
        file = uploader.files[0];
        uploader.ctx.find('.selected-file').empty().append(
          '<div id="' + file.id + '">' +
          file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
        '</div>').trigger('change');
      }
    });

    uploader.ctx.find('[name=pick_files]').attr('id', pickerId);

    uploader.init();

    uploader.reposition = function () {
      uploader.refresh(); // Reposition Flash/Silverlight
      if (uploader.yomobiOptions.alwaysOnTop === true) {
        uploader.bringToFront();
      }
    };
    uploader.ctx.find('img').load(function () { uploader.reposition(); });
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
        uploader.ctx.find('.selected-file').empty().append(
          '<div id="' + file.id + '">' +
          file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
        '</div>').trigger('change');
      });
      
      if (isAutoEnabled) {
        util.log('starting uploader');
        uploader.start();
      }

      uploader.reposition();
    });

    uploader.bind('BeforeUpload', function () {
      if (uploader.yoIsCancelled === true) return;

      uploader.ctx.find('.selected-file').text('Uploading...');
      uploader.disableBrowseButton();
      uploader.startTimestamp = util.now();
    });

    uploader.bind('UploadProgress', function (up, file) {
      if (uploader.yoIsCancelled === true) return;

      var width = uploader.ctx.find('.selected-file').outerWidth();
      var offset = parseInt(-500 + file.percent * width / 100) + 'px 0';
      uploader.ctx.find('.selected-file').css('background-position', offset);
      if (file.percent === 100) {
        var delay = Math.max(uploader.startTimestamp + 2000 - util.now(), 0);
        setTimeout(function () {
          if (!uploader.startTimestamp) return;
          uploader.ctx.find('.selected-file').text('Processing...');
        }, delay);
      }
    });

    uploader.bind('Error', function (up, err) {
      if (uploader.yoIsCancelled === true) return;

      if (err.code === -601 && err.file.name.indexOf('.bmp') >= 0) {
        alert('You cannot upload a Bitmap file. Please select ' +
          'files with the following extension: png, jpg, jpeg, gif');
      }
      else if (err.code === -601) {
        alert('Invalid file type. Please select ' +
          'files with the following extension: png, jpg, jpeg, gif');
      }
      else {
        uploader.ctx.find('.error').append("<div>Error: " + err.code +
          ", Message: " + err.message +
          (err.file ? ", File: " + err.file.name : "") +
          "</div>"
        );
      }

      up.refresh(); // Reposition Flash/Silverlight
      util.releaseUI();
    });

    uploader.bind('FileUploaded', function (up, file, response) {
      if (uploader.yoIsCancelled === true) {
        delete uploader.yoIsCancelled;
        return;
      }

      uploader.ctx.find('.selected-file').text('Saving ...');
      uploader.layover.find('input').show();

      var resData = $.parseJSON(response.response);
      util.log('Upload, complete.', up, file, response, resData);
      delete uploader.startTimestamp;

      callback = uploader.yomobiOptions.onDone;
      callback(resData);
    });

    return uploader;
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
  },

  spawnColorPicker: function ($elems, options) {
    options || (options = {});

    $elems.ColorPicker({
      color: function (elem) {
        return $(elem).data('color');
      },
      onBeforeShow: function (elem, colpkr) {
        var inputName = $(elem).data('target')
          , input = bapp.settingsEditor.$('[name='+inputName+']')
        ;
        util.log('EH?',input);
        $(elem).ColorPickerSetColor( input.val() );
      },
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
      },
      onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
      },
      onChange: function (elem, hsb, hex, rgb) {
        $('div',elem).css('backgroundColor', '#' + hex);
        options.onChange && options.onChange('#' + hex, elem);
      }
    });
  },

  updateMobileHeaderColor: function (color) {
    // cover all browsers
    $('#mobile-container .company-info')
    .css('background',color)
    //.css('background-image','-ms-linear-gradient(top, '+color+' 0%, #FFFFFF 275%)')
    //.css('background-image','-moz-linear-gradient(top, '+color+' 0%, #FFFFFF 275%)')
    //.css('background-image','-o-linear-gradient(top, '+color+' 0%, #FFFFFF 275%)')
    //.css('background-image','-webkit-gradient(linear, left top, left bottom, color-stop(0,'+
    //                        color+'), color-stop(2.75, #FFFFFF))')
    //.css('background-image','-webkit-linear-gradient(top, '+color+' 0%, #FFFFFF 275%)')
    //.css('background-image','linear-gradient(top, '+color+' 0%, #FFFFFF 275%)')
    ;
  }
};

_.extend(util, builderUtil);

})();

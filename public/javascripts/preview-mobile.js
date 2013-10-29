(function ($) {
  
  PreviewWatcher = Backbone.View.extend({
    
    el: $('#preview-mobile-site'),

    events: {
      'click': 'previewMobileSite'
    },

    previewMobileSite: function (e) {
      e.preventDefault();
      if (this.winRef && !this.winRef.closed) { this.winRef.close() };

      var emulatorWidth = ($('#mobile-container').height() < 480) ? 320 : 320+util.scrollbarWidth()+5;
      this.winRef = window.open(e.target.href,'Your_Mobile_Website',
        'width=' + emulatorWidth + ',height=480,scrollbars=yes');
    }
  });

  window.pw = new PreviewWatcher();

})(jQuery);

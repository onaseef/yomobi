//
// BUILDER
//
(function ($) {
  
  // 't' comes after 'b', thus I'm extending link_fb for lazily purposes
  widgetClasses.link_twitter = widgetClasses.link_fb.extend({
    baseName: 'twitter',
  });
  
})(jQuery);

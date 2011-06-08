//
// MOBILE
//
(function ($) {
  var mapUrlBase = 'http://maps.google.com/maps/api/staticmap?'
    , mapUrlOptions = '&size=300x300&sensor=false'
  ;
  
  window.widgetClasses.gmap = Widget.extend({
    requiredAttrs: ['addr1','city','state'],

    getFullAddress: function () {
      return [this.get('addr1'), this.get('addr2'),
              this.get('city') + ', ' + this.get('state'),
              this.get('zip'),   this.get('country')].join(' ');
    },

    getMapUrl: function (zoomLevel) {
      var address = encodeURIComponent(this.getFullAddress())
        , zoomLevel = zoomLevel || 11
      ;
      return mapUrlBase + '&center=' +
             address + '&markers=' + address +
             '&zoom=' + zoomLevel + mapUrlOptions;
    },
    
    getShowData: function () {
      var extraData = {
        fullAddress: this.getFullAddress(),
        mapUrl: this.getMapUrl(),
        mapUrl2: this.getMapUrl(14)
      };
      return _.extend({},this.toJSON(),extraData);
    }
  });
  
})(jQuery);


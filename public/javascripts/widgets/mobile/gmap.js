//
// MOBILE
//
(function ($) {
  var mapUrlBase = 'http://maps.google.com/maps/api/staticmap?'
    , mapUrlOptions = '&size=300x300&sensor=false'
    , externalMapUrlBase = 'http://maps.google.com/maps?'
  ;
  
  window.widgetClasses.gmap = Widget.extend({
    validForShowing: function () {
      return this.get('bname') || (this.get('addr1') && this.get('city') && this.get('state'));
    },

    onHomeViewClick: function () {
      if (!this.get('addr1') && this.validForShowing() && false) {
        window.open(externalMapUrlBase + 'q=' + this.get('bname'));
        return false;
      }
      return true;
    },

    getFullAddress: function () {
      return [this.get('bname'), this.get('addr1'), this.get('addr2'),
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


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
      return this.get('bname') || (this.get('addr1') && this.get('city'));
    },

    onHomeViewClick: function () {
      if (!this.get('addr1') && this.validForShowing() && false) {
        window.open(externalMapUrlBase + 'q=' + this.get('bname'));
        return false;
      }
      return true;
    },

    getAddress: function () {
      var city_state = _.compact([this.get('city'), this.get('state')]).join(', ');
      return _.compact( [this.get('addr1'), this.get('addr2'),
                         city_state, this.get('zip')] );
    },

    getFullAddress: function () {
      var addr = this.getAddress();
      if (addr.length === 0)
        return this.get('bname');
      else {
        addr.unshift(this.get('bname') + ',');
        addr.push(this.get('country'));
        return addr.join(' ');
      }
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
        mapUrl2: this.getMapUrl(14),
        isAddressPresent: this.getAddress().length > 0
      };
      return _.extend({},this.toJSON(),extraData);
    }
  });
  
})(jQuery);


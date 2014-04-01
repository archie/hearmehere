var Locator = function(lat, lon) {
  'use strict';

  var defaultLatLong = new google.maps.LatLng(lat, lon);
  var map = new google.maps.Map(document.getElementById('map-canvas'), { zoom: 11 });

  // load map and set to current position
  this.run = function() {
    // find our position 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        codeLatLng.call(this, pos);
      },
      function() {
        handleNoGeolocation.call(this, true);
      });
    }

    // make sure center is always at the center
    $(window).resize(function() {
      map.setCenter(defaultLatLong);
    });
  };

  var codeLatLng = function(pos) {
    var marker;
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow();
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    var latlng = new google.maps.LatLng(lat, lon);

    defaultLatLong = latlng; // update default

    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          setFormVariables.call(this, results[1], lat, lon);
          map.setZoom(16);
          map.setCenter(latlng);
          marker = new google.maps.Marker({
              position: latlng,
              map: map
          });
          infowindow.setContent(results[1].formatted_address);
          infowindow.open(map, marker);
        } else {
          handleNoGeolocation.call(this, false);
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  };

  var handleNoGeolocation = function(errorFlag) {
    var mapOptions = {
      zoom: 11,
      center: defaultLatLong,
      mapTypeId: 'roadmap'
    };

    map.setCenter(mapOptions.center);
  };

  var setFormVariables = function(result, latitude, longitude) {
    $('#location_name_tag').text('You are at ' + result.formatted_address);
    $('#location_latitude_field').val(latitude);
    $('#location_longitude_field').val(longitude);
  };

  return this;
};

// Run locator on document load
var locator = new Locator(55.604981, 13.003822); // malmo, sweden
google.maps.event.addDomListener(window, 'load', locator.run);

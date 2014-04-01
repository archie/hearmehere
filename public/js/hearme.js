(function(){
  'use strict';

  // global variables
  var defaultLatLong = new google.maps.LatLng(55.604981,13.003822); // Malmo, Sweden
  var map;

  // load map and set to current position
  function initialize() {
    
    // default
    map = new google.maps.Map(document.getElementById('map-canvas'), { zoom: 11 });

    // lookup location on map 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(codeLatLng,
      function() {
        handleNoGeolocation(true);
      });
    }
  }

  function codeLatLng(pos) {
    var marker;
    var geocoder;
    var infowindow = new google.maps.InfoWindow();

    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    defaultLatLong = latlng; // update default

    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          setFormVariables(results[1], pos.coords.latitude, pos.coords.longitude);
          map.setZoom(16);
          map.setCenter(latlng);
          marker = new google.maps.Marker({
              position: latlng,
              map: map
          });
          infowindow.setContent(results[1].formatted_address);
          infowindow.open(map, marker);
        } else {
          handleNoGeolocation(false);
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }

  function handleNoGeolocation(errorFlag) {
    var mapOptions = {
      zoom: 11,
      center: defaultLatLong,
      mapTypeId: 'roadmap'
    };
    map.setCenter(mapOptions.center);
  }

  function setFormVariables(result, latitude, longitude) {
    $('#location_name_tag').text('You are at ' + result.formatted_address);
    $('#location_latitude_field').val(latitude);
    $('#location_longitude_field').val(longitude);
  }

  // global event handlers
  $(window).resize(function() {
    map.setCenter(defaultLatLong);
  });

  google.maps.event.addDomListener(window, 'load', initialize);

})(); 
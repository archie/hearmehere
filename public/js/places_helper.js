var Places = function() {
  'use strict';

  this.find = function(lat, lng) {
    $.ajax({
      dataType: "json",
      url: "/internal/foursquare/?latitude=" + lat + "&longitude=" + lng,
      data: "",
      success: function (places) {
        populate.call(this, places);
      }
    });
  };

  var populate = function(places) {
    var locations = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: places
    });

    locations.initialize();

    $('#bloodhound .typeahead').typeahead({
      hint: true,
      highlight: true
    },
    {
      name: 'locations',
      displayKey: 'name',
      source: locations.ttAdapter(),
      templates: {
        empty: [
          '<div class="empty-message">',
          'You know this place better than I do.',
          '</div>'
        ].join('\n')
      }
    });

    // register event handlers
    var completeType = function(jqEvent, place, dataset) {
      $('#location_type').val(place.type);
      $('#location_latitude_field').val(place.location.latitude);
      $('#location_longitude_field').val(place.location.longitude);
    };

    $('.typeahead').on('typeahead:selected', completeType);
    $('.typeahead').on('typeahead:autocompleted', completeType);
  };

  return this;
};
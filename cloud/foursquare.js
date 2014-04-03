var foursquareKeys = require('cloud/foursquare_keys').foursquareKeys

var Foursquare = function() {
  var API_VERSION = 20140330;

  this.suggestions = function(req, res) {
    if (!req.query.latitude || !req.query.longitude) {
      res.status(400).send();
    }

    Parse.Cloud.httpRequest({
      url: 'https://api.foursquare.com/v2/venues/search',
      params: {
        'client_id': foursquareKeys.foursquareClientId,
        'client_secret': foursquareKeys.foursquareClientSecret,
        'v': API_VERSION,
        'll': req.query.latitude + ',' + req.query.longitude,
        'radius': 100,
        'intent': 'browse'
      },
      success: function(httpResponse) {
        var data = httpResponse.data;
        var filteredVenues = cleanResults.call(this, data.response.venues);
        res.send(filteredVenues);
      },
      error: function(httpResponse) {
        res.status(httpResponse.status).send();
      }
    });
  }; 

  var cleanResults = function(venues) {
    function isNotHome(category) {
      if (category === undefined) {
        return 'unknown';
      } else {
        return category.name;
      }
    }

    var filteredVenues = venues.map(function(venue) {
      var shortVenue = {
        'id': venue.id,
        'name': venue.name,
        'location': {
          'latitude': venue.location.lat,
          'longitude': venue.location.lng
        },
        'type': isNotHome(venue.categories[0])
      };
      return shortVenue;
    }).filter(function(venue) {
      return venue.type.indexOf("Home") == -1;
    });

    return filteredVenues;
  }

  return this;
}

module.exports = new Foursquare();
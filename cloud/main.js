require('cloud/app.js');

Parse.Cloud.define("store_location", function(request, response) {
  var HotSpot = Parse.Object.extend("HotSpot");
  var hotspot = new HotSpot();

  hotspot.set("location_name", request.params.location_name);
  hotspot.set("location_type", request.params.location_type);
  hotspot.set("location_info", request.params.location_info);

  var point = new Parse.GeoPoint({
    latitude: request.params.latitude,
    longitude: request.params.longitude
  });

  hotspot.set("location", point);

  hotspot.save(null, {
    success: function(hotspot) {
      response.success({
        "stored": true,
        "objectId": hotspot.objectId
      });
    },
    error: function(hotspot, error) {
      response.error({
        "stored": false,
        "error": error
      });
    }
  });
});

Parse.Cloud.define("list_locations", function(request, response) {
  var HotSpot = Parse.Object.extend("HotSpot");
  var HotSpots = Parse.Collection.extend({
    model: HotSpot,
    query: (new Parse.Query(HotSpot))
  });

  var collection = new HotSpots();

  collection.fetch({
    success: function(collection) {
      response.success(collection.models);
    },
    error: function(collection, error) {
      response.error(error);
    }
  });
});

Parse.Cloud.define("find_location", function(request, response) {
  var HotSpot = Parse.Object.extend("HotSpot");
  var query = new Parse.Query(HotSpot);
  query.equalTo("objectId", request.params.objectId);
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function(error) {
      response.error(error);
    }
  });
});

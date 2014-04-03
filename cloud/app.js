
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Local development or production
if ('local' == app.get('env')) {
  app.use(express.static(__dirname + '/../public'));
  app.set('views', __dirname + '/views');
} else {
  app.set('views', 'cloud/views');  // Specify the folder to find templates  
};

// Generic configuration
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

app.get('/hear', function(req, res) {
  res.render('hear', { success: true, data: null });
});

app.post('/hear', function(req, res) {

  var formdata = {
    'location_name': req.body.location_name,
    'location_type': req.body.location_type,
    'location_info': req.body.location_info,
    'latitude': parseFloat(req.body.latitude),
    'longitude': parseFloat(req.body.longitude)
  };

  Parse.Cloud.run('store_location', formdata, {
    success: function(hotspot) {
      res.render('hear', { success: true, data: formdata });
    },
    error: function(error) {
      console.error(error);
      res.render('hear', { success: false, data: formdata });
    }
  });
});

app.get('/internal/foursquare', function(req, res) {
  res.send(JSON.stringify(req.params));
});

// Run express
if ('local' == app.get('env')) {
  app.listen(3000);
} else {
  app.listen();
};

module.exports = app;